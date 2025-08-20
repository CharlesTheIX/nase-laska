import Map from "@/lib/classes/Map";
import { tile_size } from "@/lib/globals";
import Character from "@/lib/classes/Character";
import Rectangle from "@/lib/classes/Rectangle";

export const getMapCollisions = (c: Character, m: Map): boolean => {
  var collision: boolean = false;
  const r = Rectangle.tile(c.dest_position);
  const collisionLayers = m.map_data.layers["collision"];
  collisionLayers.forEach((l: MapLayerData[]) => {
    l.forEach((d: MapLayerData) => {
      const r_d = Rectangle.init(d.px_position.x, d.px_position.y, tile_size.w, tile_size.h);
      if (r.equal(r_d)) collision = true;
      if (collision) return;
    });
    if (collision) return;
  });
  return collision;
};

export const getMapEdgeCollision = (c: Character, m: Map): boolean => {
  const r = Rectangle.tile(c.dest_position);
  return !m.size.containsRectangle(r);
};
