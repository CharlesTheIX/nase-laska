export default class Storage {
  private _language: string;
  private _save_data: any = false;
  private _storage_prefix: string = "__nase_laska";

  private constructor() {
    const lang = localStorage.getItem(`${this._storage_prefix}_language`);
    if (!lang) {
      this._language = "en";
      localStorage.setItem(`${this._storage_prefix}_language`, this._language);
    } else this._language = lang;
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (): Storage => new Storage();

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get language(): string {
    return this._language;
  }

  get save_data(): any {
    return this._save_data;
  }

  // SETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  set language(lang: string) {
    this._language = lang;
    localStorage.setItem(`${this._storage_prefix}_language`, lang);
  }
}
