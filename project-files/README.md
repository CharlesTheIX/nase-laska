# Tiled Documentation

## Table of Contents

- [Terminology](#terminology)
- [Introduction](#introduction)
- [Tileset Creation](#tileset-creation)

>---
>
>## Terminology
>
>- `Tileset`: This refers to a Tiled file (.tsx file) that is produced from an image and is used to map sprites in map creation to the image that the tileset is created from
(in the Tiled application the data is stored as the tile number of the tileset and this value can be used to locate the sprite on the source image).
>
>- `Spritesheet`: This refers to an image file that is used as the base image of a tileset but also used as a resource by the game to be able to map the Tiled data to the corresponding sprite.
>
>- `Map`: This refers to a Tiled file (.tmx file) that is created using a tileset. The files are used to generate the map Tiled data and images fir the game.
>
>- `Tiled Data`: This refers to the data / json files created by the Tiled application produces when the data is exported (in json format).
>
>---




## Introduction

This documentation will go over how the Tiled application is used and integrated within this project.

Tiled is an application that uses tiled based spritesheets / tileset to construct tile maps and sprite collection images that can be exported in data or image formats (this project uses image and json exports).

For more information on the Tiled application from [here](https://www.mapeditor.org/).

## Tileset Creation

Tilesets are used to create maps within map creation in addition to being used to create sprite specific sprite