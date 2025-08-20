import { tile_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";

export default class Camera {
  scale: number;
  position: Vector2;
  focus_player: boolean;
  dest_position: Vector2;

  private constructor() {
    this.scale = 3;
    this.focus_player = true;
    this.position = Vector2.zero();
    this.dest_position = Vector2.zero();
  }

  static init = (): Camera => new Camera();

  public update = (v: Vector2): void => {
    if (this.focus_player) this.dest_position = v.duplicate();
    this.dest_position.x += tile_size.w / 2;
    this.dest_position.y += tile_size.h / 2;
    this.position = this.dest_position.duplicate();
  };
}
