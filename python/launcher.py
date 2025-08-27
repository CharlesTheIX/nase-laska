import os
import sys
import subprocess
# import webbrowser
import tkinter as tk
from pathlib import Path
# from tkinter import messagebox

if sys.platform.startswith("win"):
    OS_TYPE = "Windows"
    CHROME_PATHS = [
        os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe")
    ]
elif sys.platform.startswith("darwin"):
    OS_TYPE = "macOS"
    CHROME_PATHS = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
elif sys.platform.startswith("linux"):
    OS_TYPE = "Linux"
    CHROME_PATHS = ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"]
else:
    print("Unsupported OS.")
    print("")
    sys.exit(1)

INSTALL_DIR = Path.home() / "NaseLaska"
INDEX_HTML = INSTALL_DIR / "index.html"

if not INDEX_HTML.exists():
    print(f"Error: {INDEX_HTML} does not exist.")
    print("")
    sys.exit(1)

def find_chrome():
    for path in CHROME_PATHS:
        if os.path.exists(path):
            return path
    return None

def prompt_chrome_install():
    root = tk.Tk()
    root.withdraw()
    if OS_TYPE == "Windows":
        tk.messagebox.showerror("Google Chrome Required", 
                             "Google Chrome is not installed. Please install it from https://www.google.com/chrome/")
    elif OS_TYPE == "macOS":
        tk.messagebox.showerror("Google Chrome Required", 
                             "Google Chrome is not installed. Please install it from https://www.google.com/chrome/")
    elif OS_TYPE == "Linux":
        tk.messagebox.showerror("Google Chrome Required", 
                             "Google Chrome is not installed. Please install it via your package manager.")
    sys.exit(1)

chrome_path = find_chrome()
if chrome_path:
    if OS_TYPE == "Windows":
        subprocess.Popen([chrome_path, str(INDEX_HTML)])
    elif OS_TYPE == "macOS":
        subprocess.Popen(["open", "-a", "Google Chrome", str(INDEX_HTML)])
    elif OS_TYPE == "Linux":
        subprocess.Popen([chrome_path, str(INDEX_HTML)])
else:
    prompt_chrome_install()


# pyinstaller --onefile launcher.py
# add an image to the exe file