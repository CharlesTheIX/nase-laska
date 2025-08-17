/* M */
type MapData = {
  size_px: IVector2;
  size_tiles: IVector2;
  layers: { [key: string]: MapLayerData[][] };
};

type MapLayerData = {
  px_position: IVector2;
  tile_position: IVector2;
  spritesheet_index: number;
};
