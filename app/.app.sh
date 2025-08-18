#!/bin/bash

set -euo pipefail
#
# -------------------------------------------------
# Functions
# -------------------------------------------------

build() {
  echo "Building..."
  yarn install

  if [ -d dist ]; then
    rm -rf dist
  fi

  mkdir dist
  yarn webpack --config webpack.config.mjs --mode production
  cp ./src/favicon.ico ./dist/favicon.ico
  cp ./src/index.html ./dist/index.html
  cp -R ./assets ./dist/assets
  echo "Build complete"
  echo ""
}

clean() {
  echo "Cleaning..."
  rm -rf dist node_modules yarn.lock
  echo "Clean complete"
  echo ""
}

convert_map_data() {
  echo "Converting Tiled map data to game map data..."

  if command -v python3 &>/dev/null; then
    python3 ./python/convert_map_data.py
  elif command -v python &>/dev/null; then
    python ./python/convert_map_data.py 
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi

  echo "Conversion complete."
  echo ""
}

help() {
  echo "Usage: $0 [build | clean | convert_map_data | start]"
  echo ""
  exit 1
}

start() {
  PWD=$(pwd)

  echo "Starting the server..."
  read -p "Enter the port number (default is 8000): " user_port
  read -p "Enter the directory to serve (default is $PWD/dist): " user_dir

  PORT=${user_port:-8000}
  DIR=${user_dir:-$PWD/dist}

  if [ -d "$DIR" ]; then
    cd $DIR
  else
    echo "Directory $DIR does not exist"
    exit 1
  fi

  if command -v python3 &>/dev/null; then
    echo "Serving $DIR at http://localhost:$PORT"
    python3 -m http.server $PORT &
    open "http://localhost:$PORT" &
  elif command -v python &>/dev/null; then
    echo "Serving $DIR at http://localhost:$PORT"
    python -m SimpleHTTPServer $PORT &
    open "http://localhost:$PORT" &
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi
}

if [ $# -lt 1 ]; then
  help
fi

case "$1" in
  build) build ;;
  clean) clean ;;
  convert_map_data) convert_map_data ;;
  start) start ;;
  *) help ;;
esac
