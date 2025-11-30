export default class Timer {
  private _state: string;
  private _limit: number = 0;
  private _start_time: number;
  private _elapsed_time: number;

  constructor(type?: string, limit?: number) {
    this._elapsed_time = 0;
    this._state = "finished";
    this._start_time = Date.now();
    if (type === "countdown") this._limit = limit || 0;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (type?: string, limit?: number): Timer => new Timer(type, limit);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get elapsed_time(): number {
    this._elapsed_time = Date.now() - this._start_time;
    return this._elapsed_time;
  }

  get state(): string {
    return this._state;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public deinit = (): void => {
    this._limit = 0;
    this._start_time = 0;
    this._elapsed_time = 0;
    this._state = "stopped";
  };

  public reset = (limit?: number): Timer => {
    this._elapsed_time = 0;
    this._state = "running";
    this._start_time = Date.now();
    if (limit !== undefined) this._limit = limit;
    return this;
  };

  public start = (): Timer => {
    this._state = "running";
    this._start_time = Date.now() - this._elapsed_time;
    return this;
  };

  public stop = (): Timer => {
    this._state = "stopped";
    return this;
  };

  public update = (): void => {
    switch (this._state) {
      case "running":
        this._elapsed_time = Date.now() - this._start_time;
        if (this._limit <= 0) break;
        if (this.elapsed_time >= this._limit) this._state = "finished";
        break;
    }
  };
}
