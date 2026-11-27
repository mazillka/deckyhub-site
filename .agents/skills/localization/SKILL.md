---
name: localization
description: Translate the website into Ukrainian and keep both languages in step - the pages under docs/uk/ and the Paired devices page's markup and script messages. Use when changing any user-facing text on deckyhub.com.
---

# Ukrainian on deckyhub.com

DeckyHub's own languages (`src/i18n/` in deckyhub-plugin) are separate from the website's.

| Text | Where | What catches a miss |
| --- | --- | --- |
| Hand-written pages | `docs/uk/*.html`, next to the English page | The audit checks that `hreflang` pairs link back; nothing compares the wording |
| Paired devices markup | English in `devtools/remote_panel.py`, translated by the table in `devtools/remote_page_uk.py` | The build fails when a table row's English is no longer in the markup; `tests/test_paired_devices_page.py` checks the Ukrainian panel |
| Paired devices script messages | English in `docs/remote-*.js`, translated on screen by `docs/remote-i18n.js` | `tests/remote-i18n.test.js` |

- Change the English and Ukrainian text in the same pull request.
- Give a new sentence in the markup its own table row: don't rely on the build to notice a sentence that never had one.
- Wording the page shares with the app uses the app's words (*Віддалений доступ*, *Підтвердити*, *З’єднані браузери*).
- After editing `guide.html`, `help.html` or `authors.html` in either language, run `python devtools/html_to_md.py`.
