#!/usr/bin/env python3

import os
import json
from typing import Any, Dict, List


def convert_character_data(src_path: str, dest_path: str) -> None:
    with open(src_path, "r", encoding="utf8") as f:
        data: Dict[str, Any] = json.load(f)

    ss_w: int = data["width"]
    t_w: int = data["tilewidth"]
    tilesheet_index_offset = 10000;
    names: List[str] = ["cat"];

    t_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "animals"), None)
    if not t_group:
        return

    json_content: List[Dict[str, Any]] = []
    character: [Dict[str, Any]] = {
        "srcs": [],
        "name": "",
    }
    for index, tile in enumerate(t_group.get("data", [])):
        if tile == 0:
            continue
        ss_col: int = (tile -tilesheet_index_offset - 1) % ss_w
        ss_row: int = (tile - tilesheet_index_offset - 1) // ss_w
        n_index: int = ss_row // 2
        if (ss_row % 2 == 0 and ss_col == 0):
            character = {
                "srcs": [],
                "name": names[n_index] if 0 <= n_index < len(names) else "david",
            }

        t: Dict[str, Any] = { "x": ss_col * t_w, "y": ss_row * t_w }
        character["srcs"].append(t)

        if (ss_row % 2 == 1 and ss_col == ss_w - 1):
            json_content.append(character)

    with open(dest_path, "w", encoding="utf8") as f:
        json.dump(json_content, f, indent=2)


if __name__ == "__main__":
    cwd = os.getcwd()
    src_path = os.path.join(cwd, "project-files", "data", "animals.json")
    dest_path = os.path.join(cwd, "src", "data", "animals.json")
    convert_character_data(src_path, dest_path)
