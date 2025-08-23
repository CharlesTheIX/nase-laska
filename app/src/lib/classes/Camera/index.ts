import Vector2 from "@/lib/classes/Vector2";
import { tile_size, canvas_size } from "@/lib/globals";

export default class Camera {
  scale: number;
  position: Vector2;
  dest_position: Vector2;
  focus: "fixed" | "free";

  private constructor() {
    this.scale = 2;
    this.focus = "fixed";
    this.position = Vector2.zero();
    this.dest_position = Vector2.zero();
  }

  static init = (): Camera => new Camera();

  public applyVectorTranslation = (type: string, v: Vector2, m_size: IRectangle): void => {
    if (this.focus === "free") return;
    const v_edge_far = Vector2.init(m_size.w - canvas_size.x / this.scale, m_size.h - canvas_size.y / this.scale);
    switch (type) {
      case "layer":
        var v_t = Vector2.scale(canvas_size, 0.5).scale(1 / this.scale);
        v_t = Vector2.subtract(this.position, v_t);
        if (v_t.x < 0) v.x += v_t.x;
        if (v_t.y < 0) v.y += v_t.y;
        if (v_t.x > v_edge_far.x) v.x += v_t.x - v_edge_far.x;
        if (v_t.y > v_edge_far.y) v.y += v_t.y - v_edge_far.y;
        return;
      case "background":
        var camera_offset = Vector2.init(canvas_size.x / 2 / this.scale, canvas_size.y / 2 / this.scale);
        const t = {
          x: v.x - camera_offset.x,
          y: v.y - camera_offset.y,
          w: canvas_size.x / this.scale,
          h: canvas_size.y / this.scale
        };

        if (t.x < 0) t.x = 0;
        if (t.y < 0) t.y = 0;
        if (t.x > v_edge_far.x) t.x = v_edge_far.x;
        if (t.y > v_edge_far.y) t.y = v_edge_far.y;
        v.x = t.x;
        v.y = t.y;
        return;
    }
  };

  public update = (v: Vector2): void => {
    if (this.focus === "fixed") this.dest_position = v.duplicate();
    this.dest_position.x += tile_size / 2;
    this.dest_position.y += tile_size / 2;
    this.position = this.dest_position.duplicate();
  };
}
