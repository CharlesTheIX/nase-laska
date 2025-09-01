#!/usr/bin/env python3

import os
import json
from typing import Any, Dict, List

def convert_inventory_items_data(src_path: str, dest_path: str) -> None:
    with open(src_path, "r", encoding="utf8") as f:
        data: Dict[str, Any] = json.load(f)

    ss_w: int = data["width"]
    t_w: int = data["tilewidth"]
    tilesheet_index_offset = 10000;
    names: List[str] = ["coins", "pouch", "strawberry",  "cherry",  "snacks", "parsnip", "carrot", "white_mushroom", "brown_mushroom", "red_mushroom_1", "red_mushroom_2", "red_mushroom_3"];

    t_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "inventory_items"), None)
    if not t_group:
        return

    json_content: List[Dict[str, Any]] = []
    for index, tile in enumerate(t_group.get("data", [])):
        if tile == 0:
            continue
        name = names[index] if 0 <= index < len(names) else "blank_1"
        ss_col: int = (tile - tilesheet_index_offset - 1) % ss_w
        ss_row: int = (tile - tilesheet_index_offset - 1) // ss_w
        t: Dict[str, Any] = {
            "name": name,
            "srcs": [{"x": ss_col * t_w, "y": ss_row * t_w}]
        }
        json_content.append(t)

    with open(dest_path, "w", encoding="utf8") as f:
        json.dump(json_content, f, indent=2)


if __name__ == "__main__":
    cwd = os.getcwd()
    src_path = os.path.join(cwd, "project-files", "data", "inventory_items.json")
    dest_path = os.path.join(cwd, "src", "data", "inventory_items.json")
    convert_inventory_items_data(src_path, dest_path)
