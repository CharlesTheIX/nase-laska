import Game from "@/lib/Game";
import Timer from "@/lib/Timer";
import Color from "@/lib/Color";
import Storage from "@/lib/Storage";
import Vector2 from "@/lib/Vector2";
import Rectangle from "@/lib/Rectangle";
import { settings_data as data } from "./_data";

export default class Settings {
  private _storage: Storage;
  private _input_timer: Timer;
  private _menu_index: number = 0;
  private _came_from: string = "start";
  private _resource_name: string = "settings_screen";

  constructor(storage: Storage, timer: Timer) {
    this._storage = storage;
    this._input_timer = timer;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage: Storage, timer: Timer): Settings => new Settings(storage, timer);

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set came_from(state: string) {
    this._came_from = state;
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
    const resource_img = game.resources.images[this._resource_name];
    const img_rect = rect.duplicate().scale(1.2).translate(Vector2.init(0, 150));
    if (resource_img && resource_img.loaded) game.canvas.drawImage(resource_img.image, img_rect, rect);
  };

  private drawTextLayer = (game: Game): void => {
    var count = 0;
    var color: string;
    var y_pos = 3 * 16;
    const settings = this._storage.settings_data;
    while (count < data[settings.language].options.length) {
      color = this._menu_index === count ? Color.white : Color.grey;
      var text = data[settings.language].options[count];
      if (count < 3) text += ": ";
      game.canvas.drawText(text, Vector2.init(3 * 16, y_pos + count * 32), color);
      const text_width = game.canvas.measureText(text).w;
      var pos_x = 3 * 16 + text_width + 8;
      if (count === 0) game.canvas.drawText(`< ${settings.music_volume} >`, Vector2.init(pos_x, y_pos + count * 32), color);
      else if (count === 1) game.canvas.drawText(`< ${settings.sfx_volume} >`, Vector2.init(pos_x, y_pos + count * 32), color);
      else if (count === 2) game.canvas.drawText(`< ${settings.language.toUpperCase()} >`, Vector2.init(pos_x, y_pos + count * 32), color);
      count++;
    }
    y_pos = game.canvas.rect.h - 3 * 16;
    color = this._menu_index === 4 ? Color.white : Color.grey;
    game.canvas.drawText(settings.language === "en" ? "Back" : "Zpět", Vector2.init(3 * 16, y_pos), color);
  };

  public update(game: Game, time_step: number): void {
    this._input_timer.update();
    if (this._input_timer.state === "running") return;

    const last_key = game.input_handler.lastKeyPressed();
    const option_count = data[this._storage.settings_data.language].options.length + 1;
    switch (last_key) {
      case "w":
      case "W":
      case "KeyW":
      case "ArrowUp":
        this._input_timer.reset();
        game.resources.stopAudio("music");
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

      case "a":
      case "A":
      case "KeyA":
      case "ArrowLeft":
        switch (this._menu_index) {
          case 0:
            this._input_timer.reset();
            game.resources.playAudio("music");
            game.resources.playAudio("menu_move");
            const music_volume = Math.max(0, this._storage.settings_data.music_volume - 1);
            game.resources.setAudioVolume(music_volume / 10, true);
            break;

          case 1:
            this._input_timer.reset();
            const sfx_volume = Math.max(0, this._storage.settings_data.sfx_volume - 1);
            game.resources.setAudioVolume(sfx_volume / 10, false);
            game.resources.playAudio("menu_move");
            break;

          case 2:
            this._input_timer.reset();
            game.resources.playAudio("menu_move");
            this._storage.settings_data = { language: this._storage.settings_data.language === "en" ? "cz" : "en" };
            break;
        }
        break;

      case "d":
      case "D":
      case "KeyD":
      case "ArrowRight":
        switch (this._menu_index) {
          case 0:
            this._input_timer.reset();
            game.resources.playAudio("music");
            game.resources.playAudio("menu_move");
            const music_volume = Math.min(10, this._storage.settings_data.music_volume + 1);
            game.resources.setAudioVolume(music_volume / 10, true);
            break;

          case 1:
            this._input_timer.reset();
            const sfx_volume = Math.min(10, this._storage.settings_data.sfx_volume + 1);
            game.resources.setAudioVolume(sfx_volume / 10, false);
            game.resources.playAudio("menu_move");
            break;

          case 2:
            this._input_timer.reset();
            game.resources.playAudio("menu_move");
            this._storage.settings_data = { language: this._storage.settings_data.language === "en" ? "cz" : "en" };
            break;
        }
        break;

      case " ":
      case "Space":
      case "Enter":
        switch (this._menu_index) {
          case 3:
            this._input_timer.reset();
            game.resources.playAudio("menu_move");
            this._menu_index = 0;
            game.state = "controls";
            break;
          case 4:
            this._input_timer.reset();
            game.resources.playAudio("menu_move");
            this._menu_index = 0;
            game.state = this._came_from;
            break;
        }
        break;
    }
  }
}
