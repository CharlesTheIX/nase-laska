import Vector2 from "@/lib/classes/Vector2";

export default class RespawnItem {
  name: string;
  value: number;
  count: number;
  message: string;
  hidden: boolean;
  srcs: Vector2[];
  dests: Vector2[];
  respawn_time: number;
  collected_at: number;
  inventory_message: string;

  constructor(ri: IRespawnItem) {
    this.srcs = [];
    this.dests = [];
    this.hidden = false;
    this.name = ri.name;
    this.value = ri.value;
    this.collected_at = 0;
    this.message = ri.message;
    this.count = ri.count || 1;
    this.respawn_time = ri.respawn_time;
    this.inventory_message = ri.inventory_message;
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
