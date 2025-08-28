import Camera from "@/lib/classes/Camera";
import Rectangle from "@/lib/classes/Rectangle";
import { canvas_size, tile_size, font } from "@/lib/globals";

export default class Canvas {
  rectangle: Rectangle;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  private constructor(c: HTMLCanvasElement) {
    this.canvas = c;
    this.canvas.width = canvas_size.x;
    this.canvas.height = canvas_size.y;
    this.rectangle = Rectangle.init(0, 0, canvas_size.x, canvas_size.y);
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.imageSmoothingEnabled = false;
  }

  static init = (c: HTMLCanvasElement): Canvas => new Canvas(c);

  public clear = (rectangle: IRectangle): void => {
    this.context.clearRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  };

  public drawGrid = (camera: Camera): void => {
    const size_w = tile_size * camera.scale;
    const size_h = tile_size * camera.scale;
    const row_count = canvas_size.y / tile_size / camera.scale;
    const col_count = canvas_size.x / tile_size / camera.scale;
    for (var row = 0; row < row_count; row++) {
      for (var column = 0; column < col_count; column++) {
        this.context.strokeRect(column * size_w, row * size_h, size_w, size_h);
      }
    }
  };

  public drawImage = (image: HTMLImageElement, r_src: IRectangle, r_dest: IRectangle): void => {
    this.context.drawImage(image, r_src.x, r_src.y, r_src.w, r_src.h, r_dest.x, r_dest.y, r_dest.w, r_dest.h);
  };

  public drawRectangle = (props: DrawRectangleProps): void => {
    const { rectangle, color = "rgba(255,255,255, 0.8)" } = props;
    this.context.fillStyle = color;
    this.context.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  };

  public drawTextLines = (props: DrawTextLinesProps): void => {
    const { lines, color = "#bbbbbb", align = "left", position } = props;
    var count: number = 1;
    this.context.textAlign = align;
    this.context.fillStyle = color;
    this.context.textBaseline = "top";
    const startX: number = position.x;
    this.context.font = `bold ${font.size}px ${font.name}, monospace`;
    const getStartY = (index: number): number => Math.floor(position.y + font.size * 2.5 * index);
    lines.forEach((line: string, index: number) => {
      this.context.fillText(`${line}`, startX, getStartY(index));
      count++;
    });
  };

  public drawText = (props: { text: string; color?: string; align?: CanvasTextAlign; position: IVector2 }): void => {
    const { text, color = "#bbbbbb", align = "left", position } = props;
    this.context.textAlign = align;
    this.context.fillStyle = color;
    this.context.textBaseline = "top";
    this.context.font = `bold ${font.size}px ${font.name}, monospace`;
    this.context.fillText(text, position.x, position.y);
  };
}
