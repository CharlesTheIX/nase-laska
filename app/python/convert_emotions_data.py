#!/usr/bin/env python3

import os
import json
from typing import Any, Dict, List


def convert_emotions_json(input_file_path: str, output_file_path: str) -> None:
    with open(input_file_path, "r", encoding="utf8") as f:
        data: Dict[str, Any] = json.load(f)

    spritesheet_width: int = 100
    m_w: int = data["width"]
    t_size: int = data["tilewidth"]
    emotion_list: List[str] = ["speaking", "singing", "smile", "happy", "grumpy", "pleased", "laughing", "exclaim", "question", "love", "sick", "cry", "sad", "angry", "blank_1", "blank_2"];

    # find the "emotions" group
    tiles_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "emotions"), None)
    if not tiles_group:
        return

    tiles: List[Dict[str, Any]] = []
    for index, tile in enumerate(tiles_group.get("data", [])):
        if tile == 0:
            continue
        name = emotion_list[index] if 0 <= index < len(emotion_list) else "blank_2"
        s_col: int = (tile - 1) % spritesheet_width
        s_row: int = (tile - 1) // spritesheet_width
        t: Dict[str, Any] = {
            "_id": "",
            "name": name,
            "sprite_px_position": {"x": s_col * t_size, "y": s_row * t_size},
        }
        tiles.append(t)

    with open(output_file_path, "w", encoding="utf8") as f:
        json.dump(tiles, f, indent=2)


if __name__ == "__main__":
    convert_emotions_json("../project-files/data/emotions.json", "./src/data/emotions.json")
