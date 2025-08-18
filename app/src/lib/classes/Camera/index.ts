import Vector2 from "@/lib/classes/Vector2";
import Rectangle from "@/lib/classes/Rectangle";
import { canvas_size, tile_size } from "@/lib/globals";

export default class Camera {
  position: Vector2;
  rectangle: Rectangle;
  dest_position: Vector2;

  private constructor() {
    this.position = Vector2.zero();
    this.dest_position = Vector2.zero();
    this.rectangle = Rectangle.init(0, 0, canvas_size.w, canvas_size.h);
  }

  static init = (): Camera => new Camera();

  get center_position(): Vector2 {
    return Vector2.init(
      Math.floor(this.rectangle.w / (tile_size.w * 2)) * tile_size.w,
      Math.floor(this.rectangle.h / (tile_size.h * 2)) * tile_size.h
    );
  }
}
