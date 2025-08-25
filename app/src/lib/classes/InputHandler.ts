import { getInputKeys } from "@/lib/inputKeys";

export default class InputHandler {
  keys: Set<string>;
  keyUp: (event: KeyboardEvent) => void;
  keyDown: (event: KeyboardEvent) => void;

  private constructor() {
    this.keys = new Set();
    const input_keys = getInputKeys();
    this.keyDown = (event: KeyboardEvent): void => {
      if (input_keys.has(event.key)) this.keys.add(event.key);
    };
    this.keyUp = (event: KeyboardEvent): void => {
      if (input_keys.has(event.key)) this.keys.delete(event.key);
    };

    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("keydown", this.keyDown);
  }

  static init = (): InputHandler => new InputHandler();

  get last_key(): string {
    // const input_keys = getInputKeySets();
    const keys_array = Array.from(this.keys);
    // const comboActive = input_keys["run"].has(keys_array[this.keys.size - 1]) && this.keys.size > 1;
    // if (comboActive) return keys_array[this.keys.size - 2];
    return keys_array[this.keys.size - 1];
  }

  public reset = (): void => {
    this.keys = new Set();
    window.removeEventListener("keydown", this.keyDown);
    window.addEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
    window.addEventListener("keyup", this.keyUp);
  };
}
