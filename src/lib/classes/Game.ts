import { fps, tile_size } from "@/lib/globals";
import Map from "@/lib/classes/Map";
import Timer from "@/lib/classes/Timer";
import Animal from "@/lib/classes/Animal";
import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import Player from "@/lib/classes/Player";
import Storage from "@/lib/classes/Storage";
import Resources from "@/lib/classes/Resources";
import { getInputKeySets } from "@/lib/inputKeys";
import InputHandler from "@/lib/classes/InputHandler";
import getDayCycleData from "@/lib/helpers/getDayCycleData";
import StartScreen from "@/lib/classes/Screens/StartScreen";
import MessageScreen from "@/lib/classes/Screens/MessageScreen";
import SettingsScreen from "@/lib/classes/Screens/SettingsScreen";
import InventoryScreen from "@/lib/classes/Screens/InventoryScreen";
import Vector2 from "./Vector2";

export default class Game {
  raf_id: any;
  camera: Camera;
  canvas: Canvas;
  map: Map | null;
  running: boolean;
  state: GameState;
  time_step: number;
  play_timer: Timer;
  input_timer: Timer;
  resources: Resources;
  player: Player | null;
  last_frame_time: number;
  accumulated_time: number;
  input_handler: InputHandler;
  message_screen: MessageScreen;
  settings_screen: SettingsScreen;
  start_screen: StartScreen | null;
  inventory_screen: InventoryScreen;

  private constructor(canvas: Canvas, resources: Resources, input_handler: InputHandler) {
    this.map = null;
    this.player = null;
    this.raf_id = null;
    this.state = "start";
    this.running = false;
    this.time_step = fps;
    this.canvas = canvas;
    this.start_screen = null;
    this.last_frame_time = 0;
    this.accumulated_time = 0;
    this.resources = resources;
    this.camera = Camera.init();
    this.input_handler = input_handler;
    this.message_screen = MessageScreen.init();
    this.play_timer = Timer.init("game", 1000);
    this.settings_screen = SettingsScreen.init();
    this.inventory_screen = InventoryScreen.init();
    this.input_timer = Timer.init("count_down", 300);
  }

  static init = (canvas: Canvas, resources: Resources, input_handler: InputHandler): Game => {
    return new Game(canvas, resources, input_handler);
  };

  public continueGame = (): void => {
    const save_data = this.resources.storage.player_save_state;
    const map_name = save_data.map_name ?? "";
    this.loadMap(map_name);
    if (!this.map) return;
    const inventory = save_data?.inventory ?? null;
    const sprite_name = save_data.sprite_name ?? "";
    this.play_timer.value = save_data?.time_played ?? 0;
    const position = save_data?.position ?? this.map.getSpawnPoint("initial");
    this.map.day_cycle_opacity = getDayCycleData(this.play_timer.value).opacity;
    this.camera.position = Vector2.init(position.x + tile_size / 2, position.y + tile_size / 2);
    this.player = Player.init({
      position,
      inventory,
      sprite_name,
      camera: this.camera
    });
    this.state = "playing";
    this.play_timer.start();
    this.start_screen = null;
    this.resources.clearLoadingScreen();
  };

  private draw = () => {
    switch (this.state) {
      case "start":
        if (!this.start_screen) break;
        this.start_screen.draw(this.canvas);
        break;

      case "settings":
        this.settings_screen.draw(this.canvas);
        break;

      case "inventory":
      case "message":
      case "playing":
        if (!this.map || !this.player) break;
        const spritesheet = (this.resources.images["spritesheet"] as ImageResource).image;
        const animal_sheet = (this.resources.images["animal_sheet"] as ImageResource).image;
        const emotions_sheet = (this.resources.images["emotion_sheet"] as ImageResource).image;
        const character_sheet = (this.resources.images["character_sheet"] as ImageResource).image;
        const animation_items_sheet = (this.resources.images["animation_items_sheet"] as ImageResource).image;
        this.map.drawBackground(this.canvas, this.camera);

        this.canvas.scale(this.map.size, this.camera);
        if (this.map.showWeather) this.map.drawLayer("weather_bottom", this.canvas, spritesheet, this.camera);
        this.map.drawLayer("collision", this.canvas, spritesheet, this.camera);
        this.map.drawStaticItems(this.canvas, spritesheet, this.camera);
        this.map.drawRespawnItems(this.canvas, spritesheet, this.camera);

        this.player.follower?.drawLayer({
          layer: "lower",
          canvas: this.canvas,
          camera: this.camera,
          spritesheet: animal_sheet,
          m_size: this.map?.size.value as IRectangle
        });
        this.player.character.drawLayer({
          layer: "lower",
          canvas: this.canvas,
          camera: this.camera,
          m_size: this.map.size.value as IRectangle,
          spritesheet: character_sheet
        });

        this.map.animation_items.forEach((i) => {
          i.draw(this.canvas, this.camera, this.map?.size.value as IRectangle, animation_items_sheet);
        });

        this.player.follower?.drawLayer({
          layer: "upper",
          canvas: this.canvas,
          camera: this.camera,
          spritesheet: animal_sheet,
          m_size: this.map?.size.value as IRectangle
        });
        this.player.character.drawLayer({
          layer: "upper",
          canvas: this.canvas,
          camera: this.camera,
          m_size: this.map.size.value as IRectangle,
          spritesheet: character_sheet
        });
        this.player.character.emotion.draw({
          canvas: this.canvas,
          camera: this.camera,
          spritesheet: emotions_sheet,
          position: this.player.character.position,
          m_size: this.map.size.value as IRectangle
        });

        this.map.drawLayer("canopy", this.canvas, spritesheet, this.camera);
        if (this.map.showWeather) this.map.drawLayer("weather_top", this.canvas, spritesheet, this.camera);
        this.canvas.restore_scale();

        this.map.drawDayCycle(this.canvas, this.camera, this.play_timer.value);
        if (this.state === "message") this.message_screen.draw(this.canvas);
        else if (this.state === "inventory") this.inventory_screen.draw(this);
        break;
    }
  };

