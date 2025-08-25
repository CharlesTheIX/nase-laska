import RespawnItem from "@/lib/classes/Items/RespawnItem";
import getRespawnItemData from "@/lib/helpers/getRespawnItemData";

export default (data: RespawnItemData[], map_name: string): RespawnItem[] => {
  const items: RespawnItem[] = [];
  const respawn_item_data = getRespawnItemData(map_name);
  data.forEach((i) => {
    respawn_item_data.forEach((j) => {
      if (i.name === j.name && i.srcs) {
        const item = RespawnItem.init({
          count: 1,
          name: i.name,
          srcs: i.srcs,
          dests: i.dests,
          value: j.value,
          message: j.message,
          respawn_time: j.respawn_time,
          inventory_message: j.inventory_message
        });
        items.push(item);
      }
    });
  });
  return items;
};
