# deckyhub-site

[deckyhub.com](https://deckyhub.com/): the website of [DeckyHub](https://github.com/mazillka/deckyhub-plugin), a plugin store for [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader).

## Layout

- `docs/` - the pages and the Remote Install web client (`remote-*.js`).
- `devtools/` - `build-site.py` (builds the site), `audit-site.py`, `accessibility.mjs`.
- `screenshots/`, `promo/deckyhub.gif` - the site's images.

The build reads the plugin catalog from [deckyhub-registry](https://github.com/mazillka/deckyhub-registry), and the release notes and the README's install steps from `deckyhub-plugin`.

## Develop

Needs Node 24 and Python 3.11+.

```sh
pip install pillow==13.0.0 markdown==3.7 ruff==0.17.6
npm ci
npm run typecheck
npm test
npm run build                       # into _site/, then audits it
python -m http.server 8765 --directory _site
npm run a11y                        # with the server running; once: npx playwright install chromium
```

`PLUGIN_DIR=../deckyhub-plugin` reads the README from a local checkout; `PLUGIN_BRANCH=develop` reads that branch.

After editing `docs/guide.html`, `help.html` or `authors.html`, run `python devtools/html_to_md.py`.

`main` is the live site; `develop` is published as a preview under `/develop/`.

The Remote Install web client talks to the DeckyHub plugin on the device: a change to that protocol needs a change in both repositories.

## License

GPL-3.0, see [LICENSE.md](LICENSE.md).
