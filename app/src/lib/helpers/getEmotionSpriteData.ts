import Sprite from "@/lib/classes/Sprite";
import emotions from "@/data/emotions.json";

export default (name: string): Sprite => {
  const sprite = emotions.find((s: SpriteData) => s.name === name);
  if (!sprite) return Sprite.empty();
  return new Sprite(sprite.name, sprite.srcs);
};
