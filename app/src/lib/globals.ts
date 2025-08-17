export const tile_size = { w: 16, h: 16 };

/* C */
export const canvas_size = { w: 45 * tile_size.w, h: 33 * tile_size.h };

/* F */
export const font_family = { name: "GameFont", font_size: tile_size.h };
export const fps = 1000 / 60;

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
