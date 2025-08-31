import Map from "@/lib/classes/Map";
import Animal from "@/lib/classes/Animal";
import { tile_size } from "@/lib/globals";
import Character from "@/lib/classes/Character";
import Rectangle from "@/lib/classes/Rectangle";
import StaticItem from "@/lib/classes/Items/StaticItem";
import RespawnItem from "@/lib/classes/Items/RespawnItem";

export const getCharacterMapCollisions = (c: Character, m: Map): boolean => {
  var collision: boolean = false;
  const r = Rectangle.tile(c.dest_position);
  m.map_data.layers["collision"].forEach((l: MapLayerData[]) => {
    if (collision) return;
    l.forEach((d: MapLayerData) => {
      if (collision) return;
      const r_d = Rectangle.init(d.dest.x, d.dest.y, tile_size, tile_size);
      if (r.equal(r_d)) collision = true;
    });
  });

  m.static_items.forEach((l: StaticItem) => {
    if (collision) return;
    l.dests.forEach((dest) => {
      if (collision) return;
      const r_d = Rectangle.init(dest.x, dest.y, tile_size, tile_size);
      if (r.equal(r_d)) collision = true;
    });
  });

  m.respawn_items.forEach((l: RespawnItem) => {
    if (collision) return;
    if (l.hidden) return;
    l.dests.forEach((dest) => {
      if (collision) return;
      const r_d = Rectangle.init(dest.x, dest.y, tile_size, tile_size);
      if (r.equal(r_d)) collision = true;
    });
  });

  m.animals.forEach((a: Animal) => {
    if (collision) return;
    const r_d = Rectangle.init(a.dest_position.x, a.dest_position.y + tile_size, tile_size, tile_size);
    if (r.equal(r_d)) collision = true;
  });

  return collision;
};

export const getCharacterMapEdgeCollision = (c: Character, m: Map): boolean => {
  const r = Rectangle.tile(c.dest_position);
  return !m.size.containsRectangle(r);
};
