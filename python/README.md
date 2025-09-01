# Python Documentation

- [Requirements](#requirements)
- [Installation](#installation)
- [Setup](#setup)
- [Functions](#functions)
  _ [convert_animals_data](#convert_animals_data)

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

## Functions

Below lists the available functions within this part of the project - For more information, view the files directly.

### convert_animals_data

This file contains a function that reads the JSON data from the animas.json file within the `project-files` directory and translates the Tiled formatted data into a format that that is used with the main src of the project.

This function will create a file in the src directory that lists all the sprite fames for each animal that is set in the associated Tiled map in a format that can be used by the functions in the source so that the animation frames can be used and displayed consistently. 

Each animal sprite frame is expected to be 1 x 2 tiles (16 x 32 px) in size.

### convert_characters_data


