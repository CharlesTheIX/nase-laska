import Canvas from "@/lib/classes/Canvas";
import { canvas_size, tile_size } from "@/lib/globals";

export default (message: string, canvas: Canvas): string[] => {
  var sub_message = "";
  const current_message: string[] = [];
  const text_array = message.split(" ");
  const max_width = canvas_size.x - 3 * tile_size;
  text_array.forEach((w, i) => {
    var temp = `${sub_message} ${w}`;
    if (canvas.context.measureText(temp).width > max_width) {
      current_message.push(sub_message);
      sub_message = `${w}`;
    } else sub_message = temp;
    if (i >= text_array.length - 1) current_message.push(sub_message);
  });
  return current_message;
};
