/* M */
type MapData = {
  size: { w: number; h: number };
  layers: { [key: string]: MapLayerData[][] };
  spawn_points: { name: string; dest: IVector2 }[];
};

type MapLayer = "collision" | "canopy" | "weather_top" | "weather_bottom";

type MapLayerData = {
  dest: IVector2;
  src: IVector2;
};
