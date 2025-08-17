type SpriteData = {
  _id?: string;
  name?: string;
  width: number;
  height: number;
  frame_sets: SpriteFrameSets;
};

type SpriteFrameName = "upper" | "lower";

type SpriteFrame = {
  upper: any[];
  lower: any[];
};

type SpriteFrameSetName = "idle" | "walking";

type SpriteFrameSets = {
  [set: string]: {
    frame_count: number;
    frames: { [direction: string]: SpriteFrame };
  };
};

type SpriteType = "character";
