import RespawnItem from "@/lib/classes/Items/RespawnItem";
import getInventoryItemData from "@/lib/helpers/getInventoryItemData";

export default class Inventory {
  items: InventoryItem[];

  constructor() {
    this.items = [
      {
        value: 1,
        count: 100,
        name: "pouch",
        message: "Money",
        srcs: [{ x: 16, y: 0 }]
      }
    ];
  }

  static init = (saved_inventory: { name: string; count: number }[] | null): Inventory => {
    const i = new Inventory();
    if (!saved_inventory) return i;
    const inventory: InventoryItemData[] = [];
    saved_inventory.forEach((si) => {
      const item = getInventoryItemData(si.name);
      if (!item) return;
      inventory.push({
        name: si.name,
        count: si.count,
        srcs: item.srcs,
        value: item.value,
        message: item.message
      });
    });
    i.items = inventory;
    return i;
  };

  public addItem = (item: InventoryItemData): void => {
    if (item.count <= 0) return;
    if (!this.itemExists(item.name)) {
      this.items.push({
        name: item.name,
        srcs: item.srcs,
        value: item.value,
        count: item.count,
        message: item.message
      });
    } else {
      this.items = this.items.map((i) => {
        if (i.name === item.name) i.count += item.count;
        return i;
      });
    }
  };

  public itemExists = (name: string): InventoryItem | null => {
    const exists = this.items.find((i) => i.name === name);
    if (!exists) return null;
    return exists;
  };

  public removeItem = (item: RespawnItem): void => {
    if (this.itemExists(item.name)) return;
    this.items = this.items.filter((i) => {
      if (i.name === item.name) i.count -= item.count;
      if (i.count <= 0) return null;
      return i;
    });
  };
}
