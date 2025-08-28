# Naše Láska

## Table of Contents

- [Resources](#resources)
- [Introduction](#introduction)
- [Dependencies](#dependencies)
- [Setup](#setup)
- [Tiled](#tiled)
- [Python](#python)
- [Development](#development)
- [Release](#release)

## Resources

- _Drew Conley RPG Kit series [video](https://www.youtube.com/watch?v=HmxNrlPx8iY&t=3817s)_
- _HTML canvas [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)_
- _Tiled application [documentation](https://www.mapeditor.org/docs)_
- _GIMP [documentation](https://www.gimp.org/docs/)_

## Introduction

This project is aiming to develop a 2D top-down role-play game, similar to Pokémon.

Additionally, this project aims to create a framework library so that I can use the basics of this repository for future game projects.

## Dependencies

This project was developed on macOS and assumes that you have `Homebrew` installed to manage dependencies.

This project also assumes that your environment is able to use / run shell scripts and typescript with node.

```bash
# - Git
brew install git

# - NodeJS
brew install node

# - Yarn
brew install yarn

# - Python
brew install python3
# or
brew install python
```

## Setup

The App service uses `Typescript` for the JavaScript parts of the project, `SASS` for the CSS parts and `Webpack` to manage to building of the application.

This App service uses `Yarn` as the package manager for the development dependencies.

The App service has a number of helper cli commands found within the [.app.sh](./app/.app.sh).

The following commands assume the current working directory is the app directory:

```bash
# Make sure the script file is executable
chmod +x /.app.sh

# Build
yarn build

# Clean
yarn clean

# Kill Server
yarn kill_server

# Start
yarn start
```

## Tiled

For more on the tiled project setup see [here](./project-files/README.md).

## Python

For more on the python functions see [here](./python/README.md).

## Development

## Release
