/* C */
type CharacterState = "idle" | "walking";

/* D */
type Direction = "up" | "down" | "left" | "right";

type DrawCharacterLayerProps = {
  canvas: Canvas;
  camera: Camera;
  m_size: IRectangle;
  layer: SpriteFrameName;
  spritesheet: HTMLImageElement;
};

type DrawRectangleProps = { rectangle: IRectangle; color?: string };

type DrawTextLinesProps = {
  color?: string;
  lines: string[];
  position: IVector2;
  align?: CanvasTextAlign;
};

/* G */
type GameState = "playing" | "start" | "loading" | "settings" | "message";

/* I */
type ICharacter = {
  sprite: Sprite;
  emotion: Emotion;
  max_speed: number;
  velocity: Vector2;
  position: Vector2;
  animating: boolean;
  sprite_name: string;
  frame_index: number;
  direction: Direction;
  state: CharacterState;
  dest_position: Vector2;
  frame_index_count: number;
  animation_timers: { [key: string]: { count: number; timeout: number } };
};

type IGame = {
  canvas: Canvas;
  resources: Resources;
  input_handler: InputHandler;
};

type IMap = {
  map_name: string;
  background_image: HTMLImageElement;
  overlay_images: { [key: string]: HTMLImageElement };
};

type KeySetMap = { [key: string]: Set<string> };

type IPlayer = {
  camera: Camera;
  position: IVector2;
  sprite_name: string;
  character?: Character;
};

type IRectangle = { x: number; y: number; w: number; h: number };

type IRespawnItem = {
  name: string;
  value: number;
  count?: number;
  message: string;
  srcs: IVector2[];
  dests: IVector2[];
  respawn_time: number;
  inventory_message: string;
};

type ImageResource = { loaded: boolean; image: HTMLImageElement };

type IVector2 = { x: number; y: number };

/* M */
type MapData = {
  size: { w: number; h: number };
  static_items: StaticItemData[];
  respawn_items: RespawnItemData[];
  layers: { [key: string]: MapLayerData[][] };
  spawn_points: { name: string; dest: IVector2 }[];
};

type MapLayer = "collision" | "canopy" | "weather_top" | "weather_bottom" | "static_items";

type MapLayerData = {
  name?: string;
  src?: IVector2;
  dest: IVector2;
};

/* P */
type PlayerMovementType = "mono" | "omni" | "tiled";

type PlayerUpdateProps = { time_step: number; input_handler: InputHandler; map: Map };

/* R */
type RespawnItemData = {
  name: string;
  srcs: Vector2[];
  dests: Vector2[];
};

/* S */
type SaveData = {
  map_name: string;
  position: IVector2;
  sprite_name: string;
  time_played: number;
};

type SpriteData = {
  name: string;
  srcs: IVector2[];
};

type SpriteFrameName = "upper" | "lower" | "emotion";

type SpriteFrameSetName = "idle" | "walking";

type SpriteType = "character" | "emotion";

type StaticItemData = {
  name: string;
  srcs: Vector2[];
  dests: Vector2[];
};
