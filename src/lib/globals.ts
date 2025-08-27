import Vector2 from "@/lib/classes/Vector2";

export const tile_size = 16;

/* C */
export const canvas_size = Vector2.init(45, 33).scale(tile_size);
export const characters_sheet_src = {
  png: "./assets/images/characters.png",
  webp: "./assets/images/characters.webp"
};

/* E */
export const emotion_sheet_src = {
  png: "./assets/images/emotions.png",
  webp: "./assets/images/emotions.webp"
};

/* F */
export const font_family = { name: "GameFont", font_size: tile_size };
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
