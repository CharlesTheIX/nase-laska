import Sprite from "..";
import characters from "@/lib/data/characters.json";

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
