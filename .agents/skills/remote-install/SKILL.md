---
name: remote-install
description: Work on Remote Install's web client - the Paired devices page, its remote-*.js modules, camera and share-link pairing, the installable app and their Ukrainian text. Use for any change to docs/remote-*.js, docs/remote-install/, devtools/remote_panel.py or remote_page_uk.py, or to the protocol with the DeckyHub plugin.
---

# Remote Install: the web client

A browser on the same network pairs with a device once, then asks DeckyHub there to manage plugins over WebTransport. The listener, the approval on the device and the security rules are in [deckyhub-plugin](https://github.com/mazillka/deckyhub-plugin): read its `remote-install` skill before changing the protocol, and open a pull request in both repositories. Installed DeckyHub versions keep talking to the newest page, so a protocol change must keep older releases working.

| File | What it does |
| --- | --- |
| `docs/remote-install.js` | The page: starts the parts below and re-exports `remote-core.js` |
| `docs/remote-core.js` | Helpers with no page: pairing links, address and certificate pin, one request, browser name and id |
| `docs/remote-session.js` | Status line, the add-device window, the connection |
| `docs/remote-devices.js` | Paired devices: what the browser remembers, cards, picker |
| `docs/remote-pairing.js` | Pairing: the form, a pasted or opened link, approval, reconnect |
| `docs/remote-scan.js` | Scanning the device's QR code with the camera (`docs/vendor/jsqr.js`) |
| `docs/remote-share.js` | A one-time link for another browser |
| `docs/remote-request.js` | One request: sending it, following it, what the page says |
| `docs/remote-plugins.js` | Installed list and plugin packs; plugin facts come from the built `plugins/info.json` |
| `docs/remote-updates.js` | The updates line, registering and adding the app |
| `docs/remote-install.css`, `docs/remote-install/` | Styles; the app's manifest and service worker |
| `devtools/remote_panel.py` | Markup shared by the Paired devices page and the plugin pages |
| `devtools/remote_page_uk.py`, `docs/remote-i18n.js` | Ukrainian text (the `localization` skill) |

- `plugin_pages.write_pages` writes the page at `/paired-devices/` (the canonical one) and `/remote-install/`, in Ukrainian under `/uk/`.
- It installs as an app whose scope is `/remote-install/`. The service worker only keeps a copy for opening offline and asks the server first; it never touches the device.
- It tells the user about waiting updates only while the page or app is open. There is no server, so a closed app can't reach a device on the user's network; real push would need one, which is a privacy decision for the owner, not something to add quietly.
- A page that loads a remote module must preload what that module imports (`tests/test_site_speed.py`), so a new module needs its `modulepreload`.

## Check

Run `npm run typecheck` (lenient `checkJs` over `docs/remote-*.js`), `npm test` and `npm run build`. The tests use a fake page (`tests/helpers/fakePage.js`), not a device: check pairing and requests on a real device with Remote access on.
