import test_1 from "@/data/maps/test_1.json";
import test_2 from "@/data/maps/test_2.json";
import test_3 from "@/data/maps/test_3.json";

export default (map_name: string): MapData => {
  switch (map_name) {
    case "test_2":
      return test_2;
    case "test_3":
      return test_3;
    case "test_1":
    default:
      return test_1;
  }
};
