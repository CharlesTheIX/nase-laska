import inventory_items from "@/data/inventory_items.json";
import inventory_map from "@/maps/inventory_items_map.json";

export default (name: string): InventoryItemData | null => {
  const data_map = inventory_map.find((i: any) => i.name === name);
  if (!data_map) return null;
  const data_item = inventory_items.find((i: any) => i.name === name);
  if (!data_item) return null;
  return {
    name,
    srcs: data_item.srcs,
    count: data_map.count,
    value: data_map.value,
    message: data_map.message
  };
};
