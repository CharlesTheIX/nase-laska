# Naše Láska

## Table of Contents

- [Resources](#resources)
- [Introduction](#introduction)
- [App Setup](#app-setup)

## Resources

- \_Drew Conley [RPG Kit series](https://www.youtube.com/watch?v=HmxNrlPx8iY&t=3817s)

## Introduction

This project is aiming to develop a 2D top-down role-play game, similar to Pokémon.

Additionally, this project aims to create a framework library so that I can use the basics of this repository for future game projects.

## Dependencies

This project was developed on macOS and assumes that you have `Homebrew` installed to manage dependencies.

```bash
# APP
# - Yarn
brew install yarn

# - Python
brew install python
```

## App Setup

The App service uses `Typescript` for the JavaScript parts of the project, `SASS` for the CSS parts and `Webpack` to manage to building of the application.

This App service uses `Yarn` as the package manager for the development dependencies.

The App service has a number of helper cli functions found within the [.app.sh](./app/.app.sh).

```bash
# Make sure the script file is executable
chmod +x ./app/.app.sh

# clean - this command will clean the development files from the app directory
./app/.app.sh clean

# build - this command will compile and build the application and store it in the ./app/dist directory
./app/.app.sh build

# start - this command will use python to spin up a server to serve the application in a browser
./app/.app.sh start
```
