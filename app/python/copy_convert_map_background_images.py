#!/usr/bin/env python3

import os
import shutil
from PIL import Image
from typing import NoReturn


def copy_png_files(src_dir: str, dest_dir: str) -> NoReturn:
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
    copy_png_files("../project-files/map-data", "./assets/maps")
