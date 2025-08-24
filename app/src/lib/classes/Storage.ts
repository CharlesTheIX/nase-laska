type SaveData = {
  map_name: string;
  position: IVector2;
  sprite_name: string;
  time_played: number;
};
type StorageData = {
  save_data: Partial<SaveData>;
};

export default class Storage {
  data: Partial<StorageData>;
  temp: Partial<StorageData>;

  constructor() {
    this.data = {};
    this.temp = {};
  }

  static init = (): Storage => {
    const s = new Storage();
    const d = this.getStorageData();
    s.data = d;
    s.temp = d;
    return s;
  };

  static defaultStorageData = {
    save_data: {
      position: { x: 144, y: 96 },
      sprite_name: "pavla",
      map_name: "test_2",
      time_played: 0
    }
  };

  private static getStorageData = (): Partial<StorageData> => {
    const d_string = localStorage.getItem(`${process.env.STORAGE_KEY}`);
    if (!d_string) return this.defaultStorageData;
    try {
      const data = JSON.parse(d_string);
      return data;
    } catch (error: any) {
      return this.defaultStorageData;
    }
  };

  public saveTempData = () => {
    try {
      localStorage.setItem(`${process.env.STORAGE_KEY}`, JSON.stringify(this.temp));
      this.data = { ...this.temp };
    } catch (error: any) {}
  };

  public updateSaveData = (update: Partial<SaveData>) => {
    this.temp.save_data = { ...this.temp.save_data, ...update };
  };
}
