import Color from "./Color";
import Vector2 from "./Vector2";
import Rectangle from "@/lib/Rectangle";

export const font = { name: "GameFont", size: 16 };
export const canvas_size = Vector2.init(45, 33).scale(16);

export default class Canvas {
  private _rect: Rectangle;
  private _canvas: HTMLCanvasElement;
  private _cxt: CanvasRenderingContext2D;

  private constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._canvas.width = canvas_size.x;
    this._canvas.height = canvas_size.y;
    this._rect = Rectangle.init(0, 0, canvas_size.x, canvas_size.y);
    this._cxt = this._canvas.getContext("2d") as CanvasRenderingContext2D;
    this._cxt.imageSmoothingEnabled = false;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (c: HTMLCanvasElement): Canvas => new Canvas(c);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  get cxt(): CanvasRenderingContext2D {
    return this._cxt;
  }

  get rect(): Rectangle {
    return this._rect;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public clear = (): void => {
    this.cxt.clearRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
  };

  public deinit = (): void => {
    this.cxt.clearRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    this.canvas.remove();
  };

  public drawGrid = (grid_size: number = 16, clr?: string): void => {
    this.cxt.strokeStyle = clr || Color.black();
    for (var x = 0; x <= this.rect.w; x += grid_size) {
      this.cxt.beginPath();
      this.cxt.moveTo(x, 0);
      this.cxt.lineTo(x, this.rect.h);
      this.cxt.stroke();
    }
    for (var y = 0; y <= this.rect.h; y += grid_size) {
      this.cxt.beginPath();
      this.cxt.moveTo(0, y);
      this.cxt.lineTo(this.rect.w, y);
      this.cxt.stroke();
    }
  };

  public drawImage = (img: HTMLImageElement, rect: Rectangle, rect_dest: Rectangle): void => {
    const r_src = rect.value;
    const r_dest = rect_dest.value;
    this.cxt.drawImage(img, r_src.x, r_src.y, r_src.w, r_src.h, r_dest.x, r_dest.y, r_dest.w, r_dest.h);
  };

  public drawRectangle = (rect: Rectangle, clr?: string): void => {
    this.cxt.fillStyle = clr || Color.white();
    this.cxt.fillRect(rect.x, rect.y, rect.w, rect.h);
  };

  public drawTextLines = (lines: string[], pos: Vector2, clr?: string, align?: CanvasTextAlign): void => {
    this.cxt.textBaseline = "top";
    this.cxt.textAlign = align || "left";
    this.cxt.fillStyle = clr || Color.black();
    this.cxt.font = `bold ${font.size}px ${font.name}, monospace`;
    var count = 1;
    const getStartY = (index: number): number => Math.floor(pos.y + font.size * 2.5 * index);
    lines.forEach((line: string, index: number) => {
      this.cxt.fillText(`${line}`, pos.x, getStartY(index));
      count++;
    });
  };

  public drawText = (text: string, pos: Vector2, clr?: string, font_size?: number, font_weight?: string, align?: CanvasTextAlign): void => {
    this.cxt.textBaseline = "top";
    this.cxt.textAlign = align || "left";
    this.cxt.fillStyle = clr || Color.black();
    this.cxt.font = `${font_weight || "normal"} ${font_size || font.size}px ${font.name}, monospace`;
    this.cxt.fillText(text, pos.x, pos.y);
  };

  public measureText = (text: string, font_size?: number, font_weight?: string): { w: number; h: number } => {
    this.cxt.font = `${font_weight || "normal"} ${font_size || font.size}px ${font.name}, monospace`;
    const metrics = this.cxt.measureText(text);
    return { w: metrics.width, h: font.size };
  };

  public restoreScale = (): void => {
    this.cxt.restore();
  };

  // public scale = (map_rect: Rectangle, camera: Camera): void => {
  //   this.cxt.save();
  //   this.cxt.translate(map_rect.w / 2, map_rect.h / 2);
  //   this.cxt.scale(camera.scale, camera.scale);
  //   this.cxt.translate(-camera.position.x, -camera.position.y);
  // };
}
