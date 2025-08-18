import { tile_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";

export const convertIRectangleToTile = (r: IRectangle): IRectangle => ({
  x: Math.floor(r.x / tile_size.w),
  y: Math.floor(r.y / tile_size.h),
  w: Math.floor(r.w / tile_size.w),
  h: Math.floor(r.h / tile_size.h)
});

export const convertTileToIRectangle = (tile: IRectangle): IRectangle => ({
  x: tile.x * tile_size.w,
  y: tile.y * tile_size.h,
  w: tile.w * tile_size.w,
  h: tile.h * tile_size.h
});

export const convertTilePositionToIVector2 = (tile: IVector2): IVector2 => ({
  x: tile.x * tile_size.w,
  y: tile.y * tile_size.h
});

export const convertIVector2ToTilePosition = (v: IVector2): IVector2 => ({
  x: Math.floor(v.x / tile_size.w),
  y: Math.floor(v.y / tile_size.h)
});

export const convertWorldPositionToCameraPosition = (p: Vector2): Vector2 => {
  return p;
};
