import Sprite from "..";
import emotions from "@/data/emotions.json";
import characters from "@/data/characters.json";

export const getCharacterSpriteById = (_id: string): Sprite => {
  const sprite = characters.find((item: SpriteData) => item._id === _id);
  if (!sprite) return new Sprite({});
  return new Sprite(sprite);
};

export const getCharacterSpriteByName = (name: string): Sprite => {
  const sprite = characters.find((item: SpriteData) => item.name === name);
  if (!sprite) return new Sprite({});
  return new Sprite(sprite);
};

export const getEmotionSpriteData = (name: string): EmotionData => {
  const sprite = emotions.find((item: EmotionData) => item.name === name);
  if (!sprite) return { _id: "", name: "blank_2", sprite_px_position: { x: 256, y: 48 } };
  return sprite;
};
