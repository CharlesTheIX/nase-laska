#!/bin/bash

set -euo pipefail

# -------------------------------------------------
# Functions
# -------------------------------------------------

build() {
  echo "Building..."
  yarn install

  if [ -d dist ]; then
    rm -rf dist
  fi

  convert_map_data
  copy_convert_images
  convert_emotions_data
  convert_characters_data
  convert_inventory_items_data

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
  kill_service
  rm -rf dist node_modules yarn.lock
  echo "Clean complete"
  echo ""
}

convert_characters_data() {
  echo "Converting Tiled characters data to game characters data..."

  if command -v python3 &>/dev/null; then
    python3 ./python/convert_characters_data.py
  elif command -v python &>/dev/null; then
    python ./python/convert_characters_data.py 
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi

  echo "Conversion complete."
  echo ""
}

convert_emotions_data() {
  echo "Converting Tiled emotion data to game emotion data..."

  if command -v python3 &>/dev/null; then
    python3 ./python/convert_emotions_data.py
  elif command -v python &>/dev/null; then
    python ./python/convert_emotions_data.py 
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi

  echo "Conversion complete."
  echo ""
}

convert_inventory_items_data() {
  echo "Converting Tiled inventory item data to game inventory_item data..."

  if command -v python3 &>/dev/null; then
    python3 ./python/convert_inventory_items_data.py
  elif command -v python &>/dev/null; then
    python ./python/convert_inventory_items_data.py 
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi

  echo "Conversion complete."
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

copy_convert_images() {
  echo "Copying and converting Tiled images to assets..."

  if command -v python3 &>/dev/null; then
    python3 ./python/copy_convert_images.py
  elif command -v python &>/dev/null; then
    python ./python/copy_convert_images.py 
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi

  echo "Copy and conversion complete."
  echo ""

}

kill_service() {
  echo "Killing service..."
  lsof -ti:8000 | xargs kill -9
  echo "Service killed."
  echo ""
}

help() {
  echo "Usage: $0 [build | clean | convert_emotions_data | convert_map_data | copy_convert_map_background_images | kill | start]"
  echo ""
  exit 1
}

start() {
  echo "Starting the server..."

  PORT=8000
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
    # open "http://localhost:$PORT" &
  elif command -v python &>/dev/null; then
    echo "Serving $DIR at http://localhost:$PORT"
    python -m SimpleHTTPServer $PORT &
    # open "http://localhost:$PORT" &
  else
    echo "Python is not installed - please install Python to use this script"
    exit 1
  fi
}

# -------------------------------------------------
# Execution
# -------------------------------------------------

if [ $# -lt 1 ]; then
  help
fi

case "$1" in
  build) build ;;
  clean) clean ;;
  convert_characters_data) convert_characters_data ;;
  convert_emotions_data) convert_emotions_data ;;
  convert_map_data) convert_map_data ;;
  copy_convert_images) copy_convert_images ;;
  kill_service) kill_service ;;
  start) start ;;
  *) help ;;
esac
