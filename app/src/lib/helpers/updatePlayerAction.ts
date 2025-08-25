import Map from "@/lib/classes/Map";
import { tile_size } from "@/lib/globals";
import Character from "@/lib/classes/Character";
import { getInputKeySets } from "@/lib/inputKeys";
import InputHandler from "@/lib/classes/InputHandler";
import StaticItem from "@/lib/classes/Items/StaticItem";

export default (character: Character, map: Map, input_handler: InputHandler): StaticItem | null => {
  const key_sets: KeySetMap = getInputKeySets();
  const last_key: string = input_handler.last_key;
  if (!key_sets.action.has(last_key)) return null;
  const v = character.position.duplicate();
  switch (character.direction) {
    case "up":
      v.y -= tile_size;
      break;
    case "down":
      v.y += tile_size;
      break;
    case "left":
      v.x -= tile_size;
      break;
    case "right":
      v.x += tile_size;
      break;
  }
  var item: StaticItem | null = null;
  map.static_items.forEach((i) => {
    if (item) return;
    const si = i.dests.find((dest) => dest.x === v.x && dest.y === v.y);
    if (si) item = i;
  });
  return item;
};
