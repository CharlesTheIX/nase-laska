/* D */
type Direction = "up" | "down" | "left" | "right";

/* G */
type GameState = "playing";

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
  camera: Camera;
  canvas: Canvas;
  resources: Resources;
  input_handler: InputHandler;
};

type IMap = {
  map_name: string;
  background_image: HTMLImageElement;
};

type KeySetMap = { [key: string]: Set<string> };

type IPlayer = {
  camera: Camera;
  sprite_name?: string;
  character?: Character;
};

type IRectangle = { x: number; y: number; w: number; h: number };

type ImageResource = { loaded: boolean; image: HTMLImageElement };

type IVector2 = { x: number; y: number };
