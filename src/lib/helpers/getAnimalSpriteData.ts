import Sprite from "@/lib/classes/Sprite";
import animals from "@/data/animals.json";

export default (name: string): Sprite => {
  const sprite = animals.find((s: SpriteData) => s.name === name);
  if (!sprite) return Sprite.empty();
  return new Sprite(sprite.name, sprite.srcs);
};
