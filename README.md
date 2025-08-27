# Naše Láska

## Table of Contents

- [Resources](#resources)
- [Introduction](#introduction)
- [Quick Setup](#quick-setup)
- [Tiled](#tiled)
- [Python](#python)
- [Development](#development)
  - [Constants](#constants)
  - [Classes](#classes)

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
# APP
# - Yarn
brew install yarn

# - Python
brew install python3
# or
brew install python
```

## Quick Setup

The App service uses `Typescript` for the JavaScript parts of the project, `SASS` for the CSS parts and `Webpack` to manage to building of the application.

This App service uses `Yarn` as the package manager for the development dependencies.

The App service has a number of helper cli commands found within the [.app.sh](./app/.app.sh).

The following commands assume the current working directory is the app directory:

```bash
# Make sure the script file is executable
chmod +x /.app.sh

# clean - this command will clean the development files from the app directory
yarn clean

# build - this command will compile and build the application and store it in the ./app/dist directory
yarn build

# start - this command will use python to spin up a server to serve the application in a browser on port: 8000
yarn start

# kill_server - this command will kill the python server on port: 8000
yarn kill_server
```

## Tiled

## Python

## Development

### Constants

## Classes

### Camera
