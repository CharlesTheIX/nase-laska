import os
import sys
import shutil
import requests
import zipfile
from pathlib import Path

if sys.platform.startswith("win"):
    OS_TYPE = "Windows"
    GAME_EXECUTABLE = "nase-laska.exe"
elif sys.platform.startswith("darwin"):
    OS_TYPE = "macOS"
    GAME_EXECUTABLE = "nase-laska"
elif sys.platform.startswith("linux"):
    OS_TYPE = "Linux"
    GAME_EXECUTABLE = "nase-laska"
else:
    print("Unsupported OS.")
    print("")
    sys.exit(1)

print(f"Detected OS: {OS_TYPE}")

INSTALL_DIR = Path.home() / "NaseLaska"
GITHUB_RELEASE_URL = "https://github.com/charlestheix/nase-laska/releases/latest/download/dist.zip"

def download_release(url, target_path):
    print(f"Downloading release from {url}...")
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(target_path, "wb") as f:
            shutil.copyfileobj(response.raw, f)
        print(f"Downloaded to {target_path}")
        print("")
    else:
        print(f"Failed to download file: HTTP {response.status_code}")
        print("")
        sys.exit(1)

def extract_zip(zip_path, extract_to):
    print(f"Extracting {zip_path} to {extract_to}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print("Extraction complete.")
    print("")

def create_shortcut(target, shortcut_name):
    desktop = Path.home() / "Desktop"
    if OS_TYPE == "Windows":
        import pythoncom
        from win32com.shell import shell, shellcon
        shortcut_path = desktop / f"{shortcut_name}.lnk"
        shell_link = pythoncom.CoCreateInstance(
            shell.CLSID_ShellLink, None,
            pythoncom.CLSCTX_INPROC_SERVER, shell.IID_IShellLink
        )
        shell_link.SetPath(str(target))
        shell_link.SetWorkingDirectory(str(target.parent))
        persist_file = shell_link.QueryInterface(pythoncom.IID_IPersistFile)
        persist_file.Save(str(shortcut_path), 0)
        print(f"Shortcut created at {shortcut_path}")

    elif OS_TYPE in ["macOS", "Linux"]:
        shortcut_path = desktop / f"{shortcut_name}.desktop"
        content = f"""[Desktop Entry]
Type=Application
Name={shortcut_name}
Exec={target}
Icon=
Terminal=false
"""
        with open(shortcut_path, "w") as f:
            f.write(content)
        os.chmod(shortcut_path, 0o755)
        print(f"Shortcut created at {shortcut_path}")

def main():
    INSTALL_DIR.mkdir(exist_ok=True)
    zip_path = INSTALL_DIR / "dist.zip"
    
    download_release(GITHUB_RELEASE_URL, zip_path)
    extract_zip(zip_path, INSTALL_DIR)
    zip_path.unlink()
    
    game_path = INSTALL_DIR / GAME_EXECUTABLE
    if not game_path.exists():
        print(f"Error: {GAME_EXECUTABLE} not found in the release.")
        print("")
        sys.exit(1)
    
    create_shortcut(game_path, "MyGame")
    print("Installation complete!")
    print("")

if __name__ == "__main__":
    main()
