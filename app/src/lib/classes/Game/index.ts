import { fps } from "@/lib/globals";
import Map from "@/lib/classes/Map";
import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import Player from "@/lib/classes/Player";
import Resources from "@/lib/classes/Resources";
import InputHandler from "@/lib/classes/InputHandler";

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
    this.map = Map.init({ background_image: g.resources.images["map"].image, map_name: "test_1", camera: this.camera });
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
    this.canvas.drawGrid(this.camera);
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
        const spritesheet = this.resources.images["spritesheet"].image;
        this.map.drawBackground({ canvas: this.canvas, camera: this.camera });
        this.canvas.context.save();
        this.canvas.context.translate(this.map.size.w / 2, this.map.size.h / 2);
        this.canvas.context.scale(this.camera.scale, this.camera.scale);
        this.canvas.context.translate(-this.camera.position.x, -this.camera.position.y);
        if (this.map.showWeather) this.map.drawLayer("weather_bottom", this.canvas, spritesheet);
        this.map.drawLayer("collision", this.canvas, spritesheet);
        this.player.character.drawLayer("lower", this.canvas, spritesheet);
        this.player.character.drawLayer("upper", this.canvas, spritesheet);
        this.map.drawLayer("canopy", this.canvas, spritesheet);
        if (this.map.showWeather) this.map.drawLayer("weather_top", this.canvas, spritesheet);
        this.canvas.context.restore();
        break;
    }
  };

  private update = (time_step: number): void => {
    switch (this.state) {
      case "playing":
        // this.map.update(this.input_handler);
        this.player.update({ time_step, input_handler: this.input_handler, map: this.map });
        this.camera.update(this.player.character.position);
        break;
    }
  };
}
