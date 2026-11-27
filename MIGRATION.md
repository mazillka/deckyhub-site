# Moving deckyhub.com here

This repository was assembled from [deckyhub-plugin](https://github.com/mazillka/deckyhub-plugin): `main` from its `main`, `develop` from its `develop`. History stays there. deckyhub.com has been deployed from this repository since 2026-11-26; DNS didn't change.

## Left to do

- Check Remote Install from a paired phone or browser with the device awake.
- Merge the removal of the website in deckyhub-plugin ([#566](https://github.com/mazillka/deckyhub-plugin/pull/566): `develop`, then `main`). Until it reaches `main`, the plugin's old workflow still publishes a copy at mazillka.github.io/deckyhub-plugin.
- Protect `main` and `develop` like the other repositories.

## After a DeckyHub release

The release notes page is built from DeckyHub's releases. The site rebuilds every day at 06:00 UTC. To rebuild right after a release, deckyhub-plugin's `release.yml` needs a token that can start workflows here: a fine-grained token for this repository only, with **Actions: read and write**, saved in deckyhub-plugin as the secret `SITE_DEPLOY_TOKEN`. Without it, the step is skipped and the daily build picks the release up.

A change to DeckyHub's README steps also shows after the next build.
