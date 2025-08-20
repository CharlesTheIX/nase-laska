import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import Vector2 from "@/lib/classes/Vector2";
import getMapData from "./helpers/getMapData";
import Rectangle from "@/lib/classes/Rectangle";
import { getInputKeySets } from "@/lib/inputKeys";
import InputHandler from "@/lib/classes/InputHandler";
import { canvas_size, tile_size } from "@/lib/globals";

export default class Map {
  camera: Camera;
  size: Rectangle;
  map_data: MapData;
  showWeather: boolean;
  background_position: Vector2;
  background_image: HTMLImageElement | null;

  private constructor(m: IMap) {
    this.camera = m.camera;
    this.showWeather = false;
    this.map_data = getMapData(m.map_name);
    this.background_image = m.background_image;
    this.background_position = this.camera.position;
    this.size = Rectangle.init(0, 0, this.map_data.size_px.w, this.map_data.size_px.h);
  }

  static init = (m: IMap): Map => new Map(m);

  public drawLayer = (layer: MapLayer, canvas: Canvas, spritesheet: HTMLImageElement, camera: Camera) => {
    const collisionLayers = this.map_data.layers[layer];
    if (!collisionLayers || !collisionLayers.length) return;
    collisionLayers.map((l: MapLayerData[]) => {
      l.map((d: MapLayerData) => {
        const v_dest: Vector2 = Vector2.init(d.px_position.x, d.px_position.y);
        const r_dest: IRectangle = Rectangle.tile(v_dest).value;

        const v_src: Vector2 = Vector2.init(d.sprite_px_position.x, d.sprite_px_position.y);
        const r_src: IRectangle = Rectangle.tile(v_src).value;
        canvas.drawImage(spritesheet, r_src, r_dest);
      });
    });
  };

  public drawBackground = (props: { canvas: Canvas; camera: Camera }): void => {
    const { canvas, camera } = props;
    if (!this.background_image) return;
    var r_dest: IRectangle = { x: 0, y: 0, w: canvas_size.w, h: canvas_size.h };
    const v_src = {
      x: camera.position.x - canvas_size.w / 2 / camera.scale,
      y: camera.position.y - canvas_size.h / 2 / camera.scale
    };
    if (v_src.x < 0) v_src.x = 0;
    if (v_src.y < 0) v_src.y = 0;
    if (v_src.x > this.size.w - canvas_size.w / camera.scale) v_src.x = this.size.w - canvas_size.w / camera.scale;
    if (v_src.y > this.size.h - canvas_size.h / camera.scale) v_src.y = this.size.h - canvas_size.h / camera.scale;
    var r_src: IRectangle = {
      x: v_src.x,
      y: v_src.y,
      w: canvas_size.w / camera.scale,
      h: canvas_size.h / camera.scale
    };
    canvas.drawImage(this.background_image, r_src, r_dest);
  };

  // public update = (input_handler: InputHandler): void => {
  // const key_sets: KeySetMap = getInputKeySets();
  // if ([...input_handler.keys].some((key) => key_sets.dev.has(key))) this.showWeather = !this.showWeather;
  // };
}
