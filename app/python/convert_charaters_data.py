#!/usr/bin/env python3

import os
import json
from typing import Any, Dict, List


def convert_characters_json(input_file_path: str, output_file_path: str) -> None:
    with open(input_file_path, "r", encoding="utf8") as f:
        data: Dict[str, Any] = json.load(f)

    spritesheet_width: int = 100
    m_w: int = data["width"]
    m_h: int = data["height"]
    t_size: int = data["tilewidth"]
    character_list: List[str] = ["pavla", "david", "character_3",  "character_4",  "character_5", "character_6", "character_7", "character_8", "character_9", "character_10", "character_11", "character_12", "character_13", "character_14", "character_15", "character_16", "character_17", "character_18", "character_19", "character_20", "character_21", "character_22", "character_23", "character_24", "character_25", "character_26", "character_27", "character_28", "character_29", "character_30", "character_31", "character_32", "blank_1"];

    # find the "characters" group
    tiles_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "characters"), None)
    if not tiles_group:
        return

    tiles: List[Dict[str, Any]] = []
    character: [Dict[str, Any]] = {
        "_id": "",
        "name": "",
        "width": 16,
        "height": 32,
        "sprite_px_positions": [],
        "animations_per_direction": 4,
        "direction_indices": { "up": 0, "down": 4, "left": 8, "right": 12 },
    }
    for index, tile in enumerate(tiles_group.get("data", [])):
        if tile == 0:
            continue
        m_row: int = index // m_w
        name_index: int = m_row // 2
        if (m_row % 2 == 0)
            character["sprite_px_positions"] = []
            character["name"] = character_list[name_index] if 0 <= index < len(character_list) else "blank_1"

        s_col: int = (tile - 1) % spritesheet_width
        s_row: int = (tile - 1) // spritesheet_width
        t: Dict[str, Any] = { "x": s_col * t_size, "y": s_row * t_size }
        character["sprite_px_positions"].append(t)

        if (m_row % 2 == 1)
            tiles.append(t)

    with open(output_file_path, "w", encoding="utf8") as f:
        json.dump(tiles, f, indent=2)


if __name__ == "__main__":
    convert_characters_json("../project-files/data/characters.json", "./src/data/characters.json")
