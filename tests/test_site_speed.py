"""What keeps deckyhub.com fast: the home page's walkthrough is downloaded only when played, and the pages that load the remote-install modules fetch them together."""

import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "devtools"))
import plugin_pages  # noqa: E402


class SiteSpeedTests(unittest.TestCase):
    def test_the_home_page_shows_a_still_picture_and_plays_the_walkthrough_only_on_request(self):
        for path, prefix in (("docs/index.html", ""), ("docs/uk/index.html", "../")):
            page = (ROOT / path).read_text(encoding="utf-8")
            self.assertIn(f'<img id="tour" src="{prefix}img/discover.webp"', page, path)
            # Moving content that runs over five seconds needs a way to stop it (WCAG 2.2.2): none starts by itself.
            self.assertIn(f'data-play="{prefix}img/deckyhub.webp"', page, path)
            self.assertNotIn(f'src="{prefix}img/deckyhub.', page, path)
            self.assertNotIn(f'srcset="{prefix}img/deckyhub.', page, path)

    def test_every_page_that_loads_the_remote_modules_preloads_the_ones_they_import(self):
        imports = set()
        for name in (
            "remote-install.js",
            "remote-scan.js",
            "remote-share.js",
            "remote-plugins.js",
            "remote-updates.js",
            "remote-session.js",
            "remote-devices.js",
            "remote-pairing.js",
            "remote-request.js",
        ):
            imports |= set(
                re.findall(r"from '\./(remote-[\w-]+\.js)'", (ROOT / "docs" / name).read_text(encoding="utf-8"))
            )
        # The markup of the pages that load the remote-install scripts lives in these two modules.
        source = "".join(
            (ROOT / "devtools" / f"{name}.py").read_text(encoding="utf-8") for name in ("remote_panel", "catalog_pages")
        )
        scripts = source.count('<script type="module" src="/remote-install.js"></script>')
        self.assertEqual(scripts, 3)
        for name in imports:
            self.assertEqual(source.count(f'<link rel="modulepreload" href="/{name}">'), scripts, name)
        self.assertEqual(len(imports), 11)

    def test_the_installed_app_asks_the_server_before_using_a_cached_file(self):
        worker = (ROOT / "docs" / "remote-install" / "sw.js").read_text(encoding="utf-8")
        self.assertIn("fetch(request, { cache: 'no-cache' })", worker)

    def test_the_catalog_skips_painting_cards_that_are_off_screen(self):
        self.assertIn("content-visibility:auto", plugin_pages.EXTRA_STYLE)


if __name__ == "__main__":
    unittest.main()
