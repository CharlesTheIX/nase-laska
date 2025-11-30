import Game from "@/lib/Game";
import Timer from "@/lib/Timer";
import Color from "@/lib/Color";
import Storage from "@/lib/Storage";
import Vector2 from "@/lib/Vector2";
import Rectangle from "@/lib/Rectangle";
import { controls_data as data } from "./_data";

export default class Controls {
  private _storage: Storage;
  private _input_timer: Timer;
  private _menu_index: number = 0;
  private _resource_name: string = "controls_screen";

  constructor(storage: Storage, timer: Timer) {
    this._storage = storage;
    this._input_timer = timer;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage: Storage, timer: Timer): Controls => new Controls(storage, timer);

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    this._menu_index = 0;
  };

  public draw(game: Game): void {
    this.drawBackgroundLayer(game);
    this.drawTextLayer(game);
  }

  private drawBackgroundLayer = (game: Game): void => {
    const rect = Rectangle.init(0, 0, game.canvas.rect.w, game.canvas.rect.h);
    const resource_img = game.resources.images[this._resource_name];
    const img_rect = rect.duplicate().scale(1).translate(Vector2.init(0, 300));
    if (resource_img && resource_img.loaded) game.canvas.drawImage(resource_img.image, img_rect, rect);
  };

  private drawTextLayer = (game: Game): void => {
    var count = 0;
    var y_pos = game.canvas.rect.h / 2 + 4 * 16;
    const settings = this._storage.settings_data;
    while (count < data[settings.language].options.length) {
      const color = this._menu_index === count ? Color.white : Color.gray;
      var text = data[settings.language].options[count];
      game.canvas.drawText(text, Vector2.init(3 * 16, y_pos + count * 32), color);
      count++;
    }
  };

  public update(game: Game, time_step: number): void {
    this._input_timer.update();
    if (this._input_timer.state === "running") return;

    const last_key = game.input_handler.lastKeyPressed();
    const option_count = data[this._storage.settings_data.language].options.length;
    switch (last_key) {
      case "w":
      case "W":
      case "KeyW":
      case "ArrowUp":
        this._input_timer.reset();
        game.resources.playAudio("menu_move");
        this._menu_index = (this._menu_index - 1 + option_count) % option_count;
        break;

      case "s":
      case "S":
      case "KeyS":
      case "ArrowDown":
        this._input_timer.reset();
        game.resources.stopAudio("music");
        game.resources.playAudio("menu_move");
        this._menu_index = (this._menu_index + 1) % option_count;
        break;

      case " ":
      case "Space":
      case "Enter":
        switch (this._menu_index) {
          case 0:
            this._input_timer.reset();
            game.resources.playAudio("menu_move");
            this._menu_index = 0;
            game.state = "settings";
            break;
        }
        break;
    }
  }
}