  public loadMap = (name: string): void => {
    this.state = "loading";
    this.resources.drawLoadingScreen();
    const map_image = new Image();
    const day_cycle_image = new Image();
    map_image.src = `./assets/maps/${name}.png`;
    day_cycle_image.src = `./assets/maps/${name}_day_cycle.png`;
    this.resources.images["map"] = { image: map_image, loaded: false };
    this.resources.images["map_day_cycle"] = { image: day_cycle_image, loaded: false };
    map_image.onload = () => {
      (this.resources.images["map"] as ImageResource).loaded = true;
    };
    day_cycle_image.onload = () => {
      (this.resources.images["map_day_cycle"] as ImageResource).loaded = true;
    };

    this.map = Map.init({
      map_name: name,
      background_image: map_image,
      overlay_images: { day_cycle: day_cycle_image }
    });

    const loading_interval = setInterval(() => {
      this.resources.count = 0;
      if (!this.resources.images["map"]) this.resources.count++;
      else if (this.resources.images["map"].loaded) this.resources.count++;
      if (!this.resources.images["map_day_cycle"]) this.resources.count++;
      else if (this.resources.images["map_day_cycle"].loaded) this.resources.count++;
      this.resources.progress_element.style.width = `${(100 * this.resources.count) / 2}%`;
      if (2 < this.resources.count) return;
      clearInterval(loading_interval);
    }, 100);
  };

  public mainLoop = (timestamp: number): void => {
    if (!this.running) return;
    var delta_time: number = timestamp - this.last_frame_time;
    this.last_frame_time = timestamp;
    this.accumulated_time += delta_time;
    this.canvas.clear();
    while (this.accumulated_time >= this.time_step) {
      this.update(this.time_step);
      this.accumulated_time -= this.time_step;
    }
    this.draw();
    this.raf_id = requestAnimationFrame(this.mainLoop);
  };

  public save = (): void => {
    const inventory = this.player?.inventory.items.map((i: InventoryItem) => ({ name: i.name, count: i.count }));
    const update = {
      inventory,
      map_name: this.map?.name,
      sprite_name: this.player?.name,
      time_played: this.play_timer.value,
      position: this.player?.character.position.value
    };
    this.resources.storage.updatePlayerTempData(update);
    this.resources.storage.savePlayerTempData();
  };

  public start = (): void => {
    if (this.running) return;
    this.running = true;
    this.raf_id = requestAnimationFrame(this.mainLoop);
  };

  public startNewGame = (): void => {
    const save_data = Storage.defaultStorageData;
    this.loadMap(save_data.map_name);
    if (!this.map) return;
    const position = this.map.getSpawnPoint("initial");
    this.resources.storage.updatePlayerTempData({ position });
    this.camera.position = Vector2.init(position.x + tile_size / 2, position.y + tile_size / 2);
    this.player = Player.init({
      position,
      inventory: null,
      camera: this.camera,
      sprite_name: save_data.sprite_name,
      follower: Animal.init({ is_follower: true })
    });
    this.save();
    this.state = "playing";
    this.play_timer.start();
    this.start_screen = null;
    this.resources.clearLoadingScreen();
  };

  public stop = (): void => {
    if (this.raf_id) cancelAnimationFrame(this.raf_id);
    this.running = false;
  };

  private update = (time_step: number): void => {
    this.input_timer.update(time_step);
    if (!this.input_timer.complete) return;

    const key_sets: KeySetMap = getInputKeySets();
    const last_key: string = this.input_handler.last_key;
    if (key_sets.dev.has(last_key)) {
      const update = { time_played: 1000, position: { x: 10, y: 10 } };
      this.resources.storage.updatePlayerTempData(update);
      return this.save();
    }

    switch (this.state) {
      case "start":
        if (!this.start_screen) {
          const has_save_data = !!this.resources.storage.player_save_state.time_played;
          this.start_screen = StartScreen.init(has_save_data);
        }
        this.start_screen.update(this);
        break;

      case "settings":
        if (key_sets.settings.has(last_key)) {
          if (!this.player) this.state = "start";
          else this.state = "playing";
          this.input_timer.start();
          break;
        }
        this.settings_screen?.update();
        break;

      case "inventory":
        this.play_timer.update(time_step);
        if (!this.player?.inventory || key_sets.inventory.has(last_key)) {
          this.state = "playing";
          this.input_timer.start();
          break;
        }
        this.inventory_screen.update(this);
        break;

      case "message":
      case "playing":
        this.play_timer.update(time_step);
        if (!this.map || !this.player) break;

        this.map.animation_items.forEach((i) => {
          i.update(time_step);
        });

        if (this.state === "message") {
          this.message_screen.update(this);
          break;
        }

        if (key_sets.inventory.has(last_key)) {
          this.state = "inventory";
          this.input_timer.start();
          break;
        }

        if (key_sets.settings.has(last_key)) {
          this.state = "settings";
          this.input_timer.start();
          break;
        }

        this.player.update(time_step, this);
        this.player.follower?.update(this.player as Player, time_step);
        this.camera.update(this.player.character.position, this.input_handler, time_step);
        break;
    }
  };
}
