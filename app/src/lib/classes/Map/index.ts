import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import getMapData from "./helpers/getMapData";
import { canvas_size, tile_size } from "@/lib/globals";
import Rectangle, { IRectangle } from "@/lib/classes/Rectangle";

export interface IMap {
  map_name: string;
  background_image: HTMLImageElement;
}

export default class Map {
  map_data: MapData;
  rectangle: Rectangle;
  background_image: HTMLImageElement | null;

  private constructor(m: IMap) {
    this.map_data = getMapData(m.map_name);
    this.background_image = m.background_image;
    this.rectangle = Rectangle.init(0, 0, this.map_data.size_px.x, this.map_data.size_px.y);
  }

  static init = (m: IMap) => new Map(m);

  public drawCollisionLayers = (canvas: Canvas) => {
    const collisionLayers = this.map_data.layers["collision"];
    collisionLayers.map((layer: MapLayerData[]) => {
      layer.map((data: MapLayerData) => {
        canvas.drawRectangle({ rectangle: { ...data.px_position, ...tile_size } });
      });
    });
  };

  public drawBackground = (props: { canvas: Canvas; camera: Camera }): void => {
    const { canvas, camera } = props;
    if (!this.background_image) return;
    var r_dest: IRectangle = { x: 0, y: 0, ...canvas_size };
    var r_src: IRectangle = { ...camera.position, ...canvas_size };
    canvas.drawImage({ image: this.background_image, r_src, r_dest });
  };
}
