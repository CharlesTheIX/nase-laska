import Game from "@/lib/classes/Game";
import Timer from "@/lib/classes/Timer";
import Canvas from "@/lib/classes/Canvas";
import Vector2 from "@/lib/classes/Vector2";
import { getInputKeySets } from "@/lib/inputKeys";
import { canvas_size, tile_size, font_family } from "@/lib/globals";
import convertMessageToMessageArray from "@/lib/helpers/convertMessageToMessageArray";
import Inventory from "../Inventory";

export default class InventoryScreen {
  message: string;
  position: Vector2;
  complete: boolean;
  input_timer: Timer;
  active_message: number;
  current_message: string[];

  private constructor() {
    this.message = "";
    this.complete = false;
    this.active_message = 0;
    this.current_message = [];
    this.position = Vector2.init(100, 100);
    this.input_timer = Timer.init("count_down", 150);
  }

  static init = (): InventoryScreen => new InventoryScreen();

  public draw = (canvas: Canvas, inventory: Inventory): void => {
    if (!this.message.length) return;
    if (!this.current_message.length) convertMessageToMessageArray(this.message, canvas);
    const rectangle = {
      x: 0,
      h: 5 * tile_size,
      w: canvas_size.x,
      y: canvas_size.y - 5 * tile_size
    };
    canvas.drawRectangle({ rectangle, color: "#222222" });

    const max_lines = 3;
    const getStartY = (index: number): number => {
      return Math.floor(rectangle.y + tile_size + (font_family.font_size / 2) * index);
    };

    for (var i = this.active_message; i < this.active_message + max_lines; i++) {
      if (!this.current_message[i]) {
        this.complete = true;
        return;
      }

      const position = { x: rectangle.x + tile_size, y: getStartY((i % max_lines) * max_lines) };
      canvas.drawText({ position, text: this.current_message[i] });

      if (i === this.current_message.length) {
        this.complete = true;
        return;
      }
    }

    if (this.active_message + 3 < this.current_message.length) {
      const next_position = { x: canvas_size.x - tile_size, y: canvas_size.y - tile_size };
      canvas.drawText({ position: next_position, text: ">" });
    }
  };

  public reset = (): void => {
    this.message = "";
    this.complete = false;
    this.active_message = 0;
    this.current_message = [];
  };

  public update = (g: Game): void => {
    if (!this.message.length) return;
    const key_sets: KeySetMap = getInputKeySets();
    const last_key: string = g.input_handler.last_key;
    if (!key_sets.action.has(last_key)) return;
    g.input_timer.start();
    this.active_message += 3;

    if (this.complete) {
      this.reset();
      g.state = "playing";
      g.player?.character.emotion.hide();
    }
  };
}
