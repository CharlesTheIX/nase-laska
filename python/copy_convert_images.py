#!/usr/bin/env python3

import os
import shutil
from PIL import Image
from typing import NoReturn


def copy_convert_images(src_dir: str, dest_dir: str) -> NoReturn:
    if not os.path.isdir(dest_dir):
        os.makedirs(dest_dir, exist_ok=True)

    for file in os.listdir(src_dir):
        if file.lower().endswith(".png"):
            src_path = os.path.join(src_dir, file)
            dest_path = os.path.join(dest_dir, file)
            shutil.copy2(src_path, dest_path)
            create_webp_version(dest_path)


def create_webp_version(png_path: str) -> None:
    base, _ = os.path.splitext(png_path)
    webp_path = base + ".webp"

    with Image.open(png_path) as img:
        img.save(webp_path, "WEBP", quality=100)


if __name__ == "__main__":
    cwd = os.getcwd()
    src_path = os.path.join(cwd, "project-files", "data")
    dest_path = os.path.join(cwd, "assets", "images")
    copy_convert_images(src_path, dest_path)
    src_path = os.path.join(cwd, "project-files", "map-data")
    dest_path = os.path.join(cwd, "assets", "maps")
    copy_convert_images("./project-files/map-data", "./assets/maps")
