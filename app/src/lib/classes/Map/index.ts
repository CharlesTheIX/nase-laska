import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import { canvas_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";
import getMapData from "./helpers/getMapData";
import Rectangle from "@/lib/classes/Rectangle";

export default class Map {
  map_data: MapData;
  rectangle: Rectangle;
  background_image: HTMLImageElement | null;

  private constructor(m: IMap) {
    this.map_data = getMapData(m.map_name);
    this.background_image = m.background_image;
    this.rectangle = Rectangle.init(0, 0, this.map_data.size_px.w, this.map_data.size_px.h);
  }

  static init = (m: IMap): Map => new Map(m);

  public drawCollisionLayers = (canvas: Canvas, image: HTMLImageElement) => {
    const collisionLayers = this.map_data.layers["collision"];
    collisionLayers.map((l: MapLayerData[]) => {
      l.map((d: MapLayerData) => {
        const v_dest: Vector2 = Vector2.init(d.px_position.x, d.px_position.y);
        const v_src: Vector2 = Vector2.init(d.sprite_px_position.x, d.sprite_px_position.y);
        const r_src: IRectangle = Rectangle.tile(v_src).value;
        const r_dest: IRectangle = Rectangle.tile(v_dest).value;
        canvas.drawImage(image, r_src, r_dest);
      });
    });
  };

  public drawBackground = (props: { canvas: Canvas; camera: Camera }): void => {
    const { canvas, camera } = props;
    if (!this.background_image) return;
    var r_dest: IRectangle = camera.rectangle.value;
    var r_src: IRectangle = { ...camera.position, ...canvas_size };
    canvas.drawImage(this.background_image, r_src, r_dest);
  };
}
