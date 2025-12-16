import Vector2 from "./Vector2";
import { tile_size } from "@/globals";

export default class Rectangle {
  private _x: number;
  private _y: number;
  private _w: number;
  private _h: number;

  private constructor(x: number, y: number, w: number, h: number) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (x: number, y: number, w: number, h: number): Rectangle => new Rectangle(x, y, w, h);

  public static tile = (v: Vector2): Rectangle => new Rectangle(v.x, v.y, tile_size, tile_size);

  public static zero = (): Rectangle => new Rectangle(0, 0, 0, 0);

  public static equal = (r1: Rectangle, r2: Rectangle): boolean => {
    return r1._x === r2._x && r1.y === r2.y && r1.w === r2.w && r1.h === r2.h;
  };

  // GETTERS ----------------------------------------------------------------------------------------------------------------------------------------
  get h(): number {
    return this._h;
  }

  get position(): Vector2 {
    return Vector2.init(this._x, this._y);
  }

  get value(): { x: number; y: number; w: number; h: number } {
    return { x: this._x, y: this._y, w: this._w, h: this._h };
  }

  get w(): number {
    return this._w;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public containsRectangle = (r: Rectangle): boolean => {
    return r.x >= this.x && r.y >= this.y && r.x + r.w <= this.x + this.w && r.y + r.h <= this.y + this.h;
  };

  public containsVector2 = (v: Vector2): boolean => {
    return v.x >= this.x && v.x <= this.x + this.w && v.y >= this.y && v.y <= this.y + this.h;
  };

  public deinit = (): void => {
    this._x = 0;
    this._y = 0;
    this._w = 0;
    this._h = 0;
  };

  public duplicate = (): Rectangle => Rectangle.init(this.x, this.y, this.w, this.h);

  public equal = (r: Rectangle): boolean => {
    return this.x === r.x && this.y === r.y && this.w === r.w && this.h === r.h;
  };

  public scale = (factor: number): Rectangle => {
    this._w *= factor;
    this._h *= factor;
    return this;
  };

  public translate = (v: Vector2): Rectangle => {
    this._x += v.x;
    this._y += v.y;
    return this;
  };
}
