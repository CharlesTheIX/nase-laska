import Timer from "@/lib/classes/Timer";
import Canvas from "@/lib/classes/Canvas";
import { canvas_size } from "@/lib/globals";

export default class SettingsScreen {
  input_timer: Timer;

  private constructor() {
    this.input_timer = Timer.init("count_down", 150);
  }

  static init = (): SettingsScreen => new SettingsScreen();

  public draw = (c: Canvas): void => {
    const bg_rect: IRectangle = { x: 32, y: 32, w: canvas_size.x - 64, h: canvas_size.y - 64 };
    c.drawRectangle({ rectangle: bg_rect, color: "rgba(34, 34, 34, 0.8)" });

    const title_pos: IVector2 = { x: canvas_size.x / 2, y: 64 };
    c.drawText({ position: title_pos, text: "Settings", align: "center" });
  };

  public update = (): void => {};
}
