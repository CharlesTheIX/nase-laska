import Game from "@/lib/Game";
import Color from "@/lib/Color";
import Memory from "@/lib/Memory";
import Vector2 from "@/lib/Vector2";
import { tile_size } from "@/globals";
import Rectangle from "@/lib/Rectangle";
import { controls_data as data } from "@/lib/Game/states/_data";

export default class Controls {
  private _memory: Memory;
  private _resource_name: string = "controls_screen";

  private constructor(memory: Memory) {
    this._memory = memory;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (memory: Memory): Controls => new Controls(memory);

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {};

  public draw(game: Game): void {
    this.drawBackgroundLayer(game);
    this.drawTextLayer(game);
  }

  private drawBackgroundLayer = (game: Game): void => {
    const rect = Rectangle.init(0, 0, game.canvas.rect.w, game.canvas.rect.h);
    const resource_img = game.resources.images[this._resource_name];
    const img_rect = rect.duplicate().scale(1.2).translate(Vector2.init(0, 150));
    if (resource_img && resource_img.loaded) game.canvas.drawImage(resource_img.image, img_rect, rect);
  };

  private drawTextLayer = (game: Game): void => {
    var y_pos = 3 * tile_size;
    const language = this._memory.settings_data.language;
    Object.keys(data[language]).forEach((key: string, index: number) => {
      game.canvas.drawText(data[language][key], Vector2.init(3 * tile_size, y_pos + index * (2 * tile_size)), Color.grey());
    });
    y_pos = game.canvas.rect.h - 3 * tile_size;
    game.canvas.drawText(language === "en" ? "Back" : "Zpět", Vector2.init(3 * tile_size, y_pos), Color.white());
  };

  public update(game: Game, time_step: number): void {
    game.menu_input_timer.update(time_step);
    if (game.menu_input_timer.state === "running") return;
    const last_key = game.input_handler.lastKeyPressed();
    switch (last_key) {
      case " ":
      case "Space":
      case "Enter":
        game.state = "settings";
        game.menu_input_timer.reset();
        game.resources.playAudio("menu_move");
        this.deinit();
        break;
    }
  }
}
