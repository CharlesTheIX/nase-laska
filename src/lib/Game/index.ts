import Canvas from "@/lib/Canvas";
import Start from "./states/Start";
import Storage from "@/lib/Storage";
import Resources from "@/lib/Resources";
import Settings from "./states/Settings";
import ErrorHandler from "@/lib/ErrorHandler";
import InputHandler from "@/lib/InputHandler";

export default class Game {
  private _raf_id: any;
  private _canvas: Canvas;
  private _running: boolean;
  private _storage: Storage;
  private _time_step: number;
  private _start_screen: Start;
  private _resources: Resources;
  private _last_frame_time: number;
  private _state: string = "start";
  private _accumulated_time: number;
  private _settings_screen: Settings;
  private _input_handler: InputHandler;

  private constructor(canvas: Canvas, resources: Resources) {
    this._raf_id = null;
    this._running = false;
    this._canvas = canvas;
    this._last_frame_time = 0;
    this._accumulated_time = 0;
    this._time_step = 1000 / 60;
    this._resources = resources;
    this._storage = Storage.init();
    this._input_handler = InputHandler.init();
    this._start_screen = Start.init(this._storage);
    this._settings_screen = Settings.init(this._storage);
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (canvas: Canvas, resources: Resources): Game => new Game(canvas, resources);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get accumulated_time(): number {
    return this._accumulated_time;
  }

  get canvas(): Canvas {
    return this._canvas;
  }

  get input_handler(): InputHandler {
    return this._input_handler;
  }

  get last_frame_time(): number {
    return this._last_frame_time;
  }

  get raf_id(): any {
    return this._raf_id;
  }

  get resources(): Resources {
    return this._resources;
  }

  get running(): boolean {
    return this._running;
  }

  get settings_screen(): Settings | null {
    return this._settings_screen;
  }

  get start_screen(): Start | null {
    return this._start_screen;
  }

  get state(): string {
    return this._state;
  }

  get storage(): any {
    return this._storage;
  }

  get time_step(): number {
    return this._time_step;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set state(new_state: string) {
    switch (new_state) {
      case "start":
        if (!this._start_screen) this._start_screen = Start.init(this._storage);
        break;

      case "settings":
        if (!this._settings_screen) this._settings_screen = Settings.init(this._storage);
        break;
    }

    this._state = new_state;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    this.stop();
    this.canvas.deinit();
    this.resources.deinit();
    this.input_handler.deinit();
  };

  private draw = (): void => {
    try {
      switch (this.state) {
        case "start":
          if (!this.start_screen) throw new Error("Start screen is not initialized.");
          this.start_screen.draw(this);
          break;

        case "settings":
          if (!this.settings_screen) throw new Error("Settings screen is not initialized.");
          this.settings_screen.draw(this);
          break;
      }
      this.canvas.drawGrid();
    } catch (err: any) {
      ErrorHandler.fatal(err.message);
      throw new Error(err.message);
    }
  };

  public mainLoop = (timestamp: number): void => {
    if (!this.running) return;
    var delta_time = timestamp - this.last_frame_time;
    this._last_frame_time = timestamp;
    this._accumulated_time += delta_time;
    this.canvas.clear();
    while (this.accumulated_time >= this.time_step) {
      this.update(this.time_step);
      this._accumulated_time -= this.time_step;
    }
    this.draw();
    this._raf_id = requestAnimationFrame(this.mainLoop);
  };

  public start = (): void => {
    if (this.running) return;
    this._running = true;
    this._raf_id = requestAnimationFrame(this.mainLoop);
  };

  public stop = (): void => {
    if (this.raf_id) cancelAnimationFrame(this.raf_id);
    this._running = false;
  };

  private update = (time_step: number): void => {
    try {
      switch (this.state) {
        case "start":
          if (!this.start_screen) throw new Error("Start screen is not initialized.");
          this.start_screen.update(this, time_step);
          break;

        case "settings":
          if (!this.settings_screen) throw new Error("Settings screen is not initialized.");
          this.settings_screen.update(this, time_step);
          break;
      }
    } catch (err: any) {
      ErrorHandler.fatal(err.message);
      throw new Error(err.message);
    }
  };
}
