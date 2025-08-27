import Vector2 from "@/lib/classes/Vector2";

export default class StaticItem {
  name: string;
  message: string;
  srcs: Vector2[];
  dests: Vector2[];

  constructor(name: string, srcs: IVector2[], dests: IVector2[], message: string) {
    this.name = name;
    this.message = message;
    this.srcs = [];
    this.dests = [];
    srcs.forEach((i) => {
      const v = Vector2.init(i.x, i.y);
      this.srcs.push(v);
    });
    dests.forEach((i) => {
      const v = Vector2.init(i.x, i.y);
      this.dests.push(v);
    });
  }

  static init = (name: string, srcs: IVector2[], dests: IVector2[], message: string): StaticItem =>
    new StaticItem(name, srcs, dests, message);
}
