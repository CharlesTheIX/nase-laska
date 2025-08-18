import Rectangle from "@/lib/classes/Rectangle";
import { canvas_size, scale, tile_size, font_family } from "@/lib/globals";

export default class Canvas {
  rectangle: Rectangle;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  private constructor(c: HTMLCanvasElement) {
    this.canvas = c;
    this.canvas.width = canvas_size.w;
    this.canvas.height = canvas_size.h;
    this.rectangle = Rectangle.init(0, 0, canvas_size.w, canvas_size.h);
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  static init = (c: HTMLCanvasElement): Canvas => new Canvas(c);

  public clear = (rectangle: IRectangle): void => {
    this.context.clearRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  };

  public drawGrid = (): void => {
    for (var row = 0; row < canvas_size.h / tile_size.h / scale; row++) {
      for (var column = 0; column < canvas_size.w / tile_size.w / scale; column++) {
        this.context.strokeRect(
          column * tile_size.w * scale,
          row * tile_size.h * scale,
          tile_size.w * scale,
          tile_size.h * scale
        );
      }
    }
  };

  public drawImage = (image: HTMLImageElement, r_src: IRectangle, r_dest: IRectangle): void => {
    this.context.drawImage(
      image,
      r_src.x,
      r_src.y,
      r_src.w,
      r_src.h,
      r_dest.x * scale,
      r_dest.y * scale,
      r_dest.w * scale,
      r_dest.h * scale
    );
  };

  public drawRectangle = (props: DrawRectangleProps): void => {
    const { rectangle, color = "rgba(255,255,255, 0.8)" } = props;
    this.context.fillStyle = color;
    this.context.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  };

  public drawTextLines = (props: DrawTextLinesProps): void => {
    const { lines, color = "#000000", align = "left", position } = props;
    var count: number = 1;
    this.context.textAlign = align;
    this.context.fillStyle = color;
    this.context.textBaseline = "middle";
    const startX: number = position.x / scale;
    this.context.font = `bold ${font_family.font_size / scale}px ${font_family.name}, monospace`;
    const getStartY = (index: number): number => Math.floor((position.y + font_family.font_size * 2.5 * index) / scale);
    lines.forEach((line: string, index: number) => {
      this.context.fillText(`${line.toUpperCase()}`, startX, getStartY(index));
      count++;
    });
  };
}
