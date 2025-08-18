/* M */
type MapData = {
  size_px: { w: number; h: number };
  layers: { [key: string]: MapLayerData[][] };
};

type MapLayerData = {
  px_position: IVector2;
  sprite_px_position: IVector2;
};
