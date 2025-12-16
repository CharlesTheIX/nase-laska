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

  if [ ! -f "./src/favicon.ico" ]; then
    echo "No favicon.ico file found in src directory, skipping static file copy."
    return
  fi

  if [ ! -d "./assets" ]; then
    echo "No assets directory found, skipping static file copy."
    return
  fi

  if [ ! -d "./dist" ]; then
    echo "No dist directory found, cannot copy static files."
    return
  fi
 
  cp ./src/favicon.ico ./dist/favicon.ico
  cp ./src/index.html ./dist/index.html
  cp ./src/index.css ./dist/index.css
  cp -R ./assets ./dist/assets
  echo ""
  echo "Build complete"
  echo ""
}

clean() {
  echo "Cleaning..."
  rm -rf dist node_modules yarn.lock package-lock.json
  kill_service
  echo "Clean complete"
  echo ""
}

kill_service() {
  echo "Killing service..."
  lsof -ti:$PORT | xargs -r kill -9
  echo "Service killed."
  echo ""
}

help() {
  echo "Usage: $0 [build | clean | kill_service | start]"
  echo ""
  exit 1
}

start() {
  echo "Starting the server..."

  PWD=$(pwd)
  DIR=$PWD/dist

  if [ -d "$DIR" ]; then
    cd $DIR
  else
    echo "Directory $DIR does not exist"
    exit 1
  fi

  if command -v python3 &>/dev/null; then
    echo "Serving $DIR at http://localhost:$PORT"
    python3 -m http.server $PORT &
  elif command -v python &>/dev/null; then
    echo "Serving $DIR at http://localhost:$PORT"
    python -m SimpleHTTPServer $PORT &
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
