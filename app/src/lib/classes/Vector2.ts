export interface IVector2 {
  x: number;
  y: number;
}

export default class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static add = (v1: Vector2, v2: Vector2): Vector2 => new Vector2(v1.x + v2.x, v1.y + v2.y);

  static distance = (v1: Vector2, v2: Vector2): number => Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);

  static dot = (v1: Vector2, v2: Vector2): number => v1.x * v2.x + v1.y * v2.y;

  static equal = (v1: Vector2, v2: Vector2): boolean => v1.x === v2.x && v1.y === v2.y;

  static init = (x: number, y: number): Vector2 => new Vector2(x, y);

  static lerp = (v1: Vector2, v2: Vector2, a: number): Vector2 => {
    return new Vector2(v1.x + (v2.x - v1.x) * a, v1.y + (v2.y - v1.y) * a);
  };

  static normalize = (v: Vector2): Vector2 => {
    const len = Math.sqrt(v.x ** 2 + v.y ** 2);
    return len !== 0 ? new Vector2(v.x / len, v.y / len) : Vector2.zero();
  };

  static scale = (v: Vector2, s: number): Vector2 => new Vector2(v.x * s, v.y * s);

  static subtract = (v1: Vector2, v2: Vector2): Vector2 => new Vector2(v1.x - v2.x, v1.y - v2.y);

  static zero = (): Vector2 => new Vector2(0, 0);

  get length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get value(): IVector2 {
    return {
      x: this.x,
      y: this.y
    };
  }

  public add = (v: Vector2): void => {
    this.x += v.x;
    this.y += v.y;
  };

  public duplicate = (): Vector2 => new Vector2(this.x, this.y);

  public equal = (v: Vector2): boolean => {
    return this.x === v.x && this.y === v.y;
  };

  public lerp = (v: Vector2, a: number): void => {
    this.x += (v.x - this.x) * a;
    this.y += (v.y - this.y) * a;
  };

  public normalize = (): void => {
    const len = this.length;
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
    }
  };

  public scale = (s: number): Vector2 => {
    this.x *= s;
    this.y *= s;
    return this;
  };

  public subtract = (v: Vector2): void => {
    this.x -= v.x;
    this.y -= v.y;
  };
}
