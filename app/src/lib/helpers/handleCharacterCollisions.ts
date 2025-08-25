import Map from "@/lib/classes/Map";
import { tile_size } from "@/lib/globals";
import Character from "@/lib/classes/Character";
import Rectangle from "@/lib/classes/Rectangle";
import StaticItem from "@/lib/classes/Items/StaticItem";

export const getCharacterMapCollisions = (c: Character, m: Map): boolean => {
  var collision: boolean = false;
  const r = Rectangle.tile(c.dest_position);
  m.map_data.layers["collision"].forEach((l: MapLayerData[]) => {
    l.forEach((d: MapLayerData) => {
      const r_d = Rectangle.init(d.dest.x, d.dest.y, tile_size, tile_size);
      if (r.equal(r_d)) collision = true;
      if (collision) return;
    });
    if (collision) return;
  });
  m.static_items.forEach((l: StaticItem) => {
    l.dests.forEach((dest) => {
      const r_d = Rectangle.init(dest.x, dest.y, tile_size, tile_size);
      if (r.equal(r_d)) collision = true;
      if (collision) return;
    });
    if (collision) return;
  });
  return collision;
};

export const getCharacterMapEdgeCollision = (c: Character, m: Map): boolean => {
  const r = Rectangle.tile(c.dest_position);
  return !m.size.containsRectangle(r);
};
