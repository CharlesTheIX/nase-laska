import { memory_prefix } from "@/globals";
import { validateSaveData, validateMapData, validateSettingsData, SaveData, MapData, SettingsData } from "./lib/validation";

export default class Memory {
  private _map_data: MapData;
  private _save_data: SaveData;
  private _settings_data: SettingsData;

  private constructor() {
    try {
      const save_data = localStorage.getItem(`${memory_prefix}_save`) || "";
      this._save_data = JSON.parse(save_data);
      validateSaveData(this._save_data);
    } catch {
      this._save_data = { game_time: 0, player: { position: { x: 0, y: 0 }, name: "Player", hit_box: { x: 0, y: 0, w: 50, h: 50 } } };
      localStorage.setItem(`${memory_prefix}_save`, JSON.stringify(this._save_data));
    }

    try {
      const map_data = localStorage.getItem(`${memory_prefix}_map`) || "";
      this._map_data = JSON.parse(map_data);
      validateMapData(this._map_data);
    } catch {
      this._map_data = { name: "level_1", rect: { x: 0, y: 0, w: 720, h: 528 } };
      localStorage.setItem(`${memory_prefix}_map`, JSON.stringify(this._map_data));
    }

    try {
      const settings_data = localStorage.getItem(`${memory_prefix}_settings`) || "";
      this._settings_data = JSON.parse(settings_data);
      validateSettingsData(this._settings_data);
    } catch {
      this._settings_data = { language: "en", music_volume: 5, sfx_volume: 5, movement_mode: "tiled" };
      localStorage.setItem(`${memory_prefix}_settings`, JSON.stringify(this._settings_data));
    }
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (): Memory => new Memory();

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get map_data(): MapData {
    return this._map_data;
  }

  get settings_data(): SettingsData {
    return this._settings_data;
  }

  get save_data(): SaveData {
    return this._save_data;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set map_data(data: Partial<MapData> | null) {
    if (!data) localStorage.removeItem(`${memory_prefix}_map`);
    this._map_data = { ...this._map_data, ...data };
    localStorage.setItem(`${memory_prefix}_map`, JSON.stringify(data));
  }

  set save_data(data: Partial<SaveData> | null) {
    if (data === null) localStorage.removeItem(`${memory_prefix}_save`);
    this._save_data = { ...this._save_data, ...data };
    if (this._save_data) localStorage.setItem(`${memory_prefix}_save`, JSON.stringify(data));
  }

  set settings_data(data: Partial<SettingsData>) {
    this._settings_data = { ...this._settings_data, ...data };
    localStorage.setItem(`${memory_prefix}_settings`, JSON.stringify(this._settings_data));
  }

  // METHODS -----------------------------------------------------------------------------------------------------------------------------------------
  public print(): void {
    console.log(`\n`);
    console.log("----- Memory -----");
    console.log("Map Data:", this._map_data);
    console.log("Save Data:", this._save_data);
    console.log("Settings Data:", this._settings_data);
    console.log(`\n`);
  }
}
