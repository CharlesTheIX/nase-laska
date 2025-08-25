export default class Timer {
  type: string;
  count: number;
  value: number;
  timeout: number;
  running: boolean;
  complete: boolean;

  constructor(type: string, timeout: number, value?: number) {
    this.count = 0;
    this.type = type;
    this.running = false;
    this.complete = true;
    this.timeout = timeout;
    this.value = value ?? 0;

    switch (type) {
      case "count_down":
        this.count = timeout;
        break;
      case "game":
        break;
    }
  }

  static init = (type: string, timeout: number, value?: number): Timer => new Timer(type, timeout);

  public pause = (): void => {
    this.running = false;
  };

  public start = (): void => {
    this.running = true;
    this.complete = false;
    switch (this.type) {
      case "count_down":
        this.count = this.timeout;
        break;
      case "game":
      default:
        this.count = 0;
    }
  };

  public stop = (): void => {
    this.count = 0;
    this.running = false;
    this.complete = true;
  };

  public update = (time_step: number) => {
    if (!this.running || this.complete) return;
    switch (this.type) {
      case "count_down":
        this.count -= time_step;
        if (this.count > 0) return;
        this.stop();
        break;
      case "game":
      default:
        this.count += time_step;
        if (this.count < this.timeout) return;
        this.count = 0;
        this.value++;
    }
  };
}
