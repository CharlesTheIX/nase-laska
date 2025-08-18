import { tile_size } from "../globals";
import Vector2 from "@/lib/classes/Vector2";

export default class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  static init = (x: number, y: number, w: number, h: number): Rectangle => new Rectangle(x, y, w, h);
  static tile = (v: Vector2): Rectangle => new Rectangle(v.x, v.y, tile_size.w, tile_size.h);
  static zero = (): Rectangle => new Rectangle(0, 0, 0, 0);

  static equal = (r1: Rectangle, r2: Rectangle): boolean => {
    return r1.x === r2.x && r1.y === r2.y && r1.w === r2.w && r1.h === r2.h;
  };

  get position(): Vector2 {
    return Vector2.init(this.x, this.y);
  }

  get value(): IRectangle {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  public containsRectangle = (r: Rectangle): boolean => {
    return r.x >= this.x && r.y >= this.y && r.x + r.w <= this.x + this.w && r.y + r.h <= this.y + this.h;
  };

  public containsVector2 = (v: Vector2): boolean => {
    return v.x >= this.x && v.x <= this.x + this.w && v.y >= this.y && v.y <= this.y + this.h;
  };

  public duplicate = (): Rectangle => Rectangle.init(this.x, this.y, this.w, this.h);

  public equal = (r: Rectangle): boolean => {
    return this.x === r.x && this.y === r.y && this.w === r.w && this.h === r.h;
  };
}
