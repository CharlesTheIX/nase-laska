import Timer from "@/lib/classes/Timer";
import { tile_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";
import { getCameraKeys } from "@/lib/inputKeys";
import InputHandler from "@/lib/classes/InputHandler";

export default class Camera {
  scale: number;
  position: Vector2;
  camera_lag: number;
  input_timer: Timer;
  dest_position: Vector2;
  focus: "fixed" | "free";

  private constructor() {
    this.scale = 3;
    this.camera_lag = 5; // lower value equals more lag, higher value equals less
    this.focus = "fixed";
    this.position = Vector2.zero();
    this.dest_position = Vector2.zero();
    this.input_timer = Timer.init("count_down", 300);
  }

  public static init = (): Camera => new Camera();
  private static readonly CAMERA_KEYS = getCameraKeys();

  public update = (v: Vector2, input_handler: InputHandler, time_step: number): void => {
    this.input_timer.update(time_step);
    if (this.input_timer.complete) {
      for (const key of input_handler.keys) {
        if (Camera.CAMERA_KEYS.has(key)) {
          if (input_handler.keys.has("-")) this.scale -= 1;
          else if (input_handler.keys.has("=")) this.scale += 1;
          this.scale = Math.max(1, Math.min(10, this.scale));
          this.input_timer.start();
          break;
        }
      }
    }

    switch (this.focus) {
      case "fixed":
        this.dest_position = v.duplicate();
        this.dest_position.x += tile_size / 2; // center camera x on position tile
        this.dest_position.y += tile_size / 2; // center camera y on position tile
        break;
      case "free":
        break;
    }

    const t = 1 - Math.exp(-this.camera_lag * (time_step / 1000));
    this.position = Vector2.lerp(this.position, this.dest_position, t);
  };
}
