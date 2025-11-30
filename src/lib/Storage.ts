export default class Storage {
  private _save_data: any = false;
  private _storage_prefix: string = "__nase_laska";
  private _settings_data: { language: string; music_volume: number; sfx_volume: number };

  private constructor() {
    const saved_settings = localStorage.getItem(`${this._storage_prefix}_settings`);
    if (!saved_settings) {
      this._settings_data = { language: "en", music_volume: 5, sfx_volume: 5 };
      localStorage.setItem(`${this._storage_prefix}_settings`, JSON.stringify(this._settings_data));
    } else this._settings_data = JSON.parse(saved_settings);
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (): Storage => new Storage();

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get settings_data(): { language: string; music_volume: number; sfx_volume: number } {
    return this._settings_data;
  }

  get save_data(): any {
    return this._save_data;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set settings_data(data: Partial<Storage["_settings_data"]>) {
    this._settings_data = { ...this._settings_data, ...data };
    localStorage.setItem(`${this._storage_prefix}_settings`, JSON.stringify(this._settings_data));
  }
}
