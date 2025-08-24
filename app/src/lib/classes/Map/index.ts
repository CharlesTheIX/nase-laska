import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import { canvas_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";
import getMapData from "./helpers/getMapData";
import Rectangle from "@/lib/classes/Rectangle";

export default class Map {
  size: Rectangle;
  map_data: MapData;
  showWeather: boolean;
  background_position: Vector2;
  background_image: HTMLImageElement | null;

  private constructor(m: IMap) {
    this.showWeather = false;
    this.map_data = getMapData(m.map_name);
    this.background_position = Vector2.zero();
    this.background_image = m.background_image;
    this.size = Rectangle.init(0, 0, this.map_data.size.w, this.map_data.size.h);
  }

  static init = (m: IMap): Map => new Map(m);

  public getSpawnPoint(name: string): Vector2 {
    const spawn_points = this.map_data.spawn_points;
    const sp = spawn_points.find((i) => i.name === name);
    if (!sp) return Vector2.zero();
    return Vector2.init(sp.dest.x, sp.dest.y);
  }

  public drawLayer = (layer: MapLayer, canvas: Canvas, spritesheet: HTMLImageElement, camera: Camera) => {
    const collisionLayers = this.map_data.layers[layer];
    if (!collisionLayers || !collisionLayers.length) return;
    collisionLayers.map((l: MapLayerData[]) => {
      l.map((d: MapLayerData) => {
        const v_src: Vector2 = Vector2.init(d.src.x, d.src.y);
        const r_src: IRectangle = Rectangle.tile(v_src).value;
        const v_dest: Vector2 = Vector2.init(d.dest.x, d.dest.y);
        camera.applyVectorTranslation("layer", v_dest, this.size.value);
        const r_dest: IRectangle = Rectangle.tile(v_dest).value;
        canvas.drawImage(spritesheet, r_src, r_dest);
      });
    });
  };

  public drawBackground = (props: { canvas: Canvas; camera: Camera }): void => {
    const { canvas, camera } = props;
    if (!this.background_image) return;
    var r_dest: IRectangle = { x: 0, y: 0, w: canvas_size.x, h: canvas_size.y };
    const v_src = camera.position.duplicate();
    camera.applyVectorTranslation("background", v_src, this.size.value);
    const r_src = Rectangle.init(v_src.x, v_src.y, canvas_size.x / camera.scale, canvas_size.y / camera.scale).value;
    canvas.drawImage(this.background_image, r_src, r_dest);
  };
}
