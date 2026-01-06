import Map from "@/lib/Map";
import Timer from "@/lib/Timer";
import Camera from "@/lib/Camera";
import Canvas from "@/lib/Canvas";
import Memory from "@/lib/Memory";
import Player from "@/lib//Player";
import { GameState } from "@/types";
import Resources from "@/lib/Resources";
import { input_timeout } from "@/globals";
import Play from "@/lib/Game/states/Play";
import Start from "@/lib/Game/states/Start";
import ErrorHandler from "@/lib/ErrorHandler";
import InputHandler from "@/lib/InputHandler";
import Message from "@/lib/Game/states/Message";
import Controls from "@/lib/Game/states/Controls";
import Settings from "@/lib/Game/states/Settings";

export default class Game {
  private _map: Map;
  private _player: Player;
  private _canvas: Canvas;
  private _memory: Memory;
  private _play_screen: Play;
  private _raf_id: any = null;
  private _start_screen: Start;
  private _resources: Resources;
  private _camera = Camera.init();
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
  private _game_timer: Timer = new Timer("continuous");
  private _menu_input_timer: Timer = new Timer("countdown", input_timeout);

  private constructor(canvas: Canvas, resources: Resources, memory: Memory) {
    this._canvas = canvas;
    this._memory = memory;
    this._resources = resources;
    this._map = Map.init(memory);
    this._play_screen = Play.init();
    this._player = Player.init(memory);
    this._input_handler = InputHandler.init();
    this._start_screen = Start.init(this._memory);
    this._controls_screen = Controls.init(this._memory);
    this._settings_screen = Settings.init(this._memory);
    this._message_screen = Message.init(null, this._memory, this._canvas.rect);
    if (this._memory.save_data) this._game_timer.elapsed_time = this._memory.save_data.game_time;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (canvas: Canvas, resources: Resources, memory: Memory): Game => new Game(canvas, resources, memory);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  public get camera(): Camera {
    return this._camera;
  }

  public get canvas(): Canvas {
    return this._canvas;
  }

  public get input_handler(): InputHandler {
    return this._input_handler;
  }

  public get last_state(): GameState {
    return this._last_state;
  }

  public get map(): Map {
    return this._map;
  }

  public get menu_input_timer(): Timer {
    return this._menu_input_timer;
  }

  public get message_screen(): Message {
    return this._message_screen;
  }

  public get player(): Player {
    return this._player;
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

  public get memory(): any {
    return this._memory;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  public set state(new_state: GameState) {
    switch (new_state) {
      case "play":
        this._game_timer.start();
        break;

      case "controls":
      case "message":
      case "new_game":
      case "start":
      case "settings":
        this._game_timer.stop();
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
    this._memory = null as any;
    this.input_handler.deinit();
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
      case "play":
        this._play_screen.update(this, time_step);
        break;

      case "settings":
        this._settings_screen.update(this, time_step);
        break;
    }
  };
}
