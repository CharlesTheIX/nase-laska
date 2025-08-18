/* M */
type MapData = {
  size_px: { w: number; h: number };
  layers: { [key: string]: MapLayerData[][] };
};

type MapLayer = "collision" | "canopy" | "weather_top" | "weather_bottom";

type MapLayerData = {
  px_position: IVector2;
  sprite_px_position: IVector2;
};
