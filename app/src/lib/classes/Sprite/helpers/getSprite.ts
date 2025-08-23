import Sprite from "..";
import emotions from "@/data/emotions.json";
import characters from "@/data/characters.json";

export const getCharacterSpriteData = (name: string): Sprite => {
  const sprite = characters.find((s: SpriteData) => s.name === name);
  if (!sprite) return Sprite.empty();
  return new Sprite(sprite.name, sprite.srcs);
};

export const getEmotionSpriteData = (name: string): Sprite => {
  const sprite = emotions.find((s: SpriteData) => s.name === name);
  if (!sprite) return Sprite.empty();
  return new Sprite(sprite.name, sprite.srcs);
};
