# Redirects for the website's old addresses

Plan only: nothing here has been applied. Findings are from 2026-11-27.

| Old address | State | Plan |
| --- | --- | --- |
| `registry.deckyhub.com` | No DNS record. Removed on purpose on 2026-11-14 (deckyhub-registry `ef1dcf9`: it only redirected, and no shipped DeckyHub reads it). A web search still listed its pages. | 1. Redirect it again, at Cloudflare |
| `mazillka.github.io/deckyhub-plugin/` | Still serves a full copy built 2026-11-26 (v3.4.8). Its pages name deckyhub.com as canonical. | 2. Replace it with redirect pages |
| `mazillka.github.io/deckyhub-registry/` | 404. The `deckyhub` README linked to it. | 3. Change the link; no redirect |

## 1. registry.deckyhub.com (Cloudflare, no repository change)

1. DNS: add `registry`, type `AAAA`, value `100::`, **Proxied**. The address is a placeholder: the redirect answers before any server is asked.
2. Rules > Redirect Rules: add these in this order, all **301**, each starting with `http.host eq "registry.deckyhub.com"`. Check that your Cloudflare plan allows this many rules.

| # | Also match | Target |
| --- | --- | --- |
| 1 | `http.request.uri.path in {"/" "/index.html"}` | `https://deckyhub.com/contribute/` |
| 2 | `http.request.uri.path eq "/editor.html"` | `https://deckyhub.com/contribute/editor.html` |
| 3 | `http.request.uri.path in {"/uk/" "/uk/index.html"}` | `https://deckyhub.com/uk/contribute/` |
| 4 | `http.request.uri.path eq "/uk/editor.html"` | `https://deckyhub.com/uk/contribute/editor.html` |
| 5 | `starts_with(http.request.uri.path, "/categories/")` | dynamic: `concat("https://deckyhub.com/plugins/category/", substring(http.request.uri.path, 12))` |
| 6 | `starts_with(http.request.uri.path, "/plugins/") or http.request.uri.path eq "/llms.txt"` | dynamic: `concat("https://deckyhub.com", http.request.uri.path)` |
| 7 | nothing else | `https://deckyhub.com/` |

The old addresses come from `scripts/build_site.py` at deckyhub-registry `0918b18`. Categories now go to their own pages instead of the old `#cat=` filter.

Check each of these answers `301` with the expected `location`:

```sh
curl -sI https://registry.deckyhub.com/plugins/sdh-ludusavi.html
curl -sI https://registry.deckyhub.com/categories/launch-options.html
curl -sI https://registry.deckyhub.com/uk/editor.html
```

Keep it for at least a year, so search engines and saved links move over.

## 2. mazillka.github.io/deckyhub-plugin/ (GitHub Pages)

GitHub Pages can't send a 301 for a `github.io` project address without a custom domain, and that domain now belongs to deckyhub-site. So deploy small redirect pages from deckyhub-plugin:

- One page for each HTML address in `https://deckyhub.com/sitemap.xml`, plus `/remote-install/`, at the same path: a canonical link to the deckyhub.com page, `<meta http-equiv="refresh" content="0; url=...">` and a plain link. A script that keeps the query and `#...` part goes first, so saved links keep their meaning.
- A `404.html` whose script sends any other path to the same path on deckyhub.com.
- No `robots.txt` block and no `noindex`: search engines need to read the pages to follow the move.

Before replacing the copy:

- **Workflow:** check whether deckyhub-plugin's `main` still has a Pages workflow. If the website's removal has merged there, the last copy stays online until something else is deployed.
- **`/store`:** this is a data file, so it can't redirect. A search of the app's code at tags v3.0.0 to v3.4.6 found no `mazillka.github.io` address, but someone may have typed it into Decky as a custom store. Either drop it (Decky then shows an error until they enter `https://deckyhub.com/store`) or keep publishing a fresh copy. Decide this first.
- **`llms.txt`:** can't redirect either. Replace it with a short note pointing to `https://deckyhub.com/llms.txt`.

## 3. mazillka.github.io/deckyhub-registry/

Point links at `https://deckyhub.com/plugins/`. A web search didn't show this address, so turning Pages back on isn't worth it unless Search Console shows traffic to it.

## After applying

In Google Search Console (the domain has a verification record) check that `https://deckyhub.com/sitemap.xml` is submitted. A domain property also covers `registry.deckyhub.com`: inspect a few old addresses a week or two later. Add Bing Webmaster Tools if it isn't set up.
