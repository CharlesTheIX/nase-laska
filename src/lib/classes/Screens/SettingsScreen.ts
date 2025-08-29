import Timer from "@/lib/classes/Timer";
import Canvas from "@/lib/classes/Canvas";
import { canvas_size, tile_size } from "@/lib/globals";
import Vector2 from "../Vector2";

export default class SettingsScreen {
  input_timer: Timer;

  private constructor() {
    this.input_timer = Timer.init("count_down", 150);
  }

  static init = (): SettingsScreen => new SettingsScreen();

  public draw = (c: Canvas): void => {
    const title_pos: IVector2 = { x: canvas_size.x / 2, y: 4 * tile_size };
    const bg_rect: IRectangle = {
      x: 2 * tile_size,
      y: 2 * tile_size,
      w: canvas_size.x - 4 * tile_size,
      h: canvas_size.y - 4 * tile_size
    };
    c.drawRectangle({ rectangle: bg_rect, color: "rgba(34, 34, 34, 0.8)" });
    c.drawText({ position: title_pos, text: "SETTINGS", align: "center" });

    const left_col_v = Vector2.init(3 * tile_size, 7 * tile_size);
    c.drawText({ position: left_col_v.value, text: "MOVEMENT" });
    left_col_v.y += 2 * tile_size;
    c.drawText({ position: left_col_v.value, text: "UP: W | ARROW UP" });
    left_col_v.y += 1.5 * tile_size;
    c.drawText({ position: left_col_v.value, text: "DOWN: S | ARROW DOWN" });
    left_col_v.y += 1.5 * tile_size;
    c.drawText({ position: left_col_v.value, text: "LEFT: A | ARROW LEFT" });
    left_col_v.y += 1.5 * tile_size;
    c.drawText({ position: left_col_v.value, text: "RIGHT: D | ARROW DOWN" });

    left_col_v.y += 3 * tile_size;
    c.drawText({ position: left_col_v.value, text: "TOGGLES" });
    left_col_v.y += 2 * tile_size;
    c.drawText({ position: left_col_v.value, text: "INVENTORY: I" });
    left_col_v.y += 1.5 * tile_size;
    c.drawText({ position: left_col_v.value, text: "SETTINGS: P" });

    left_col_v.y += 3 * tile_size;
    c.drawText({ position: left_col_v.value, text: "MISC." });
    left_col_v.y += 2 * tile_size;
    c.drawText({ position: left_col_v.value, text: "RUN: Shift" });
    left_col_v.y += 1.5 * tile_size;
    c.drawText({ position: left_col_v.value, text: "SAVE: Z" });
  };

  public update = (): void => {};
}
