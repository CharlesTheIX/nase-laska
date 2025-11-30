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
  private _resource_name: string = "controls_screen";

  constructor(storage: Storage, timer: Timer) {
    this._storage = storage;
    this._input_timer = timer;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage: Storage, timer: Timer): Controls => new Controls(storage, timer);

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
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
    var y_pos = 3 * 16;
    const language = this._storage.settings_data.language;
    Object.keys(data[language]).forEach((key: string, index: number) => {
      game.canvas.drawText(data[language][key], Vector2.init(3 * 16, y_pos + index * 32), Color.grey);
    });
    y_pos = game.canvas.rect.h - 3 * 16;
    game.canvas.drawText(language === "en" ? "Back" : "Zpět", Vector2.init(3 * 16, y_pos), Color.white);
  };

  public update(game: Game, time_step: number): void {
    this._input_timer.update();
    if (this._input_timer.state === "running") return;
    const last_key = game.input_handler.lastKeyPressed();
    switch (last_key) {
      case " ":
      case "Space":
      case "Enter":
        this._input_timer.reset();
        game.resources.playAudio("menu_move");
        game.state = "settings";
    }
  }
}
