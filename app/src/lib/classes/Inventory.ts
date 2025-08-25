import RespawnItem from "@/lib/classes/Items/RespawnItem";

type InventoryItem = {
  name: string;
  value: number;
  count: number;
  message: string;
  srcs: IVector2[];
};

export default class Inventory {
  items: InventoryItem[];

  constructor() {
    this.items = [];
  }

  static init = (): Inventory => new Inventory();

  public setInventory = (items: InventoryItem[]): void => {
    this.items = items;
  };

  public addItem = (item: RespawnItem): void => {
    const exists = this.items.find((i) => i.name === item.name);
    if (!exists) {
      this.items.push({
        name: item.name,
        srcs: item.srcs,
        value: item.value,
        count: item.count,
        message: item.inventory_message
      });
    } else {
      this.items = this.items.map((i) => {
        if (i.name === item.name) i.count += item.count;
        return i;
      });
    }
  };
}
