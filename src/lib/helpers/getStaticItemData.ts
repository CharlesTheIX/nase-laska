import test_1 from "@/data/items/test_1.json";

type Return = { name: string; message: string };

export default (map_name: string): Return[] => {
  switch (map_name) {
    case "test_1":
    default:
      return test_1.static_items;
  }
};
