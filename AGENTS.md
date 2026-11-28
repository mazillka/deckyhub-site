# DeckyHub website agent guide

This file provides guidance to coding agents (including Claude Code) working in this repository.

Repository skills live only in `.agents/skills/`; `.claude/skills` is a symlink to it for Claude Code (on Windows, run `git config core.symlinks true` before checking out). Edit them there; apply a skill when it is relevant to the task.

## What this is

[deckyhub.com](https://deckyhub.com/), the website of [DeckyHub](https://github.com/mazillka/deckyhub-plugin). The layout and the commands to build and test are in [README.md](README.md).

- `docs/` holds the hand-written pages, in English and under `uk/`. `devtools/build-site.py` assembles the site; it also writes the plugin, category and Paired devices pages.
- The catalog, badges and scans come from [deckyhub-registry](https://github.com/mazillka/deckyhub-registry). The install steps come from deckyhub-plugin's README and the release notes from its releases, so a renamed README heading there can break this build.
- The in-app **DeckyHub page** button opens `plugins/<id>.html`: keep that path stable.
- Remote Install's web client is here and its device side is in deckyhub-plugin (the `remote-install` skill).

## Rules

- **Informative, never judging.** Give every fact with its explanation, say what is missing (no scan yet, no audit data) as plainly as what was found, and don't combine findings into a verdict or score. The full rule is in deckyhub-plugin's `AGENTS.md`.
- A change to badges, warnings or scan wording (`devtools/plugin_badges.py`, `scan_format.py`, `plugin_data.py`, `docs/remote-plugins.js`) also goes to the plugin, the browser extension and the registry; say in the pull request if one doesn't apply. Warning texts and tones come from the registry's `registry/warnings.json`: change them there first, then in the fallback copy `devtools/warnings.json`. `tests/test_registry_contract.py` and `tests/registry-contract.test.js` compare both with the registry and run its shared cases (`DECKYHUB_REGISTRY`).
- Say "your device" and "Decky Loader", not "Steam Deck", unless something is true only of a Steam Deck.
- Don't edit the Help, Guide and Authors Markdown copies (`docs/*.md`, `docs/uk/*.md`): edit the HTML page, then run `python devtools/html_to_md.py`.
- Pages, `robots.txt`, the sitemap, `llms.txt` and structured data: the `seo-and-ai` skill. Ukrainian text: the `localization` skill.
- `tests/test_plugin_pages.py`, `tests/test_docs.py` and `devtools/audit-site.py` check the site. The audit already covers titles, descriptions, links and the sitemap, so don't repeat those tests per page.

## Branches and releases

The `branches` skill has the shared branch strategy; this repo adds:

- There are no versions or tags. Shipping `develop` to `main` is the release.
- Rulesets on `main` and `develop` require a pull request and the `test` check.
- `pages.yml` runs from `main`: after a push there that changes the site, daily at 06:00 UTC, or when started by hand. It deploys `main` as the live site and `develop` under `/develop/` together. `preview-site.yml` starts it after a push to `develop` that changes the site. It builds only while the `DEPLOY_SITE` repository variable is `true`.
- A failure in the `/store` step (deckyhub-registry's `build_decky_store.py`) or in the preview never stops the live deployment.
