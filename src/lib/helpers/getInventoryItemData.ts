import inventory_items from "@/data/inventory_items.json";

export default (name: string): InventoryItemData => {
  const data = inventory_items.find((i: InventoryItemData) => i.name === name);
  if (!data) return { name: "null", value: 0, srcs: [], message: "", count: 0 };
  return data;
};
