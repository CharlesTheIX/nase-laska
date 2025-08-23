#!/usr/bin/env python3

import os
import json
from typing import Any, Dict, List


def convert_json(src_path: str, dest_path: str) -> None:
    with open(src_path, "r", encoding="utf8") as f:
        data: Dict[str, Any] = json.load(f)

    ss_w: int = 100
    t_w: int = data["tilewidth"]
    names: List[str] = ["speaking", "singing", "smile", "happy", "grumpy", "pleased", "laughing", "exclaim", "question", "love", "sick", "cry", "sad", "angry", "blank_1", "blank_2"];

    t_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "emotions"), None)
    if not t_group:
        return

    json_content: List[Dict[str, Any]] = []
    for index, tile in enumerate(t_group.get("data", [])):
        if tile == 0:
            continue
        name = names[index] if 0 <= index < len(names) else "blank_1"
        ss_col: int = (tile - 1) % ss_w
        ss_row: int = (tile - 1) // ss_w
        t: Dict[str, Any] = {
            "name": name,
            "srcs": [{"x": ss_col * t_w, "y": ss_row * t_w}],
        }
        json_content.append(t)

    with open(dest_path, "w", encoding="utf8") as f:
        json.dump(json_content, f, indent=2)


if __name__ == "__main__":
    convert_json("../project-files/data/emotions.json", "./src/data/emotions.json")
