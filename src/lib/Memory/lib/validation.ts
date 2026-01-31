import { Vector2Value } from "@/lib/Vector2";
import { RectangleValue } from "@/lib/Rectangle";

export type MapData = { name: string; rect: RectangleValue };
export type SaveData = { game_time: number; player: { position: Vector2Value; name: string; hit_box: RectangleValue } };
export type SettingsData = { language: string; music_volume: number; sfx_volume: number; movement_mode: "continuous" | "tiled" };

export const validateMapData = (data: MapData): void => {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid map data: data is not an object`);
  }
  Object.keys(data).forEach((key) => {
    if (data[key as keyof MapData] === undefined || data[key as keyof MapData] === null) {
      throw new Error(`Corrupted map data: Missing key "${key}"`);
    }
  });
};

export const validateSaveData = (data: SaveData): void => {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid save data: data is not an object`);
  }
  Object.keys(data).forEach((key) => {
    if (data[key as keyof SaveData] === undefined || data[key as keyof SaveData] === null) {
      throw new Error(`Corrupted save data: Missing key "${key}"`);
    }

    if (key === "player") {
      const player_data = data.player;
      if (!player_data || typeof player_data !== "object") {
        throw new Error(`Corrupted save data: player is not an object`);
      }
      Object.keys(player_data).forEach((p_key) => {
        if (player_data[p_key as keyof SaveData["player"]] === undefined || player_data[p_key as keyof SaveData["player"]] === null) {
          throw new Error(`Corrupted save data: Missing key "player.${p_key}"`);
        }
      });
    }
  });
};

export const validateSettingsData = (data: SettingsData): void => {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid settings data: data is not an object`);
  }
  Object.keys(data).forEach((key) => {
    if (data[key as keyof SettingsData] === undefined || data[key as keyof SettingsData] === null) {
      throw new Error(`Corrupted settings data: Missing key "${key}"`);
    }
  });
};
