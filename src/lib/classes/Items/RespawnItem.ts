import Vector2 from "@/lib/classes/Vector2";

export default class RespawnItem {
  name: string;
  value: number;
  count: number;
  message: string;
  hidden: boolean;
  srcs: Vector2[];
  dests: Vector2[];
  item_name: string;
  respawn_time: number;
  collected_at: number;

  constructor(ri: IRespawnItem) {
    this.srcs = [];
    this.dests = [];
    this.hidden = false;
    this.name = ri.name;
    this.value = ri.value;
    this.collected_at = 0;
    this.message = ri.message;
    this.count = ri.count || 1;
    this.item_name = ri.item_name;
    this.respawn_time = ri.respawn_time;
    ri.srcs.forEach((i) => {
      const v = Vector2.init(i.x, i.y);
      this.srcs.push(v);
    });
    ri.dests.forEach((i) => {
      const v = Vector2.init(i.x, i.y);
      this.dests.push(v);
    });
  }

  static init = (ri: IRespawnItem): RespawnItem => new RespawnItem(ri);
}
