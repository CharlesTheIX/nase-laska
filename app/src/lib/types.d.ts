/* D */
type Direction = "up" | "down" | "left" | "right";

/* G */
type GameState = "playing";

/* I */
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

type IPlayer = {
  camera: Camera;
  sprite_name?: string;
  character?: Character;
};

type IRectangle = { x: number; y: number; w: number; h: number };

type ImageResource = { loaded: boolean; image: HTMLImageElement };

type IVector2 = { x: number; y: number };
