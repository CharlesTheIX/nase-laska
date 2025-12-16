import { storage_prefix } from "@/globals";

type MapData = {};
type SaveData = {};
type SettingsData = { language: string; music_volume: number; sfx_volume: number };

export default class Storage {
  private _settings_data: SettingsData;
  private _map_data: MapData | null = null;
  private _save_data: SaveData | null = null;

  private constructor() {
    const map_data = localStorage.getItem(`${storage_prefix}_map`);
    const save_data = localStorage.getItem(`${storage_prefix}_save`);
    const settings_data = localStorage.getItem(`${storage_prefix}_settings`);

    if (map_data) this._map_data = JSON.parse(map_data);
    if (save_data) this._save_data = JSON.parse(save_data);
    if (!settings_data) {
      this._settings_data = { language: "en", music_volume: 5, sfx_volume: 5 };
      localStorage.setItem(`${storage_prefix}_settings`, JSON.stringify(this._settings_data));
    } else this._settings_data = JSON.parse(settings_data);
    this._save_data = {};
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (): Storage => new Storage();

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get map_data(): MapData | null {
    return this._map_data;
  }

  get settings_data(): SettingsData {
    return this._settings_data;
  }

  get save_data(): SaveData | null {
    return this._save_data;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set map_data(data: MapData | null) {
    this._map_data = data;
    if (data) localStorage.setItem(`${storage_prefix}_map`, JSON.stringify(data));
    else localStorage.removeItem(`${storage_prefix}_map`);
  }

  set save_data(data: SaveData | null) {
    this._save_data = data;
    if (data) localStorage.setItem(`${storage_prefix}_save`, JSON.stringify(data));
    else localStorage.removeItem(`${storage_prefix}_save`);
  }

  set settings_data(data: Partial<SettingsData>) {
    this._settings_data = { ...this._settings_data, ...data };
    localStorage.setItem(`${storage_prefix}_settings`, JSON.stringify(this._settings_data));
  }
}
