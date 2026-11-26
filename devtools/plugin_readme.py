"""DeckyHub's README, from mazillka/deckyhub-plugin: the site's install steps come from it, so they're written once.
PLUGIN_DIR reads a local checkout instead; PLUGIN_BRANCH picks the branch."""

import os
import urllib.request
from pathlib import Path

RAW = "https://raw.githubusercontent.com/mazillka/deckyhub-plugin/refs/heads/{branch}/{name}"


def read(name: str, preview: str | None = None) -> str:
    folder = os.environ.get("PLUGIN_DIR")
    if folder:
        return (Path(folder) / name).read_text(encoding="utf-8")
    # The develop preview follows the plugin's develop branch, like the registry catalog.
    branch = os.environ.get("PLUGIN_BRANCH") or ("develop" if preview else "main")
    with urllib.request.urlopen(RAW.format(branch=branch, name=name), timeout=30) as response:
        return response.read().decode("utf-8")
