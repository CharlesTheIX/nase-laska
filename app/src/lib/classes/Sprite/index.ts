import { getCharacterSpriteById, getCharacterSpriteByName } from "./helpers/getCharacterSprite";

export default class Sprite {
  width: number;
  height: number;
  _id: string | null;
  name: string | null;
  frame_sets: SpriteFrameSets | null;

  constructor(s: Partial<SpriteData>) {
    this._id = s._id ?? null;
    this.width = s.width ?? 0;
    this.name = s.name ?? null;
    this.height = s.height ?? 0;
    this.frame_sets = s.frame_sets ?? null;
  }

  static init = (props: { _id?: string; name?: string; type: SpriteType }): Sprite => {
    const { _id, name, type } = props;
    if (!_id && !name) return new Sprite({});
    switch (type) {
      case "character":
        if (_id) return getCharacterSpriteById(_id);
        if (name) return getCharacterSpriteByName(name);
        return new Sprite({});
    }
  };
}
