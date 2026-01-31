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
  private is_moving: boolean = false;
  private target_position: Vector2 | null = null;
  private direction: "up" | "down" | "left" | "right" = "down";

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
    if (!map.rect.containsRectangle(target_hit_box, "all")) return;

    this._hit_box = target_hit_box;
    this._position = target_position;
  };

  private handleContinuousMovement = (game: Game, time_step: number): void => {
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
        this.direction = "up";
        break;

      case "s":
      case "S":
      case "KeyS":
      case "ArrowDown":
        movement.y += 1;
        this.direction = "down";
        break;

      case "a":
      case "A":
      case "KeyA":
      case "ArrowLeft":
        this.direction = "left";
        movement.x -= 1;
        break;

      case "d":
      case "D":
      case "KeyD":
      case "ArrowRight":
        this.direction = "right";
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

  private handleTiledMovement = (game: Game, time_step: number): void => {
    console.log(this.is_moving);
    if (this.is_moving) {
      // Move towards target
      const direction_vector = Vector2.subtract(this.target_position!, this._position).normalize();
      const speed = 4 * tile_size; // Adjust speed as needed
      const delta_position = Vector2.scale(direction_vector, speed / time_step);
      const new_position = Vector2.add(this._position, delta_position);

      // Check if overshooting
      if (Vector2.distance(new_position, this._position) >= Vector2.distance(this.target_position!, this._position)) {
        // Reached target
        this._position = this.target_position!;
        this._hit_box = Rectangle.init(this._position.x, this._position.y, this._hit_box.w, this._hit_box.h);
        this.is_moving = false;
        this.target_position = null;
      } else {
        this.applyCollisions(new_position, game.map);
      }
      return;
    }

    // Check for input
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
        this.direction = "up";
        break;

      case "s":
      case "S":
      case "KeyS":
      case "ArrowDown":
        movement.y += 1;
        this.direction = "down";
        break;

      case "a":
      case "A":
      case "KeyA":
      case "ArrowLeft":
        this.direction = "left";
        movement.x -= 1;
        break;

      case "d":
      case "D":
      case "KeyD":
      case "ArrowRight":
        this.direction = "right";
        movement.x += 1;
        break;
    }

    const target_position = Vector2.add(this._position, Vector2.scale(Vector2.fromObject(movement), tile_size));
    const target_hit_box = Rectangle.init(target_position.x, target_position.y, this._hit_box.w, this._hit_box.h);
    if (!game.map.rect.containsRectangle(target_hit_box, "all")) return; // Invalid move

    this.is_moving = true;
    this.target_position = target_position;
  };

  public draw = (game: Game, layer: string): void => {
    const image = game.resources.images["spritesheet"]?.image;
    if (!image) return;

    var _i = 1;
    switch (this.direction) {
      case "up":
        _i = 5;
        break;
      case "down":
        _i = 1;
        break;
      case "left":
        _i = 9;
        break;
      case "right":
        _i = 13;
        break;
    }
    switch (layer) {
      case "base":
        var spritesheet_frame = Rectangle.init(_i * tile_size, 56 * tile_size, tile_size, tile_size);
        game.canvas.drawImage(image, spritesheet_frame, this._hit_box);
        break;
      case "overlay":
        var spritesheet_frame = Rectangle.init(_i * tile_size, 5 * tile_size, tile_size, tile_size);
        game.canvas.drawImage(image, spritesheet_frame, this._hit_box.duplicate().translate(Vector2.init(0, -tile_size)));
        break;
      default:
        return;
    }
  };

  private handleMovement = (game: Game, time_step: number): void => {
    const movement_mode = game.memory.settings_data.movement_mode;
    if (movement_mode === "tiled") {
      this.handleTiledMovement(game, time_step);
    } else {
      this.handleContinuousMovement(game, time_step);
    }
  };

  public update = (game: Game, time_step: number): void => {
    this.handleMovement(game, time_step);
    if (this._position.length === 0) return;
  };
}
