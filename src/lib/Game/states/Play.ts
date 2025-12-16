import Game from "@/lib/Game";
import Vector2 from "@/lib/Vector2";
import Rectangle from "@/lib/Rectangle";

export default class Play {
  private _resource_name: string = "play_screen";

  private constructor() {}

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (): Play => new Play();

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {};

  public draw(game: Game): void {
    this.drawBackgroundLayer(game);
    // game.player.draw();
  }

  private drawBackgroundLayer = (game: Game): void => {
    const rect = Rectangle.init(0, 0, game.canvas.rect.w, game.canvas.rect.h);
    const resource_img = game.resources.images[this._resource_name];
    const img_rect = rect.duplicate().scale(1.2).translate(Vector2.init(0, 150));
    if (!!resource_img && resource_img.loaded) game.canvas.drawImage(resource_img.image, img_rect, rect);
  };

  public update(game: Game, time_step: number): void {
    // Update game logic here
    // game.player.update(game, time_step);
  }
}
