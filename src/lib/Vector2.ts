export default class Vector2 {
  private _x: number;
  private _y: number;

  private constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static add = (v1: Vector2, v2: Vector2): Vector2 => new Vector2(v1.x + v2.x, v1.y + v2.y);

  public static distance = (v1: Vector2, v2: Vector2): number => Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);

  public static dot = (v1: Vector2, v2: Vector2): number => v1.x * v2.x + v1.y * v2.y;

  public static equal = (v1: Vector2, v2: Vector2): boolean => v1.x === v2.x && v1.y === v2.y;

  public static init = (x: number, y: number): Vector2 => new Vector2(x, y);

  public static lerp = (v1: Vector2, v2: Vector2, progress: number): Vector2 => {
    return Vector2.init(v1.x + (v2.x - v1.x) * progress, v1.y + (v2.y - v1.y) * progress);
  };

  public static normalize = (v: Vector2): Vector2 => {
    const len = Math.sqrt(v.x ** 2 + v.y ** 2);
    return len !== 0 ? new Vector2(v.x / len, v.y / len) : Vector2.zero();
  };

  public static scale = (v: Vector2, s: number): Vector2 => new Vector2(v.x * s, v.y * s);

  public static subtract = (v1: Vector2, v2: Vector2): Vector2 => new Vector2(v1.x - v2.x, v1.y - v2.y);

  public static zero = (): Vector2 => new Vector2(0, 0);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get length(): number {
    return Math.sqrt(this._x ** 2 + this._y ** 2);
  }

  get value(): { x: number; y: number } {
    return { x: this._x, y: this._y };
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public add = (v: Vector2): Vector2 => {
    this._x += v.x;
    this._y += v.y;
    return this;
  };

  public deinit = (): void => {
    this._x = 0;
    this._y = 0;
  };

  public duplicate = (): Vector2 => new Vector2(this.x, this.y);

  public equal = (v: Vector2): boolean => this.x === v.x && this.y === v.y;

  public normalize = (): Vector2 => {
    const len = this.length;
    if (len !== 0) {
      this._x /= len;
      this._y /= len;
    }
    return this;
  };

  public scale = (s: number): Vector2 => {
    this._x *= s;
    this._y *= s;
    return this;
  };

  public subtract = (v: Vector2): Vector2 => {
    this._x -= v.x;
    this._y -= v.y;
    return this;
  };
}
