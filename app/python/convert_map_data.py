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
    names: List[str] = ["collision", "canopy", "weather_top", "weather_bottom"]
    json_content: Dict[str, Any] = {
        "layers": {},
        "spawn_points": [],
        "static_items": [],
        "respawn_items": [],
        "size": {"w": m_w * t_w, "h": m_h * t_w}
    }
   
    # Spawn points 
    sp_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "spawn_points"), None)
    if not sp_group:
        return
    
    spawn_points: List[Dict[str, Any]] = [] 
    for layer in sp_group.get("layers", []):
        for index, tile in enumerate(layer.get("data", [])):
            if tile == 0:
                continue
            m_col: int = index % m_w
            ss_col: int = (tile - 1) % ss_w
            ss_row: int = (tile - 1) // ss_w
            m_row: int = index // m_w
            sp = {
                "name": layer.get("name"),
                "dest": {"x": m_col * t_w, "y": m_row * t_w},
            }
            spawn_points.append(sp)
        
    json_content["spawn_points"] = spawn_points

    # Static items
    si_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "static_items"), None)
    if not si_group:
        return
    
    static_items: List[Dict[str, Any]] = [] 
    for layer in si_group.get("layers", []):
        srcs: List[Dict[str, int]] = []
        dests: List[Dict[str, int]] = []
        si: Dict[str, Any] = {
            "srcs": [],
            "dests": [],
            "name": layer.get("name"),
        }

        for index, tile in enumerate(layer.get("data", [])):
            if tile == 0:
                continue
            m_col: int = index % m_w
            m_row: int = index // m_w
            ss_col: int = (tile - 1) % ss_w
            ss_row: int = (tile - 1) // ss_w
            dest: Dict[str, int] = {"x": m_col * t_w, "y": m_row * t_w}
            src: Dict[str, int] = {"x": ss_col * t_w, "y": ss_row * t_w}
            srcs.append(src)
            dests.append(dest)

        si["srcs"] = srcs
        si["dests"] = dests
        static_items.append(si)
        
    json_content["static_items"] = static_items

    # Respawn items
    ri_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "respawn_items"), None)
    if not ri_group:
        return
    
    respawn_items: List[Dict[str, Any]] = [] 
    for layer in ri_group.get("layers", []):
        srcs: List[Dict[str, int]] = []
        dests: List[Dict[str, int]] = []
        ri: Dict[str, Any] = {
            "srcs": [],
            "dests": [],
            "name": layer.get("name"),
        }

        for index, tile in enumerate(layer.get("data", [])):
            if tile == 0:
                continue
            m_col: int = index % m_w
            m_row: int = index // m_w
            ss_col: int = (tile - 1) % ss_w
            ss_row: int = (tile - 1) // ss_w
            dest: Dict[str, int] = {"x": m_col * t_w, "y": m_row * t_w}
            src: Dict[str, int] = {"x": ss_col * t_w, "y": ss_row * t_w}
            srcs.append(src)
            dests.append(dest)

        ri["srcs"] = srcs
        ri["dests"] = dests
        respawn_items.append(ri)
        
    json_content["respawn_items"] = respawn_items

    # Tiles Group
    t_group = next((lg for lg in data.get("layers", []) if lg.get("name") == "tiles"), None)
    if not t_group:
        return

    l_groups: List[Dict[str, Any]] = [
        lg for lg in t_group.get("layers", []) if lg.get("name") in names
    ]

    for l_group in l_groups:
        layers: List[List[Dict[str, Dict[str, int]]]] = []

        for layer in l_group.get("layers", []):
            tiles: List[Dict[str, Dict[str, int]]] = []

            for index, tile in enumerate(layer.get("data", [])):
                if tile == 0:
                    continue
                m_col: int = index % m_w
                ss_col: int = (tile - 1) % ss_w
                ss_row: int = (tile - 1) // ss_w
                m_row: int = index // m_w
                t: Dict[str, Dict[str, int]] = {
                    "dest": {"x": m_col * t_w, "y": m_row * t_w},
                    "src": {"x": ss_col * t_w, "y": ss_row * t_w},
                }
                tiles.append(t)

            layers.append(tiles)

        json_content["layers"][l_group["name"]] = layers

    with open(dest_path, "w", encoding="utf8") as f:
        json.dump(json_content, f, indent=2)


def batch_convert(src_dir: str, dest_dir: str) -> None:
    for file in os.listdir(src_dir):
        if not file.endswith(".json"):
            continue
        src_path: str = os.path.join(src_dir, file)
        dest_path: str = os.path.join(dest_dir, file)
        convert_json(src_path, dest_path)


if __name__ == "__main__":
    batch_convert("../project-files/map-data", "./src/data/maps")
