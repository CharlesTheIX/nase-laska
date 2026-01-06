import Vector2 from "@/lib/Vector2";
import { tile_size } from "@/globals";
import Rectangle from "@/lib/Rectangle";

type Focus = "top_left" | "top_center" | "top_right" | "center_left" | "center" | "center_right" | "bottom_left" | "bottom_center" | "bottom_right";

export const canvas_size = Vector2.init(45, 33).scale(tile_size);

export default class Camera {
  private _zoom: number = 1;
  private _focus: Focus = "center";
  private _position: Vector2 = Vector2.init(0, 0);
  private _focus_position: Vector2 = Vector2.init(0, 0);
  private _rectangle: Rectangle = Rectangle.init(0, 0, canvas_size.x, canvas_size.y);

  private constructor() {
    this.focus = this._focus;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (): Camera => new Camera();

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get focus_position(): Vector2 {
    return this._focus_position;
  }

  get position(): Vector2 {
    return this._position;
  }

  get rectangle(): Rectangle {
    return this._rectangle;
  }

  get zoom(): number {
    return this._zoom;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set focus(f: Focus) {
    switch (this._focus) {
      case "top_left":
        this._focus_position = this._position.duplicate();
        break;

      case "top_center":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(this._rectangle.w / 2, 0));
        break;

      case "top_right":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(this._rectangle.w, 0));
        break;

      case "center_left":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(0, this._rectangle.h / 2));
        break;

      case "center":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(this._rectangle.w / 2, this._rectangle.h / 2));
        break;

      case "center_right":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(this._rectangle.w, this._rectangle.h / 2));
        break;

      case "bottom_left":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(0, this._rectangle.h));
        break;

      case "bottom_center":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(this._rectangle.w / 2, this._rectangle.h));
        break;

      case "bottom_right":
        this._focus_position = this._position.duplicate().subtract(Vector2.init(this._rectangle.w, this._rectangle.h));
        break;
    }
    this._focus = f;
  }

  set position(p: Vector2) {
    this._position = p;
    this.focus = this._focus;
  }

  set rectangle(r: Rectangle) {
    this._rectangle = r;
  }

  set zoom(z: number) {
    this._zoom = z;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    // nothing to deinit
  };
}
