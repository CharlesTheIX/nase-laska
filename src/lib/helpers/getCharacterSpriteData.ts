import Sprite from "@/lib/classes/Sprite";
import characters from "@/data/characters.json";

export default (name: string): Sprite => {
  const sprite = characters.find((s: SpriteData) => s.name === name);
  if (!sprite) return Sprite.empty();
  return new Sprite(sprite.name, sprite.srcs);
};
