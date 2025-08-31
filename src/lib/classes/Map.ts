import Animal from "@/lib/classes/Animal";
import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import { canvas_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";
import Character from "@/lib/classes/Character";
import Rectangle from "@/lib/classes/Rectangle";
import getMapData from "@/lib/helpers/getMapData";
import StaticItem from "@/lib/classes/Items/StaticItem";
import RespawnItem from "@/lib/classes/Items/RespawnItem";
import getDayCycleData from "@/lib/helpers/getDayCycleData";
import getMapStaticItems from "@/lib/helpers/getMapStaticItems";
import getMapRespawnItems from "@/lib/helpers/getMapRespawnItems";
import applyCameraVectorTranslation from "@/lib/helpers/applyCameraVectorTranslation";

export default class Map {
  name: string;
  size: Rectangle;
  animals: Animal[];
  npcs: Character[];
  map_data: MapData;
  showWeather: boolean;
  day_cycle_opacity: number;
  static_items: StaticItem[];
  respawn_items: RespawnItem[];
  background_position: Vector2;
  background_image: HTMLImageElement | null;
  overlay_images: { [key: string]: HTMLImageElement };

  private constructor(m: IMap) {
    this.npcs = [];
    this.name = m.map_name;
    this.showWeather = false;
    this.day_cycle_opacity = 0;
    this.map_data = getMapData(m.map_name);
    this.overlay_images = m.overlay_images;
    this.background_position = Vector2.zero();
    this.background_image = m.background_image;
    this.animals = [Animal.init({ is_follower: true })];
    this.static_items = getMapStaticItems(this.map_data.static_items, this.name);
    this.size = Rectangle.init(0, 0, this.map_data.size.w, this.map_data.size.h);
    this.respawn_items = getMapRespawnItems(this.map_data.respawn_items, this.name);
  }

  static init = (m: IMap): Map => new Map(m);

  public drawBackground = (canvas: Canvas, camera: Camera): void => {
    if (!this.background_image) return;
    this.drawMapImage(canvas, camera, this.background_image);
  };

  public drawDayCycle = (canvas: Canvas, camera: Camera, game_time: number): void => {
    if (!this.overlay_images["day_cycle"]) return;
    this.day_cycle_opacity = getDayCycleData(game_time).opacity;
    canvas.context.globalAlpha = this.day_cycle_opacity;
    this.drawMapImage(canvas, camera, this.overlay_images["day_cycle"]);
    canvas.context.globalAlpha = 1;
  };

  public drawLayer = (layer: MapLayer, canvas: Canvas, spritesheet: HTMLImageElement, camera: Camera) => {
    const layers = this.map_data.layers[layer];
    if (!layers || !layers.length) return;
    layers.map((l: MapLayerData[]) => {
      l.map((d: MapLayerData) => {
        if (!d.src || !d.dest) return;
        const v_src: Vector2 = Vector2.init(d.src.x, d.src.y);
        const r_src: IRectangle = Rectangle.tile(v_src).value;
        const v_dest: Vector2 = Vector2.init(d.dest.x, d.dest.y);
        applyCameraVectorTranslation({ type: "layer", camera, v: v_dest, m_size: this.size.value });
        const r_dest: IRectangle = Rectangle.tile(v_dest).value;
        canvas.drawImage(spritesheet, r_src, r_dest);
      });
    });
  };

  private drawMapImage = (canvas: Canvas, camera: Camera, image: HTMLImageElement): void => {
    var r_dest: IRectangle = { x: 0, y: 0, w: canvas_size.x, h: canvas_size.y };
    const v_src = camera.position.duplicate();
    applyCameraVectorTranslation({ type: "background", camera, v: v_src, m_size: this.size.value });
    const r_src = Rectangle.init(v_src.x, v_src.y, canvas_size.x / camera.scale, canvas_size.y / camera.scale).value;
    canvas.drawImage(image, r_src, r_dest);
  };

  public drawRespawnItems = (canvas: Canvas, spritesheet: HTMLImageElement, camera: Camera) => {
    const layers = this.respawn_items;
    if (!layers || !layers.length) return;
    layers.map((d: RespawnItem) => {
      if (!d.srcs || d.srcs.length === 0 || !d.dests || d.dests.length === 0) return;
      if (d.srcs.length !== d.dests.length || d.hidden) return;
      d.srcs.forEach((_, i) => {
        const v_src: Vector2 = Vector2.init(d.srcs[i].x, d.srcs[i].y);
        const r_src: IRectangle = Rectangle.tile(v_src).value;
        const v_dest: Vector2 = Vector2.init(d.dests[i].x, d.dests[i].y);
        applyCameraVectorTranslation({ type: "layer", camera, v: v_dest, m_size: this.size.value });
        const r_dest: IRectangle = Rectangle.tile(v_dest).value;
        canvas.drawImage(spritesheet, r_src, r_dest);
      });
    });
  };

  public drawStaticItems = (canvas: Canvas, spritesheet: HTMLImageElement, camera: Camera) => {
    const layers = this.static_items;
    if (!layers || !layers.length) return;
    layers.map((d: StaticItem) => {
      if (!d.srcs || d.srcs.length === 0 || !d.dests || d.dests.length === 0) return;
      if (d.srcs.length !== d.dests.length) return;
      d.srcs.forEach((_, i) => {
        const v_src: Vector2 = Vector2.init(d.srcs[i].x, d.srcs[i].y);
        const r_src: IRectangle = Rectangle.tile(v_src).value;
        const v_dest: Vector2 = Vector2.init(d.dests[i].x, d.dests[i].y);
        applyCameraVectorTranslation({ type: "layer", camera, v: v_dest, m_size: this.size.value });
        const r_dest: IRectangle = Rectangle.tile(v_dest).value;
        canvas.drawImage(spritesheet, r_src, r_dest);
      });
    });
  };

  public getSpawnPoint = (name: string): Vector2 => {
    const spawn_points = this.map_data.spawn_points;
    const sp = spawn_points.find((i) => i.name === name);
    if (!sp) return Vector2.zero();
    return Vector2.init(sp.dest.x, sp.dest.y);
  };
}
