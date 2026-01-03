import Play from "./states/Play";
import Canvas from "@/lib/Canvas";
import Start from "./states/Start";
import Storage from "@/lib/Storage";
import { GameState } from "@/types";
import Message from "./states/Message";
import Resources from "@/lib/Resources";
import Settings from "./states/Settings";
import Controls from "./states/Controls";
import ErrorHandler from "@/lib/ErrorHandler";
import InputHandler from "@/lib/InputHandler";

export default class Game {
  private _canvas: Canvas;
  private _storage: Storage;
  private _play_screen: Play;
  private _raf_id: any = null;
  private _start_screen: Start;
  private _resources: Resources;
  private _message_screen: Message;
  private _running: boolean = false;
  private _settings_screen: Settings;
  private _controls_screen: Controls;
  private _state: GameState = "start";
  private _last_frame_time: number = 0;
  private _input_handler: InputHandler;
  private _accumulated_time: number = 0;
  private _time_step: number = 1000 / 60;
  private _last_state: GameState = "start";

  private constructor(canvas: Canvas, resources: Resources, storage: Storage) {
    this._canvas = canvas;
    this._storage = storage;
    this._resources = resources;
    this._play_screen = Play.init();
    this._input_handler = InputHandler.init();
    this._start_screen = Start.init(this._storage);
    this._controls_screen = Controls.init(this._storage);
    this._settings_screen = Settings.init(this._storage);
    this._message_screen = Message.init(null, this._storage, this._canvas.rect);
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (canvas: Canvas, resources: Resources, storage: Storage): Game => new Game(canvas, resources, storage);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  public get canvas(): Canvas {
    return this._canvas;
  }

  public get input_handler(): InputHandler {
    return this._input_handler;
  }

  public get last_state(): GameState {
    return this._last_state;
  }

  public get message_screen(): Message {
    return this._message_screen;
  }

  public get resources(): Resources {
    return this._resources;
  }

  public get settings_screen(): Settings {
    return this._settings_screen;
  }

  public get state(): GameState {
    return this._state;
  }

  public get storage(): any {
    return this._storage;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  public set state(new_state: GameState) {
    switch (new_state) {
      case "controls":
      case "message":
      case "new_game":
      case "play":
      case "start":
      case "settings":
        break;
    }

    this._last_state = this._state;
    this._state = new_state;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    this.stop();
    this.canvas.deinit();
    this.resources.deinit();
    this._play_screen.deinit();
    this.input_handler.deinit();
    this._storage = null as any;
    this._start_screen.deinit();
    this._message_screen.deinit();
    this._settings_screen.deinit();
    this._controls_screen.deinit();
  };

  private draw = (): void => {
    try {
      if (this.state === "message") {
        this.drawState(this.last_state);
        this._message_screen.draw(this);
      } else this.drawState(this.state);
      // this.canvas.drawGrid();
    } catch (err: any) {
      ErrorHandler.fatal(err.message);
      throw new Error(err.message);
    }
  };

  private drawState = (state: GameState): void => {
    switch (state) {
      case "controls":
        this._controls_screen.draw(this);
        break;

      case "start":
        this._start_screen.draw(this);
        break;

      case "new_game":
      // this._new_game_screen.draw(this);
      // break;

      case "play":
        this._play_screen.draw(this);
        break;

      case "settings":
        this._settings_screen.draw(this);
        break;
    }
  };

  public mainLoop = (timestamp: number): void => {
    if (!this._running) return;
    var delta_time = timestamp - this._last_frame_time;
    this._last_frame_time = timestamp;
    this._accumulated_time += delta_time;
    this.canvas.clear();

    while (this._accumulated_time >= this._time_step) {
      this.update(this._time_step);
      this._accumulated_time -= this._time_step;
    }

    this.draw();
    this._raf_id = requestAnimationFrame(this.mainLoop);
  };

  public start = (): void => {
    if (this._running) return;
    this._running = true;
    this._raf_id = requestAnimationFrame(this.mainLoop);
  };

  public stop = (): void => {
    if (this._raf_id) cancelAnimationFrame(this._raf_id);
    this._running = false;
  };

  private update = (time_step: number): void => {
    try {
      if (!this._running) return;
      this.updateState(this.state, time_step);
    } catch (err: any) {
      ErrorHandler.fatal(err.message);
      throw new Error(err.message);
    }
  };

  private updateState = (state: GameState, time_step: number): void => {
    switch (state) {
      case "controls":
        this._controls_screen.update(this, time_step);
        break;

      case "start":
        this._start_screen.update(this, time_step);
        break;

      case "message":
        this._message_screen.update(this, time_step);
        break;

      case "new_game":
      // this._new_game_screen.update(this, time_step);
      // break;

      case "play":
        this._play_screen.update(this, time_step);
        break;

      case "settings":
        this._settings_screen.update(this, time_step);
        break;
    }
  };
}
