import AnimationItem from "@/lib/classes/Items/AnimationItem";
import getAnimationItemData from "@/lib/helpers/getAnimationItemData";

export default (map_name: string): AnimationItem[] => {
  const items: AnimationItem[] = [];
  const item_data = getAnimationItemData(map_name);
  item_data.forEach((i) => {
    if (i.name && i.srcs) {
      const item = AnimationItem.init(i.name, i.srcs, i.dest, i.timeout);
      items.push(item);
    }
  });
  return items;
};
