export default (game_time: number): { name: string; opacity: number } => {
  const segment_size = 12;
  var opacity: number = 0;
  var name: string = "day";
  const day_cycle_time = 20 * 60;
  const time_of_day = game_time % day_cycle_time;
  const limits = {
    day: day_cycle_time * (6 / segment_size) - 1,
    dusk: day_cycle_time * (8 / segment_size) - 1,
    night: day_cycle_time * (10 / segment_size) - 1,
    dawn: day_cycle_time - 1
  };

  if (time_of_day > limits.day && time_of_day <= limits.dusk) {
    name = "dusk";
    opacity = (time_of_day - limits.day) / (limits.dusk - limits.day);
  } else if (time_of_day > limits.dusk && time_of_day <= limits.night) {
    opacity = 1;
    name = "night";
  } else if (time_of_day > limits.night) {
    name = "dawn";
    opacity = 1 - (time_of_day - limits.night) / (limits.dawn - limits.night);
  }

  if (opacity < 0) opacity = 0;
  if (opacity > 1) opacity = 1;
  return { name, opacity };
};
