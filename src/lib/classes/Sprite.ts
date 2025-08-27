import getEmotionSpriteData from "@/lib/helpers/getEmotionSpriteData";
import getCharacterSpriteData from "@/lib/helpers/getCharacterSpriteData";

export default class Sprite {
  name: string;
  srcs: IVector2[] | null;

  constructor(name: string, srcs?: IVector2[]) {
    this.name = name;
    this.srcs = srcs ?? null;
  }

  static init = (type: SpriteType, name: string): Sprite => {
    if (!name) return Sprite.empty();
    switch (type) {
      case "character":
        return getCharacterSpriteData(name);
      case "emotion":
        return getEmotionSpriteData(name);
    }
  };

  static empty = (): Sprite => new Sprite("_empty_");
}
