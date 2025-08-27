import StaticItem from "@/lib/classes/Items/StaticItem";
import getStaticItemData from "@/lib/helpers/getStaticItemData";

export default (data: StaticItemData[], map_name: string): StaticItem[] => {
  const items: StaticItem[] = [];
  const static_item_data = getStaticItemData(map_name);
  data.forEach((i) => {
    static_item_data.forEach((j) => {
      if (i.name === j.name && i.srcs) {
        const item = StaticItem.init(i.name, i.srcs, i.dests, j.message);
        items.push(item);
      }
    });
  });
  return items;
};
