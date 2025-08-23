#!/usr/bin/env python3

import os
import json
from typing import Any, Dict, List


def convert_json(src_path: str, dest_path: str) -> None:
    with open(src_path, "r", encoding="utf8") as f:
        data: Dict[str, Any] = json.load(f)

    ss_w: int = 100
    m_w: int = data["width"]
    m_h: int = data["height"]
    t_w: int = data["tilewidth"]
    max_m_col: int = m_w // t_w 
    names: List[str] = ["pavla", "character_1", "character_3",  "character_4",  "character_5", "character_6", "character_7", "character_8", "character_9", "character_10", "character_11", "character_12", "character_13", "character_14", "character_15", "character_16", "character_17", "character_18", "character_19", "character_20", "character_21", "character_22", "character_23", "character_24", "david", "character_26", "character_27", "character_28", "character_29", "character_30", "character_31", "character_32", "blank_1"];

    t_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "characters"), None)
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
        m_col: int = index % m_w
        m_row: int = index // m_w
        n_index: int = m_row // 2
        ss_col: int = (tile - 1) % ss_w
        ss_row: int = (tile - 1) // ss_w
        if (m_row % 2 == 0 and m_col == 0):
            character = {
                "srcs": [],
                "name": names[n_index] if 0 <= n_index < len(names) else "david",
            }

        t: Dict[str, Any] = { "x": ss_col * t_w, "y": ss_row * t_w }
        character["srcs"].append(t)

        if (m_row % 2 == 1 and m_col == max_m_col - 1):
            json_content.append(character)

    with open(dest_path, "w", encoding="utf8") as f:
        json.dump(json_content, f, indent=2)


if __name__ == "__main__":
    convert_json("../project-files/data/characters.json", "./src/data/characters.json")
