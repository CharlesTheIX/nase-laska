import Timer from "@/lib/classes/Timer";
import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import Vector2 from "@/lib/classes/Vector2";
import Rectangle from "@/lib/classes/Rectangle";
import applyCameraVectorTranslation from "@/lib/helpers/applyCameraVectorTranslation";

export default class AnimationItem {
  name: string;
  timer: Timer;
  dest: Rectangle;
  srcs: Rectangle[];
  frame_index: number;

  constructor(name: string, srcs: IRectangle[], dest: IRectangle, timeout: number) {
    this.srcs = [];
    this.name = name;
    this.frame_index = 0;
    this.timer = Timer.init("count_down", timeout);
    this.dest = Rectangle.init(dest.x, dest.y, dest.w, dest.h);
    srcs.forEach((i) => {
      const v = Rectangle.init(i.x, i.y, i.w, i.h);
      this.srcs.push(v);
    });
  }

  static init = (name: string, srcs: IRectangle[], dest: IRectangle, timeout: number): AnimationItem =>
    new AnimationItem(name, srcs, dest, timeout);

  public draw = (canvas: Canvas, camera: Camera, m_size: IRectangle, image: HTMLImageElement): void => {
    const v_dest = Vector2.init(this.dest.x, this.dest.y);
    applyCameraVectorTranslation({ type: "layer", camera, v: v_dest, m_size });
    const r_dest = { w: this.dest.w, h: this.dest.h, x: v_dest.x, y: v_dest.y };
    canvas.drawImage(image, this.srcs[this.frame_index], r_dest);
  };

  public update = (time_step: number): void => {
    this.timer.update(time_step);
    if (!this.timer.complete) return;
    this.timer.start();
    this.frame_index += 1;
    if (this.frame_index >= this.srcs.length) this.frame_index = 0;
  };
}
