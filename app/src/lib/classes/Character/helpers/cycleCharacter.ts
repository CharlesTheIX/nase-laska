import Character from "..";
import characters from "@/lib/data/characters.json";

export default (c: Character): void => {
  c.state = "idle";
  c.frame_index = 0;
  c.direction = "down";
  var index = characters.findIndex((s: SpriteData) => s.name === c.sprite.name) + 1;
  if (index >= characters.length) index = 0;
  c.sprite = characters[index];
};
