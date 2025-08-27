import test_1 from "@/data/maps/test_1.json";

export default (map_name: string): MapData => {
  switch (map_name) {
    case "test_1":
    default:
      return test_1;
  }
};
