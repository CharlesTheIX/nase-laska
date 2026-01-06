type TimerType = "countdown" | "continuous";

export default class Timer {
  private _state: string;
  private _limit: number = 0;
  private _elapsed_time: number;

  constructor(type?: TimerType, limit?: number) {
    this._elapsed_time = 0;
    this._state = "finished";
    switch (type) {
      case "countdown":
        this._limit = limit || 0;
        break;
    }
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (type?: TimerType, limit?: number): Timer => new Timer(type, limit);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get elapsed_time(): number {
    return this._elapsed_time;
  }

  get state(): string {
    return this._state;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set elapsed_time(t: number) {
    this._elapsed_time = t;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    this._limit = 0;
    this._elapsed_time = 0;
    this._state = "stopped";
  };

  public reset = (limit?: number): Timer => {
    this._elapsed_time = 0;
    this._state = "running";
    if (limit !== undefined) this._limit = limit;
    return this;
  };

  public start = (): Timer => {
    this._state = "running";
    return this;
  };

  public stop = (): Timer => {
    this._state = "stopped";
    return this;
  };

  public update = (time_Step: number): void => {
    switch (this._state) {
      case "running":
        this._elapsed_time = this._elapsed_time + time_Step;
        if (this._limit > 0 && this.elapsed_time >= this._limit) this._state = "finished";
        break;
    }
  };
}
