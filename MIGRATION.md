# Moving deckyhub.com here

This repository was assembled from [deckyhub-plugin](https://github.com/mazillka/deckyhub-plugin): `main` from its `main`, `develop` from its `develop`. History stays there. deckyhub.com has been deployed from this repository since 2026-11-26; DNS didn't change.

## Left to do

- Check Remote Install from a paired phone or browser with the device awake.

DeckyHub 3.4.9 removed the website from deckyhub-plugin. `main` and `develop` here are protected by rulesets that require the `test` check.

## After a DeckyHub release

The release notes page is built from DeckyHub's releases. The site rebuilds every day at 06:00 UTC. To rebuild right after a release, deckyhub-plugin's `release.yml` needs a token that can start workflows here: a fine-grained token for this repository only, with **Actions: read and write**, saved in deckyhub-plugin as the secret `SITE_DEPLOY_TOKEN`. Without it, the step is skipped and the daily build picks the release up.

A change to DeckyHub's README steps also shows after the next build.
