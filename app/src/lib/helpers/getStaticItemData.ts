import test_1 from "@/data/items/test_1.json";

export default (map_name: string): { name: string; message: string }[] => {
  switch (map_name) {
    case "test_1":
    default:
      return test_1;
  }
};
