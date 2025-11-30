export default class InputHandler {
  private _keys: Set<string>;

  private constructor() {
    this._keys = new Set();
    const input_keys = InputHandler.getInputKeys();
    window.addEventListener("keyup", (event: KeyboardEvent): void => {
      if (input_keys.has(event.key)) this._keys.delete(event.key);
    });
    window.addEventListener("keydown", (event: KeyboardEvent): void => {
      if (input_keys.has(event.key)) this._keys.add(event.key);
    });
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static getInputKeys = (sets?: string[]): Set<string> => {
    const keys = new Set<string>();
    if (!sets) {
      Object.values(InputHandler.input_keys).forEach((keySet) => {
        keySet.forEach((key) => keys.add(key));
      });
      return keys;
    }

    sets?.forEach((type) => {
      switch (type) {
        case "dev":
          this.input_keys.dev.forEach((key) => keys.add(key));
          break;

        case "up":
          this.input_keys.up.forEach((key) => keys.add(key));
          break;

        case "down":
          this.input_keys.down.forEach((key) => keys.add(key));
          break;

        case "left":
          this.input_keys.left.forEach((key) => keys.add(key));
          break;

        case "right":
          this.input_keys.right.forEach((key) => keys.add(key));
          break;

        case "action":
          this.input_keys.action.forEach((key) => keys.add(key));
          break;
      }
    });
    return keys;
  };

  public static init = (): InputHandler => new InputHandler();

  private static input_keys: { [key: string]: Set<string> } = {
    dev: new Set<string>().add("z"),
    action: new Set<string>().add("Space").add(" ").add("Enter"),
    up: new Set<string>().add("ArrowUp").add("KeyW").add("w").add("W"),
    down: new Set<string>().add("ArrowDown").add("KeyS").add("s").add("S"),
    left: new Set<string>().add("ArrowLeft").add("KeyA").add("a").add("A"),
    right: new Set<string>().add("ArrowRight").add("KeyD").add("d").add("D"),
  };

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get keys(): Set<string> {
    return this._keys;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public areKeysPressed = (keys: string[], condition: "all" | "any" = "any"): boolean => {
    switch (condition) {
      case "all":
        return keys.every((key) => this.keys.has(key));
      case "any":
        return keys.some((key) => this.keys.has(key));
    }
  };

  public clearKeys = (): void => {
    this.keys.clear();
  };

  public deinit = (): void => {
    this.keys.clear();
  };

  public lastKeyPressed = (): string | null => {
    const keys_array = Array.from(this.keys);
    return keys_array[keys_array.length - 1] || null;
  };
}
