import { fps } from "@/lib/globals";
import Map from "@/lib/classes/Map";
import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import Player from "@/lib/classes/Player";
import Resources from "@/lib/classes/Resources";
import InputHandler from "@/lib/classes/InputHandler";

export interface IGame {
  camera: Camera;
  canvas: Canvas;
  resources: Resources;
  input_handler: InputHandler;
}

export default class Game {
  map: Map;
  raf_id: any;
  camera: Camera;
  canvas: Canvas;
  player: Player;
  running: boolean;
  state: GameState;
  time_step: number;
  resources: Resources;
  last_frame_time: number;
  accumulated_time: number;
  input_handler: InputHandler;

  private constructor(g: IGame) {
    this.raf_id = null;
    this.running = false;
    this.time_step = fps;
    this.canvas = g.canvas;
    this.camera = g.camera;
    this.state = "playing";
    this.last_frame_time = 0;
    this.accumulated_time = 0;
    this.resources = g.resources;
    this.input_handler = g.input_handler;
    this.player = Player.init({ sprite_name: "pavla", camera: this.camera });
    this.map = Map.init({ background_image: g.resources.images["map"].image, map_name: "test_1" });
  }

  static init = (g: IGame): Game => new Game(g);

  public mainLoop = (timestamp: number): void => {
    if (!this.running) return;
    var delta_time: number = timestamp - this.last_frame_time;
    this.last_frame_time = timestamp;
    this.accumulated_time += delta_time;
    this.canvas.clear(this.canvas.rectangle);
    while (this.accumulated_time >= this.time_step) {
      this.update(this.time_step);
      this.accumulated_time -= this.time_step;
    }
    this.draw();
    this.raf_id = requestAnimationFrame(this.mainLoop);
  };

  public start = (): void => {
    if (!this.running) {
      this.running = true;
      this.raf_id = requestAnimationFrame(this.mainLoop);
    }
  };

  public stop = (): void => {
    if (this.raf_id) cancelAnimationFrame(this.raf_id);
    this.running = false;
  };

  private draw = () => {
    switch (this.state) {
      case "playing":
        this.map.drawBackground({ canvas: this.canvas, camera: this.camera });
        this.map.drawCollisionLayers(this.canvas);

        var image = this.resources.images["spritesheet"].image;
        this.player.character.drawLayer({
          image,
          layer: "lower",
          canvas: this.canvas
        });

        this.player.character.drawLayer({
          image,
          layer: "upper",
          canvas: this.canvas
        });

        break;
    }
  };

  private update = (time_step: number): void => {
    switch (this.state) {
      case "playing":
        this.player.update({ time_step, input_handler: this.input_handler, map: this.map });
        break;
    }
  };
}
