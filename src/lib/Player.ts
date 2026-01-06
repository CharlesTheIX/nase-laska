import Map from "@/lib/Map";
import Game from "@/lib/Game";
import Memory from "@/lib/Memory";
import Vector2 from "@/lib/Vector2";
import { tile_size } from "@/globals";
import Rectangle from "@/lib/Rectangle";

export default class Player {
  private _name: string;
  private _position: Vector2;
  private _hit_box: Rectangle;

  constructor(memory: Memory) {
    this._name = memory.save_data.player.name;
    this._position = Vector2.fromObject(memory.save_data.player.position);
    this._hit_box = Rectangle.init(this._position.x, this._position.y, tile_size, tile_size);
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (memory: Memory): Player => new Player(memory);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get name(): string {
    return this._name;
  }

  get position(): Vector2 {
    return this._position;
  }

  get hit_box(): Rectangle {
    return this._hit_box;
  }

  // METHODS -----------------------------------------------------------------------------------------------------------------------------------------
  private applyCollisions = (target_position: Vector2, map: Map): void => {
    const target_hit_box = Rectangle.init(target_position.x, target_position.y, this._hit_box.w, this._hit_box.h);
    if (map.collisionRectangle(target_hit_box)) return;
    this._hit_box = target_hit_box;
    this._position = target_position;
  };

  public draw = (game: Game): void => {
    game.canvas.drawRectangle(this._hit_box, "green");
  };

  private handleMovement = (game: Game, time_step: number): void => {
    const movement_key_pressed = game.input_handler.areKeysPressed(
      ["w", "W", "KeyW", "ArrowUp", "s", "S", "KeyS", "ArrowDown", "a", "A", "KeyA", "ArrowLeft", "d", "D", "KeyD", "ArrowRight"],
      "any"
    );
    if (!movement_key_pressed) return;

    const movement = { x: 0, y: 0 };
    const last_key = game.input_handler.lastKeyPressed();
    switch (last_key) {
      case "w":
      case "W":
      case "KeyW":
      case "ArrowUp":
        movement.y -= 1;
        break;

      case "s":
      case "S":
      case "KeyS":
      case "ArrowDown":
        movement.y += 1;
        break;

      case "a":
      case "A":
      case "KeyA":
      case "ArrowLeft":
        movement.x -= 1;
        break;

      case "d":
      case "D":
      case "KeyD":
      case "ArrowRight":
        movement.x += 1;
        break;
    }

    const running = game.input_handler.areKeysPressed(["ShiftLeft", "ShiftRight"], "any");
    const speed = (running ? 2 : 4) * tile_size;
    const movement_vector = Vector2.fromObject(movement).normalize();
    const delta_position = Vector2.scale(movement_vector, speed / time_step);
    const target_position = Vector2.add(this._position, delta_position);
    this.applyCollisions(target_position, game.map);
  };

  public update = (game: Game, time_step: number): void => {
    this.handleMovement(game, time_step);
    if (this._position.length === 0) return;
  };
}
