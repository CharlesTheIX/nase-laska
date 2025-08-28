import Vector2 from "@/lib/classes/Vector2";

export const tile_size = 16;

/* C */
export const canvas_size = Vector2.init(45, 33).scale(tile_size);
export const characters_sheet_src = {
  png: "./assets/images/characters.png",
  webp: "./assets/images/characters.webp"
};

/* D */
const day_cycle_segment_size = 12;
const day_cycle_time = 20 * 60;
export const day_cycle = {
  cycle_time: day_cycle_time,
  segment_size: day_cycle_segment_size,
  limits: {
    dawn: day_cycle_time - 1,
    day: day_cycle_time * (6 / day_cycle_segment_size) - 1,
    dusk: day_cycle_time * (8 / day_cycle_segment_size) - 1,
    night: day_cycle_time * (10 / day_cycle_segment_size) - 1
  }
};

/* E */
export const emotion_sheet_src = {
  png: "./assets/images/emotions.png",
  webp: "./assets/images/emotions.webp"
};

/* F */
export const font = { name: "GameFont", size: tile_size };
export const fps = 1000 / 60;

/* I */
export const inventory_items_sheet_src = {
  png: "./assets/images/inventory_items.png",
  webp: "./assets/images/inventory_items.webp"
};

/* L */
export const loading_element_data = {
  id: "loading",
  transition_time: 1000,
  progress_bar_id: "progress"
};

/* P */
export const player_input_timeout = 0;
export const player_movement_type: PlayerMovementType = "tiled";

/* S */
export const scale = 1;
export const spritesheet_srcs = {
  png: "./assets/images/spritesheet.png",
  webp: "./assets/images/spritesheet.webp"
};
