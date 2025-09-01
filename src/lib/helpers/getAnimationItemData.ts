import start from "@/data_maps/map_items/start_item_map.json";
import test_1 from "@/data_maps/map_items/test_1_item_map.json";
import test_2 from "@/data_maps/map_items/test_2_item_map.json";

type Return = { name: string; srcs: IRectangle[]; dest: IRectangle; timeout: number };

export default (map_name: string): Return[] => {
  switch (map_name) {
    case "start":
      return start.animation_items;
    case "test_1":
      return test_1.animation_items;
    case "test_2":
      return test_2.animation_items;
    default:
      return test_1.animation_items;
  }
};
