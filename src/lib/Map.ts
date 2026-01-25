import Game from "@/lib/Game";
import Memory from "@/lib/Memory";
import Rectangle from "@/lib/Rectangle";

export default class Map {
  private _name: string;
  private _rect: Rectangle;

  private constructor(memory: Memory) {
    this._name = memory.map_data.name;
    this._rect = Rectangle.fromObject(memory.map_data.rect);
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (memory: Memory): Map => new Map(memory);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get name(): string {
    return this._name;
  }

  get rect(): Rectangle {
    return this._rect;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set name(name: string) {
    this._name = name;
  }

  set rect(rect: Rectangle) {
    this._rect = rect;
  }

  // Methods -----------------------------------------------------------------------------------------------------------------------------------------
  public draw = (game: Game): void => {
    game.canvas.drawRectangle(this._rect, "blue");
  };

  public collisionRectangle = (rect: Rectangle): boolean => {
    const t = this._rect.containsRectangle(rect, "all");
    return t;
  };

  public load = async (game: Game, name: string): Promise<void> => {
    try {
      game.resources.drawLoadingScreen();
      const data = await game.resources.loadJson(`${name}`, `assets/data/${name}.json`);
      this._name = name;
      this._rect = Rectangle.fromObject(data.rect);
      game.resources.clearLoadingScreen();
    } catch (err: any) {
      game.state = "start";
      game.resources.clearLoadingScreen();
      console.error(`Error loading map ${name}: ${err.message}`);
    }
  };
}
