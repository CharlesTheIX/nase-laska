import Game from "@/lib/classes/Game";
import Timer from "@/lib/classes/Timer";
import Vector2 from "@/lib/classes/Vector2";
import { canvas_size, tile_size, font } from "@/lib/globals";
import { getInputKeySets, getMovementKeys } from "@/lib/inputKeys";
import convertMessageToMessageArray from "@/lib/helpers/convertMessageToMessageArray";

export default class InventoryScreen {
  scale: number;
  message: string;
  max_cols: number;
  position: Vector2;
  input_timer: Timer;
  active_item: number;
  current_message: string[];

  private constructor() {
    this.scale = 3;
    this.message = "";
    this.active_item = 0;
    this.current_message = [];
    this.position = Vector2.init(100, 100);
    this.input_timer = Timer.init("count_down", 150);
    this.max_cols = Math.floor(canvas_size.x - ((9 * tile_size) / tile_size) * this.scale);
  }

  static init = (): InventoryScreen => new InventoryScreen();

  public draw = (g: Game): void => {
    const title_pos: IVector2 = { x: canvas_size.x / 2, y: 4 * tile_size };
    const bg_rect: IRectangle = {
      x: 2 * tile_size,
      y: 2 * tile_size,
      w: canvas_size.x - 4 * tile_size,
      h: canvas_size.y - 4 * tile_size
    };
    g.canvas.drawRectangle({ rectangle: bg_rect, color: "rgba(34, 34, 34, 0.8)" });
    g.canvas.drawText({ position: title_pos, text: "Inventory", align: "center" });
    if (!g.player?.inventory) return;

    const inventory_items_sheet = (g.resources.images["inventory_items_sheet"] as ImageResource).image;
    const getCol = (i: number) => (i % this.max_cols) * tile_size * this.scale + 6 * tile_size;
    const getRow = (i: number) => Math.floor(i / this.max_cols) * tile_size * this.scale + 6 * tile_size;
    const r_active = {
      x: getCol(this.active_item),
      y: getRow(this.active_item),
      w: this.scale * tile_size,
      h: this.scale * tile_size
    };

    g.canvas.drawRectangle({ color: "#bbbbbb", rectangle: r_active });
    g.player.inventory.items.forEach((item: InventoryItem, i: number) => {
      const r_src = { w: tile_size, h: tile_size, x: item.srcs[0].x, y: item.srcs[0].y };
      const r_dest = { w: tile_size * this.scale, h: tile_size * this.scale, x: getCol(i), y: getRow(i) };
      g.canvas.drawImage(inventory_items_sheet, r_src, r_dest);
    });

    if (!this.message.length) return;
    if (!this.current_message.length) {
      this.current_message = convertMessageToMessageArray(this.message, g.canvas, bg_rect.w - 4 * tile_size);
    }

    const max_lines = 3;
    const r_h = 6 * tile_size;
    const value_pos: IVector2 = { x: bg_rect.x + tile_size, y: canvas_size.y - r_h - 5 * tile_size };
    g.canvas.drawText({
      align: "left",
      position: value_pos,
      text: `Value: ${g.player.inventory.items[this.active_item].value} | Count: ${
        g.player.inventory.items[this.active_item].count
      }`
    });

    const getStartY = (index: number): number => {
      return Math.floor(canvas_size.y - r_h - 2 * tile_size + (font.size / 2) * index);
    };
    const message_rect: IRectangle = {
      x: bg_rect.x + tile_size,
      y: canvas_size.y - r_h - 3 * tile_size,
      w: bg_rect.w - 2 * tile_size,
      h: r_h
    };

    g.canvas.drawRectangle({ rectangle: message_rect, color: "#bbbbbb" });
    for (var i = 0; i < max_lines; i++) {
      if (!this.current_message[i]) return;
      const position = { x: message_rect.x + tile_size, y: getStartY((i % max_lines) * max_lines) };
      g.canvas.drawText({ position, text: this.current_message[i], color: "#222222" });
    }
  };

  public reset = (): void => {
    this.message = "";
    this.active_item = 0;
    this.current_message = [];
  };

  private setMessage = (item: InventoryItem): void => {
    this.message = item.message;
    this.current_message = [];
  };

  public update = (g: Game): void => {
    if (!g.player?.inventory || !g.player.inventory.items.length) return;
    if (!this.message) {
      this.active_item = 0;
      this.setMessage(g.player.inventory.items[this.active_item]);
    }
    const movement_key_pressed: boolean = [...g.input_handler.keys].some((key) => getMovementKeys().has(key));
    if (!movement_key_pressed) return;
    g.input_timer.start();

    var next_value: number = this.active_item;
    const key_sets: KeySetMap = getInputKeySets();
    const last_key: string = g.input_handler.last_key;
    if (key_sets.left.has(last_key)) next_value -= 1;
    else if (key_sets.right.has(last_key)) next_value += 1;
    else if (key_sets.up.has(last_key)) next_value -= this.max_cols;
    else if (key_sets.down.has(last_key)) next_value += this.max_cols;
    // Capped indexing
    if (next_value >= 0 && next_value < g.player?.inventory.items.length) {
      this.active_item = next_value;
      this.setMessage(g.player.inventory.items[this.active_item]);
    }
    // Rolling indexing
    // if (next_value < 0) next_value = g.player.inventory.items.length - 1;
    // else if (next_value >= g.player.inventory.items.length) next_value = 0;
    // this.active_item = next_value;
    // this.setMessage(g.player.inventory.items[this.active_item]);
  };
}
