import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import { canvas_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";
import getMapData from "./helpers/getMapData";
import Rectangle from "@/lib/classes/Rectangle";
import { getInputKeySets } from "@/lib/inputKeys";
import InputHandler from "@/lib/classes/InputHandler";

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
        const v_src: Vector2 = Vector2.init(d.sprite_px_position.x, d.sprite_px_position.y);
        const r_src: IRectangle = Rectangle.tile(v_src).value;
        const v_dest: Vector2 = Vector2.init(d.px_position.x, d.px_position.y);
        t_layer(v_dest, camera, this);
        const r_dest: IRectangle = Rectangle.tile(v_dest).value;
        canvas.drawImage(spritesheet, r_src, r_dest);
      });
    });
  };

  public drawBackground = (props: { canvas: Canvas; camera: Camera }): void => {
    const { canvas, camera } = props;
    if (!this.background_image) return;
    var r_dest: IRectangle = { x: 0, y: 0, w: canvas_size.w, h: canvas_size.h };
    var v_t = Vector2.init(canvas_size.w / 2 / camera.scale, canvas_size.h / 2 / camera.scale);
    const v_src = camera.position.duplicate().subtract(v_t);
    t_background(v_src, camera, this);
    const r_src = Rectangle.init(v_src.x, v_src.y, canvas_size.w / camera.scale, canvas_size.h / camera.scale).value;
    canvas.drawImage(this.background_image, r_src, r_dest);
  };
}

const t_layer = (v: Vector2, c: Camera, m: Map): void => {
  var v_t = Vector2.init(canvas_size.w / 2 / c.scale, canvas_size.h / 2 / c.scale);
  v_t = Vector2.subtract(c.position, v_t);
  if (v_t.x < 0) v.x += v_t.x;
  if (v_t.y < 0) v.y += v_t.y;
  if (v_t.x > m.size.w - canvas_size.w / c.scale) v.x += v_t.x - (m.size.w - canvas_size.w / c.scale);
  if (v_t.y > m.size.h - canvas_size.h / c.scale) v.y += v_t.y - (m.size.h - canvas_size.h / c.scale);
};

const t_background = (v: Vector2, c: Camera, m: Map): void => {
  if (v.x < 0) v.x = 0;
  if (v.y < 0) v.y = 0;
  if (v.x > m.size.w - canvas_size.w / c.scale) v.x = m.size.w - canvas_size.w / c.scale;
  if (v.y > m.size.h - canvas_size.h / c.scale) v.y = m.size.h - canvas_size.h / c.scale;
};
