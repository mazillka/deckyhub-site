// The catalog's search and filter script (FILTER_JS in devtools/catalog_pages.py), run against a tiny stand-in DOM.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../devtools/catalog_pages.py", import.meta.url), "utf8")
  .match(/FILTER_JS = """([\s\S]*?)"""/)[1]
  .replaceAll("\\\\", "\\"); // Python's string escapes

function element(extra = {}) {
  const on = {};
  return {
    dataset: {},
    on,
    addEventListener: (type, run) => (on[type] = run),
    setAttribute() {},
    ...extra,
  };
}

function open(hash) {
  const card = element({ dataset: { cat: "utilities", repo: "o/css-loader" } });
  card.querySelector = (name) => ({ textContent: name === "strong" ? "CSS Loader" : "" });
  const q = element({ value: "" });
  const box = element({ open: false });
  const store = element();
  const ids = { q, count: element(), "filter-box": box, "store-only": store };
  const location = { hash, pathname: "/plugins/", search: "" };
  const saved = [];
  const window = element({ matchMedia: () => ({ matches: false }) });
  vm.runInNewContext(source, {
    window,
    location,
    URLSearchParams,
    clearTimeout() {},
    setTimeout: (run) => run(),
    history: { state: null, replaceState: (_state, _title, url) => saved.push(url) },
    document: {
      getElementById: (id) => ids[id],
      querySelectorAll: (selector) => (selector === "#list .app" ? [card] : []),
    },
  });
  return { card, q, box, store, location, saved, window };
}

test("search matches each word, in any order", () => {
  const page = open("");
  for (const [text, shown] of [
    ["loader css", true],
    ["  css   loader ", true],
    ["css audio", false],
  ]) {
    page.q.value = text;
    page.q.on.input();
    assert.equal(!page.card.hidden, shown, text);
  }
});

test("the filters are saved in the address and read back from it", () => {
  const page = open("#q=loader+css&store=1");
  assert.equal(page.q.value, "loader css");
  assert.equal(page.box.open, true);
  assert.equal(page.card.hidden, true, "the card is not in the Decky store");
  page.store.on.click();
  assert.equal(page.saved.at(-1), "/plugins/#q=loader+css");
  assert.equal(page.card.hidden, false);
});

test("the old category link works, and other hashes keep the filters", () => {
  const page = open("#cat=controllers");
  assert.equal(page.card.hidden, true);
  page.location.hash = "#main";
  page.window.on.hashchange();
  assert.equal(page.card.hidden, true);
  assert.deepEqual(page.saved, []);
});
