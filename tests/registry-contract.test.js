// The Paired devices list shows the registry's shared warning cases (registry/contract-cases.json) like the other
// readers do. DECKYHUB_REGISTRY is a checkout's registry/apps.json (CI sets it).
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { describe } from "../docs/remote-plugins.js";

const folder = process.env.DECKYHUB_REGISTRY ? dirname(process.env.DECKYHUB_REGISTRY) : "";
const read = (name) => JSON.parse(readFileSync(join(folder, name), "utf8"));
// shortcut: a registry branch without the files is skipped, make this a failure once they're on the registry's main.
const skip = !(folder && existsSync(join(folder, "warnings.json"))) && "needs a registry checkout with warnings.json";

const element = () => ({
  children: [],
  className: "",
  title: "",
  textContent: "",
  href: "",
  append(...items) {
    this.children.push(...items);
  },
  get childElementCount() {
    return this.children.length;
  },
});

test("the registry's shared warning cases show the same badges", { skip }, () => {
  const { warnings } = read("warnings.json");
  // The labels as plugins/info.json carries them: [label, hint] per warning.
  const labels = Object.fromEntries(Object.entries(warnings).map(([id, item]) => [id, [item.label, item.hint]]));
  for (const { name, stats, expect } of read("contract-cases.json").warnings) {
    const parts = describe({ createElement: element }, { id: "x", ...stats }, labels);
    const shown = parts
      .flatMap((part) => part.children)
      .map((badge) => [badge.className.split("remote-badge-")[1], badge.textContent, badge.title]);
    assert.deepEqual(
      shown,
      expect.map(({ id, prerelease }) => [
        warnings[id].tone === "danger" ? "bad" : "warn",
        (prerelease ? "Pre-release: " : "") + warnings[id].label,
        warnings[id].hint,
      ]),
      name,
    );
  }
});
