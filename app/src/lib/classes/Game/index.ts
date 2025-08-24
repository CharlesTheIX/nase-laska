import { fps } from "@/lib/globals";
import Map from "@/lib/classes/Map";
import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import Player from "@/lib/classes/Player";
import Storage from "@/lib/classes/Storage";
import Resources from "@/lib/classes/Resources";
import StartScreen from "@/lib/classes/StartScreen";
import InputHandler from "@/lib/classes/InputHandler";
import { getInputKeySets } from "@/lib/inputKeys";

export default class Game {
  raf_id: any;
  camera: Camera;
  canvas: Canvas;
  map: Map | null;
  running: boolean;
  state: GameState;
  time_step: number;
  resources: Resources;
  player: Player | null;
  last_frame_time: number;
  accumulated_time: number;
  input_handler: InputHandler;
  start_screen: StartScreen | null;

  private constructor(g: IGame) {
    this.map = null;
    this.player = null;
    this.raf_id = null;
    this.state = "start";
    this.running = false;
    this.time_step = fps;
    this.canvas = g.canvas;
    this.start_screen = null;
    this.last_frame_time = 0;
    this.accumulated_time = 0;
    this.camera = Camera.init();
    this.resources = g.resources;
    this.input_handler = g.input_handler;
  }

  static init = (g: IGame): Game => new Game(g);

  public continueGame = (): void => {
    const save_data = this.resources.storage.data.save_data;
    const default_data = Storage.defaultStorageData.save_data;
    const map_name = save_data?.map_name ?? default_data.map_name;
    this.loadMap(map_name, "playing");
    if (!this.map) return;

    const sprite_name = save_data?.sprite_name ?? default_data.sprite_name;
    const position = save_data?.position ?? this.map.getSpawnPoint("initial");
    this.player = Player.init({
      camera: this.camera,
      sprite_name,
      position
    });
    this.start_screen = null;
  };

  public loadMap = (name: string, state: GameState): void => {
    this.state = "loading";
    this.resources.drawLoadingScreen();
    const image = new Image();
    image.src = `./assets/maps/${name}.png`;
    this.resources.images["map"] = { image, loaded: false };
    image.onload = () => {
      (this.resources.images["map"] as ImageResource).loaded = true;
    };

    this.map = Map.init({ background_image: image, map_name: name });
    const loading_interval = setInterval(() => {
      this.resources.count = 0;
      if (!this.resources.images["map"]) this.resources.count++;
      else if (this.resources.images["map"].loaded) this.resources.count++;
      this.resources.progress_element.style.width = `${(100 * this.resources.count) / 1}%`;
      if (1 < this.resources.count) return;
      clearInterval(loading_interval);
      this.resources.clearLoadingScreen();
      this.state = state;
    }, 100);
  };

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

  public save = (): void => this.resources.storage.saveTempData();

  public start = (): void => {
    if (this.running) return;
    this.running = true;
    this.raf_id = requestAnimationFrame(this.mainLoop);
  };

  public startNewGame = (): void => {
    const save_data = Storage.defaultStorageData.save_data;
    this.loadMap(save_data.map_name, "playing");
    if (!this.map) return;
    const position = this.map.getSpawnPoint("initial");
    this.player = Player.init({
      position,
      camera: this.camera,
      sprite_name: save_data.sprite_name
    });
    this.resources.storage.updateSaveData({ ...save_data, position: position.value });
    this.resources.storage.saveTempData();
    this.start_screen = null;
  };

  public stop = (): void => {
    if (this.raf_id) cancelAnimationFrame(this.raf_id);
    this.running = false;
  };

  private draw = () => {
    switch (this.state) {
      case "start":
        if (!this.start_screen) return;
        this.start_screen.draw(this.canvas);
        break;
      case "playing":
        if (!this.map || !this.player) return;
        const spritesheet = (this.resources.images["spritesheet"] as ImageResource).image;
        this.map.drawBackground({ canvas: this.canvas, camera: this.camera });

        this.canvas.context.save();
        this.canvas.context.translate(this.map.size.w / 2, this.map.size.h / 2);
        this.canvas.context.scale(this.camera.scale, this.camera.scale);
        this.canvas.context.translate(-this.camera.position.x, -this.camera.position.y);
        if (this.map.showWeather) this.map.drawLayer("weather_bottom", this.canvas, spritesheet, this.camera);
        this.map.drawLayer("collision", this.canvas, spritesheet, this.camera);

        this.player.character.drawLayer({
          spritesheet,
          layer: "lower",
          canvas: this.canvas,
          camera: this.camera,
          m_size: this.map.size.value
        });
        this.player.character.drawLayer({
          spritesheet,
          layer: "upper",
          canvas: this.canvas,
          camera: this.camera,
          m_size: this.map.size.value
        });
        this.player.character.drawLayer({
          spritesheet,
          layer: "emotion",
          canvas: this.canvas,
          camera: this.camera,
          m_size: this.map.size.value
        });

        this.map.drawLayer("canopy", this.canvas, spritesheet, this.camera);
        if (this.map.showWeather) this.map.drawLayer("weather_top", this.canvas, spritesheet, this.camera);

        this.canvas.context.restore();
        break;
    }
  };

  private update = (time_step: number): void => {
    const key_sets: KeySetMap = getInputKeySets();
    const last_key: string = this.input_handler.last_key;
    if (key_sets.dev.has(last_key)) {
      const update = { time_played: 1000 };
      this.resources.storage.updateSaveData(update);
      return this.save();
    }

    switch (this.state) {
      case "start":
        if (!this.start_screen) {
          const has_prev_data = !!this.resources.storage.data.save_data?.time_played;
          this.start_screen = StartScreen.init(has_prev_data);
        }
        this.start_screen.update(this, time_step);
        break;
      case "playing":
        if (!this.map || !this.player) return;
        this.player.update({ time_step, input_handler: this.input_handler, map: this.map });
        this.camera.update(this.player.character.position);
        break;
    }
  };
}
