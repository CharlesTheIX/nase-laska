# Python Documentation

- [Requirements](#requirements)
- [Installation](#installation)
- [Setup](#setup)

## Requirements

The project uses `Python` as the core language and `pip` as its package manager, further packages required with `pip` can be found within the [requirements.txt](./requirements.txt) file.

## Installation

This installation uses the `Homebrew` as its package manager.

```bash
# Install Homebrew if not installed:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python:
brew install python

# Verify:
python3 --version
pip3 --version

# To update pip use:
python3 -m pip install --upgrade pip
```

## Setup

```bash
# Create local environment
python3 -m venv venv

# Activate the environment
source ./venv/bin/activate

# Install the requirements
pip3 install -r requirements.txt

# To deactivate the environment
deactivate

# To install dependency
pip3 install [DEPENDENCY_NAME]

# Save the requirements
pip3 freeze > requirements.txt
```
