export default class Storage {
  map_data: any;
  player_save_state: Partial<SaveData>;
  player_temp_state: Partial<SaveData>;

  constructor() {
    this.map_data = {};
    this.player_save_state = {};
    this.player_temp_state = {};
  }

  static init = (): Storage => {
    const s = new Storage();
    const d = this.getStorageData();
    s.player_save_state = d;
    s.player_temp_state = d;
    return s;
  };

  static defaultStorageData = {
    time_played: 0,
    inventory: null,
    map_name: "test_2",
    sprite_name: "pavla",
    position: { x: 144, y: 96 }
  };

  private static getStorageData = (): Partial<SaveData> => {
    const d_string = localStorage.getItem(`${process.env.STORAGE_KEY}`);
    if (!d_string) return this.defaultStorageData;
    try {
      return JSON.parse(d_string);
    } catch (error: any) {
      return this.defaultStorageData;
    }
  };

  public savePlayerTempData = (): void => {
    localStorage.setItem(`${process.env.STORAGE_KEY}`, JSON.stringify(this.player_temp_state));
    this.player_save_state = { ...this.player_temp_state };
  };

  public updatePlayerTempData = (update: Partial<SaveData>) => {
    this.player_temp_state = { ...this.player_temp_state, ...update };
  };
}
