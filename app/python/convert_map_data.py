#!/usr/bin/env python3

import os
import json
from typing import Any, Dict, List

def convert_tiled_json_to_map_json(input_file_path: str, output_file_path: str) -> None:
    with open(input_file_path, "r", encoding="utf8") as f:
        data: Dict[str, Any] = json.load(f)

    spritesheet_width = 100;
    m_w: int = data["width"]
    m_h: int = data["height"]
    t_size: int = data["tilewidth"]
    target_layer_group_names: List[str] = ["collision"]

    m_json: Dict[str, Any] = {
        "layers": {},
        "size_px": {"w": m_w * t_size, "h": m_h * t_size}
    }

    layer_groups: List[Dict[str, Any]] = [
        lg for lg in data["layers"] if lg["name"] in target_layer_group_names
    ]

    for layer_group in layer_groups:
        layers: List[List[Dict[str, Dict[str, int]]]] = []

        for layer in layer_group["layers"]:
            tiles: List[Dict[str, Dict[str, int]]] = []

            for index, tile in enumerate(layer["data"]):
                if tile == 0:
                    continue
                m_col: int = index % m_w
                s_col: int = (tile - 1)  % spritesheet_width
                s_row: int = (tile - 1) // spritesheet_width
                m_row: int = index // m_w
                t: Dict[str, Dict[str, int]] = {
                    "px_position": {"x": m_col * t_size, "y": m_row * t_size},
                    "sprite_px_position": {"x": s_col * t_size, "y": s_row * t_size},
                }
                tiles.append(t)

            layers.append(tiles)

        m_json["layers"][layer_group["name"]] = layers

    with open(output_file_path, "w", encoding="utf8") as f:
        json.dump(m_json, f, indent=2)

def batch_convert(src_dir: str, dest_dir: str) -> None:
    for file in os.listdir(src_dir):
        if not file.endswith(".json"):
            continue
        src_path: str = os.path.join(src_dir, file)
        dest_path: str = os.path.join(dest_dir, file)
        convert_tiled_json_to_map_json(src_path, dest_path)

if __name__ == "__main__":
    batch_convert("../project-files/map-data", "./src/lib/data/maps")
