import start from "@/data/maps/start.json";
import test_1 from "@/data/maps/test_1.json";
import test_2 from "@/data/maps/test_2.json";

export default (map_name: string): MapData => {
  switch (map_name) {
    case "start":
      return { ...start };
    case "test_1":
      return test_1;
    case "test_2":
      return test_2;
    default:
      return test_1;
  }
};
