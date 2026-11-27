"""The registry's shared warning texts and cases (registry/warnings.json and contract-cases.json), which DeckyHub and
the browser extension are tested against too. DECKYHUB_REGISTRY is a checkout's registry/apps.json (CI sets it)."""

import json
import os
import re
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "devtools"))
import plugin_data
from plugin_badges import badges_of
from scan_format import scan_kind

FOLDER = Path(os.environ["DECKYHUB_REGISTRY"]).parent if os.environ.get("DECKYHUB_REGISTRY") else None
# shortcut: a registry branch without the files is skipped, make this a failure once they're on the registry's main.
MISSING = FOLDER is None or not (FOLDER / "warnings.json").exists()
SHA = "a" * 64


def read(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


@unittest.skipIf(MISSING, "needs DECKYHUB_REGISTRY, a registry checkout that has warnings.json")
class RegistryContractTests(unittest.TestCase):
    def test_the_fallback_copy_is_the_registrys_warnings_json(self):
        self.assertEqual(read(ROOT / "devtools" / "warnings.json"), read(FOLDER / "warnings.json"))

    def test_the_shared_scan_cases_give_the_same_badge(self):
        cases = read(FOLDER / "contract-cases.json")["scans"]
        self.assertTrue(cases)
        for case in cases:
            with self.subTest(case["name"]):
                channel = {"sha256": SHA}
                for scanner, key in (("clamav", "clamav"), ("yara", "yara")):
                    if case[key]:
                        channel[scanner] = {"result": case[key]}
                vt, md = case["virusTotal"], case["metaDefender"]
                counts = {"malicious": vt, "suspicious": 0, "harmless": 0, "undetected": 10}
                vt_reports = {} if vt is None else {SHA: {"state": "complete", "stats": counts}}
                reports = {} if md is None else {SHA: {"state": "complete", "flagged": md, "total": 10}}
                self.assertEqual(scan_kind(channel, reports, vt_reports), case["expect"]["kind"])

    def test_the_shared_warning_cases_show_the_same_badges_on_a_plugin_page(self):
        table = read(FOLDER / "warnings.json")["warnings"]
        for case in read(FOLDER / "contract-cases.json")["warnings"]:
            with self.subTest(case["name"]):
                page = "".join(badges_of(case["stats"], {}, plugin_data.WARNINGS))
                shown = re.findall(r'<span class="badge (\w+)">([^<]+)</span>', page)
                expected = [
                    (
                        "stale" if table[badge["id"]]["tone"] == "danger" else "warn",
                        ("Pre-release: " if badge["prerelease"] else "") + table[badge["id"]]["label"],
                    )
                    for badge in case["expect"]
                ]
                self.assertEqual(shown, expected)


class WarningTextsTests(unittest.TestCase):
    def test_a_build_keeps_the_fallback_text_when_the_registrys_is_missing_or_broken(self):
        new = {"label": "New", "hint": "A new one."}
        published = {"warnings": {"blocked": {"label": ""}, "obfuscated": "broken", "new": new}}
        for text, expected_new in ((json.dumps(published), ("New", "A new one.")), (None, None), ("[]", None)):
            with mock.patch.object(plugin_data, "fetch", lambda url, text=text: text):
                warnings = plugin_data.load_data()["warnings"]
            self.assertEqual(warnings["blocked"], plugin_data.WARNINGS["blocked"])
            self.assertEqual(warnings["obfuscated"], plugin_data.WARNINGS["obfuscated"])
            self.assertEqual(warnings.get("new"), expected_new)


if __name__ == "__main__":
    unittest.main()
