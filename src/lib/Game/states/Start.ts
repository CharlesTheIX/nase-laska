import Game from "@/lib/Game";
import Color from "@/lib/Color";
import Timer from "@/lib/Timer";
import Storage from "@/lib/Storage";
import Vector2 from "@/lib/Vector2";
import { tile_size } from "@/globals";
import Rectangle from "@/lib/Rectangle";
import { start_data as data } from "./_data";

export default class Start {
  private _storage: Storage;
  private _input_timer: Timer;
  private _menu_index: number = 0;
  private _resource_name: string = "start_screen";

  private constructor(storage: Storage, timer: Timer) {
    this._storage = storage;
    this._input_timer = timer;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage: Storage, timer: Timer): Start => new Start(storage, timer);

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
    const img_rect = rect.duplicate().scale(1.2).translate(Vector2.init(0, 150));
    if (!!resource_img && resource_img.loaded) game.canvas.drawImage(resource_img.image, img_rect, rect);
  };

  private drawTextLayer = (game: Game): void => {
    var count = 0;
    const save_data = game.storage.save_data;
    var y_pos = game.canvas.rect.h / 2 + 4 * tile_size;
    const language = this._storage.settings_data.language;
    const option_count = save_data ? 3 : 2;

    while (count < option_count) {
      var text_index = 0;
      const color = this._menu_index === count ? Color.white() : Color.grey();

      if (save_data && count === 0) text_index = 1;
      else if ((save_data && count === 1) || (!save_data && count === 0)) text_index = 0;
      else if ((save_data && count === 2) || (!save_data && count === 1)) text_index = 2;

      game.canvas.drawText(data[language].options[text_index], Vector2.init(3 * tile_size, y_pos + count * (1.5 * tile_size)), color);
      count++;
    }
  };

  private newGameConfirmationCallback = (result: boolean | number, game: Game): void => {
    if (result) {
      game.state = "new_game";
      game.storage.save_data = null;
      game.resources.playAudio("start_game");
    } else {
      game.state = "start";
      game.resources.playAudio("menu_move");
    }

    this.deinit();
  };

  public update(game: Game, time_step: number): void {
    this._input_timer.update();
    if (this._input_timer.state === "running") return;

    const option_count = game.storage.save_data ? 3 : 2;
    const last_key = game.input_handler.lastKeyPressed();
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
        this._input_timer.reset();
        if (game.storage.save_data) {
          switch (this._menu_index) {
            case 0:
              game.state = "play";
              game.resources.playAudio("start_game");
              this.deinit();
              break;

            case 1:
              game.resources.playAudio("menu_move");
              game.message_screen.state = "input";
              game.message_screen.msgs = [
                {
                  type: "yes_no",
                  text: data[game.storage.settings_data.language].new_game_confirm_msg,
                  callback: (result: boolean | number, game: Game) => this.newGameConfirmationCallback(result, game),
                },
              ];
              game.state = "message";
              break;

            case 2:
              game.state = "settings";
              game.resources.playAudio("menu_move");
              this.deinit();
              break;
          }
        } else {
          switch (this._menu_index) {
            case 0:
              game.state = "new_game";
              game.resources.playAudio("start_game");
              this.deinit();
              break;

            case 1:
              game.state = "settings";
              game.resources.playAudio("menu_move");
              this.deinit();
              break;
          }
        }
        break;
    }
  }
}
