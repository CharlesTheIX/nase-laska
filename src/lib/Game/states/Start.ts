import Game from "..";
import Color from "@/lib/Color";
import Timer from "@/lib/Timer";
import Storage from "@/lib/Storage";
import Vector2 from "@/lib/Vector2";
import Rectangle from "@/lib/Rectangle";

const data: { [key: string]: any } = {
  en: {
    options: ["New Game", "Load Game", "Settings"],
  },
  cz: {
    options: ["Nová hra", "Načíst hru", "Nastavení"],
  },
};

export default class Start {
  private _storage: Storage;
  private _menu_index: number = 0;
  private _resource_name: string = "start_screen";
  private _input_timer: Timer = Timer.init("countdown", 120);

  constructor(storage: Storage) {
    this._storage = storage;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage: Storage): Start => new Start(storage);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get menu_index(): number {
    return this._menu_index;
  }

  get resource_name(): string {
    return this._resource_name;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    this._menu_index = 0;
    this._input_timer.deinit();
  };

  public draw(game: Game): void {
    this.drawBackgroundLayer(game);
    this.drawTextLayer(game);
  }

  private drawBackgroundLayer = (game: Game): void => {
    const rect = Rectangle.init(0, 0, game.canvas.rect.w, game.canvas.rect.h);
    const resource_img = game.resources.images[this.resource_name];
    if (!!resource_img && resource_img.loaded) {
      game.canvas.drawImage(resource_img.image, rect.duplicate().scale(1.2).translate(Vector2.init(0, 150)), rect);
    }
  };

  private drawTextLayer = (game: Game): void => {
    var count = 0;
    const save_data = game.storage.save_data;
    var y_pos = Math.floor((3 * game.canvas.rect.h) / 4) - 12 - 2 * 16;
    const option_count = save_data ? 3 : 2;
    while (count < option_count) {
      var text_index = 0;
      const color = this._menu_index === count ? Color.white : Color.gray;
      if (save_data && count === 0) text_index = 1;
      else if ((save_data && count === 1) || (!save_data && count === 0)) text_index = 0;
      else if ((save_data && count === 2) || (!save_data && count === 1)) text_index = 2;
      game.canvas.drawText(data[this._storage.language].options[text_index], Vector2.init(3 * 16, y_pos + count * 32), color);
      count++;
    }
  };

  public update(game: Game, time_step: number): void {
    this._input_timer.update();
    if (this._input_timer.state === "running") return;
    this._input_timer.reset();

    const option_count = game.storage.save_data ? 3 : 2;
    const last_key = game.input_handler.lastKeyPressed();
    switch (last_key) {
      case "w":
      case "W":
      case "KeyW":
      case "ArrowUp":
        // play sound effect
        this._menu_index = (this._menu_index - 1 + option_count) % option_count;
        break;

      case "s":
      case "S":
      case "KeyS":
      case "ArrowDown":
        // play sound effect
        this._menu_index = (this._menu_index + 1) % option_count;
        break;

      case " ":
      case "Space":
      case "Enter":
        // play sound effect
        switch (this._menu_index) {
          case 0:
            if (game.storage.save_data) {
              // load game
            } else {
              // new game
            }
            break;
          case 1:
            if (game.storage.save_data) {
              // new game
            } else {
              this._menu_index = 0;
              game.state = "settings";
            }
            break;
          case 2:
            this._menu_index = 0;
            game.state = "settings";
            break;
        }
        break;
      default:
        break;
    }
  }
}
