#!/bin/bash
set -euo pipefail

PORT=8000

# Functions -----------------------------------------------------------------------------------------------------------------------------------------
build() {
  echo "Building..."
  yarn install
  if [ -d dist ]; then
    rm -rf dist
  fi

  mkdir dist
  yarn webpack --config webpack.config.mjs --mode production

  if [ ! -d "./src" ]; then
    echo "No src directory found, skipping static file copy."
    return
  fi

  if [ ! -f "./src/index.html" ]; then
    echo "No index.html file found in src directory, skipping static file copy."
    return
  fi

  if [ ! -f "./src/index.css" ]; then
    echo "No index.css file found in src directory, skipping static file copy."
    return
  fi

  if [ ! -d "./assets" ]; then
    echo "No assets directory found, skipping static file copy."
    return
  fi

  cp ./src/index.html ./dist/index.html
  cp ./src/index.css ./dist/index.css
  cp -R ./assets ./dist/assets
  echo "Build complete"

  # calc the size of dist
  DIST_SIZE=$(du -sh ./dist | cut -f1)
  echo "Bindle: $DIST_SIZE"
}

clean() {
  echo "Cleaning..."
  kill_service
  rm -rf dist node_modules yarn.lock package-lock.json
  echo "Clean complete"
}

kill_service() {
  echo "Killing service..."
  lsof -ti:$PORT | xargs -r kill -9 && echo "Service on port $PORT killed." || echo "No service running on port $PORT."
}

help() {
  echo "Usage: $0 [build | clean | kill_service | start]"
  exit 1
}

start() {
  PWD=$(pwd)
  DIR=$PWD/dist
  echo "Starting the server..."

  if [ -d "$DIR" ]; then
    cd $DIR
  else
    echo "Directory $DIR does not exist"
    exit 1
  fi

  if command -v python3 &>/dev/null; then
    echo "Serving $DIR at http://localhost:$PORT"
    python3 -m http.server $PORT 2>/dev/null &
  elif command -v python &>/dev/null; then
    echo "Serving $DIR at http://localhost:$PORT"
    python -m SimpleHTTPServer $PORT 2>/dev/null &
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi
}

# Execution -----------------------------------------------------------------------------------------------------------------------------------------
if [ $# -lt 1 ]; then
  help
fi

case "$1" in
  build) build ;;
  clean) clean ;;
  kill_service) kill_service ;;
  start) start ;;
  *) help ;;
esac
