# Moving deckyhub.com here

This repository was assembled from [deckyhub-plugin](https://github.com/mazillka/deckyhub-plugin): `main` from its `main` (the live site), `develop` from its `develop`. History stays there. Until the switch, **the live site is still deployed from deckyhub-plugin**, so a site change made there must be copied here too.

## Switch over

1. Make this repository public (GitHub Pages needs it on the free plan; the plugin's README and the `deckyhub` submodule link need it too).
2. Settings → Pages → Source: **GitHub Actions**. Allow `main` in the `github-pages` environment.
3. Remove the custom domain from deckyhub-plugin's Pages settings, then add `deckyhub.com` here and turn on **Enforce HTTPS**. DNS doesn't change. Expect a short outage while GitHub moves the domain and checks the certificate.
4. Set the repository variable and deploy:

   ```sh
   gh variable set DEPLOY_SITE --body true --repo mazillka/deckyhub-site
   gh workflow run pages.yml --ref main --repo mazillka/deckyhub-site
   ```

5. Check `/`, `/uk/`, `/plugins/`, `/store`, `/develop/` and Remote Install from a paired phone. The domain is the same, so paired browsers and Decky's custom store URL keep working.
6. Merge the matching removal in deckyhub-plugin (`develop`, then `main`). Do it only after step 5: the removal deletes the workflow that deploys the site.
7. Protect `main` and `develop` like the other repositories.

## After a DeckyHub release

The release notes page is built from DeckyHub's releases. The site rebuilds every day at 06:00 UTC. To rebuild right after a release, deckyhub-plugin's `release.yml` needs a token that can start workflows here: a fine-grained token for this repository only, with **Actions: read and write**, saved in deckyhub-plugin as the secret `SITE_DEPLOY_TOKEN`. Without it, the step is skipped and the daily build picks the release up.

A change to DeckyHub's README steps also shows after the next build.
