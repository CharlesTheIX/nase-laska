import Game from "@/lib/classes/Game";
import Canvas from "@/lib/classes/Canvas";
import Vector2 from "@/lib/classes/Vector2";
import { getInputKeySets, getMovementKeys } from "@/lib/inputKeys";

export default class SettingsScreen {
  options: string[];
  position: Vector2;
  exit_to: GameState;
  active_option: number;

  private constructor() {
    this.active_option = 0;
    this.exit_to = "start";
    this.options = ["Back"];
    this.position = Vector2.init(100, 100);
  }

  static init = (): SettingsScreen => new SettingsScreen();

  public draw = (canvas: Canvas): void => {
    canvas.drawTextLines({
      position: { x: this.position.x - 16, y: this.position.y },
      lines: Array(this.options.length)
        .fill("")
        .map((_, key: number) => (key === this.active_option ? ">" : ""))
    });
    canvas.drawTextLines({ position: this.position.value, lines: this.options });
  };

  public update = (g: Game): void => {
    const key_sets: KeySetMap = getInputKeySets();
    const last_key: string = g.input_handler.last_key;
    if (key_sets.action.has(last_key) && this.active_option === this.options.findIndex((i) => i === "Back")) {
      g.state = this.exit_to;
      g.input_timer.start();
      return;
    }

    var next_value: number = this.active_option;
    const movement_key_pressed: boolean = [...g.input_handler.keys].some((key) => getMovementKeys().has(key));
    if (movement_key_pressed) g.input_timer.start();
    if (key_sets.left.has(last_key)) next_value -= 1;
    else if (key_sets.right.has(last_key)) next_value += 1;

    // Capped indexing
    if (next_value < 0) next_value = 0;
    else if (next_value >= this.options.length) next_value = this.options.length - 1;
    // Rolling indexing
    // if (next_value < 0) next_value = this.options.length - 1;
    // else if (next_value >= this.options.length) next_value = 0;

    this.active_option = next_value;
  };
}
