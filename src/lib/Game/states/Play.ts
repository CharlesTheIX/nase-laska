import Game from "@/lib/Game";
import Rectangle from "@/lib/Rectangle";

export default class Play {
  private constructor() {}

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (): Play => new Play();

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {};

  public draw(game: Game): void {
    this.drawBackgroundLayer(game);
  }

  private drawBackgroundLayer = (game: Game): void => {
    const rect = Rectangle.init(0, 0, game.camera.rectangle.w, game.camera.rectangle.h);
    game.canvas.drawRectangle(rect, "lightgrey");
    game.map.draw(game);
    game.player.draw(game);
  };

  public update(game: Game, time_step: number): void {
    game.player.update(game, time_step);
  }
}
