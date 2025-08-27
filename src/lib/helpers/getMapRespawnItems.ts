import RespawnItem from "@/lib/classes/Items/RespawnItem";
import getRespawnItemData from "@/lib/helpers/getRespawnItemData";

export default (data: RespawnItemData[], map_name: string): RespawnItem[] => {
  const items: RespawnItem[] = [];
  const respawn_item_data = getRespawnItemData(map_name);
  data.forEach((i) => {
    respawn_item_data.forEach((j) => {
      if (i.name === j.name && i.srcs) {
        const item = RespawnItem.init({
          name: i.name,
          srcs: i.srcs,
          dests: i.dests,
          value: j.value,
          count: j.count,
          message: j.message,
          item_name: j.item_name,
          respawn_time: j.respawn_time
        });
        items.push(item);
      }
    });
  });
  return items;
};
