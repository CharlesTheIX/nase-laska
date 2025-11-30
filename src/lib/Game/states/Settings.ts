import Game from "..";
import Timer from "@/lib/Timer";
import Color from "@/lib/Color";
import Storage from "@/lib/Storage";
import Vector2 from "@/lib/Vector2";
import Rectangle from "@/lib/Rectangle";
import { settings_data as data } from "./data";

export default class Settings {
  private _storage: Storage;
  private _input_timer: Timer;
  private _menu_index: number = 0;
  private _sfx_volume: number = 5;
  private _music_volume: number = 5;
  private _resource_name: string = "settings_screen";

  constructor(storage: Storage, timer: Timer) {
    this._storage = storage;
    this._input_timer = timer;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage: Storage, timer: Timer): Settings => new Settings(storage, timer);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get menu_index(): number {
    return this._menu_index;
  }

  get music_volume(): number {
    return this._music_volume;
  }

  get resource_name(): string {
    return this._resource_name;
  }

  get sfx_volume(): number {
    return this._sfx_volume;
  }

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
    const resource_img = game.resources.images[this.resource_name];
    if (!!resource_img && resource_img.loaded) {
      game.canvas.drawImage(resource_img.image, rect.duplicate().scale(1).translate(Vector2.init(0, 300)), rect);
    }
  };

  private drawTextLayer = (game: Game): void => {
    var count = 0;
    var y_pos = game.canvas.rect.h / 2 + 4 * 16;
    while (count < data[this._storage.language].options.length) {
      const color = this._menu_index === count ? Color.white : Color.gray;
      game.canvas.drawText(data[this._storage.language].options[count], Vector2.init(3 * 16, y_pos + count * 32), color);
      count++;
    }
  };

  public update(game: Game, time_step: number): void {
    this._input_timer.update();
    if (this._input_timer.state === "running") return;

    const last_key = game.input_handler.lastKeyPressed();
    const option_count = data[this._storage.language].options.length;
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
        game.resources.playAudio("menu_move");
        this._menu_index = (this._menu_index + 1) % option_count;
        break;

      case " ":
      case "Space":
      case "Enter":
        if (this._menu_index === 4) {
          this._input_timer.reset();
          game.resources.playAudio("menu_move");
          this._menu_index = 0;
          game.state = "start";
        }
        break;
    }
  }
}
