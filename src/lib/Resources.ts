import ErrorHandler from "./ErrorHandler";

type JsonResource<T = any> = { loaded: boolean; json: T | null };
type ImageResource = { loaded: boolean; image: HTMLImageElement };
type AudioResource = { loaded: boolean; audio: HTMLAudioElement };

const init_image_srcs = {
  spritesheet: "./assets/images/spritesheet.webp",
  start_screen: "./assets/images/start-screen/background.png",
  settings_screen: "./assets/images/settings-screen/background.png",
};

const init_audio_srcs: { [key: string]: string } = {};

export default class Resources {
  private _count: number = 0;
  private _storage: any | null;
  private _loading_elmt: HTMLDivElement;
  private _progress_elmt: HTMLDivElement;
  private _loading_transition_duration = 600;
  private _image_srcs: { [key: string]: string };
  private _audio_srcs: { [key: string]: string } = {};
  private _jsons: { [key: string]: JsonResource | null } = {};
  private _images: { [key: string]: ImageResource | null } = {};
  private _audios: { [key: string]: AudioResource | null } = {};

  private constructor(storage?: any) {
    this._storage = storage || null;
    this._audio_srcs = { ...init_audio_srcs };
    this._image_srcs = { ...init_image_srcs };
    this._loading_elmt = document.getElementById(`loading`) as HTMLDivElement;
    this._progress_elmt = document.getElementById(`progress`) as HTMLDivElement;

    try {
      Object.keys(this.image_srcs).forEach((key: string) => {
        if (!this.image_srcs[key]) return;
        this._count++;
        const image = new Image();
        image.src = this.image_srcs[key];
        this.images[key] = { image, loaded: false };
        image.onload = () => {
          (this.images[key] as ImageResource).loaded = true;
        };
      });

      Object.keys(this.audio_srcs).forEach((key: string) => {
        if (!this.audio_srcs[key]) return;
        this._count++;
        const audio = new Audio();
        audio.src = this.image_srcs[key];
        this.audios[key] = { audio, loaded: false };
        audio.onload = () => {
          (this.audios[key] as AudioResource).loaded = true;
        };
      });
    } catch (err: any) {
      const msg = `Resources initialization error: ${err.message}`;
      ErrorHandler.fatal(msg);
      throw new Error(msg);
    }
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage?: any): Resources => new Resources(storage);

  // GETTERS -----------------------------------------------------------------------------------------------------------------------------------------
  get audios(): { [key: string]: AudioResource | null } {
    return this._audios;
  }

  get audio_srcs(): { [key: string]: string } {
    return this._audio_srcs;
  }

  get count(): number {
    return this._count;
  }

  get images(): { [key: string]: ImageResource | null } {
    return this._images;
  }

  get jsons(): { [key: string]: JsonResource | null } {
    return this._jsons;
  }

  get image_srcs(): { [key: string]: string } {
    return this._image_srcs;
  }

  get loading_elmt(): HTMLDivElement {
    return this._loading_elmt;
  }

  get loading_transition_duration(): number {
    return this._loading_transition_duration;
  }

  get progress_elmt(): HTMLDivElement {
    return this._progress_elmt;
  }

  get storage(): any | null {
    return this._storage;
  }

  // METHODS ----------------------------------------------------------------------------------------------------------------------------------------
  public clearLoadingScreen = (): void => {
    this.loading_elmt.classList.add("hiding");
    setTimeout(() => {
      this.progress_elmt.style.width = "";
      this.loading_elmt.classList.add("hidden");
      this.loading_elmt.classList.remove("hiding");
    }, this.loading_transition_duration);
  };

  public deinit = (): void => {
    this._count = 0;
    this._jsons = {};
    this._images = {};
    this._storage = null;
    this._image_srcs = {};
    this._loading_elmt = null as any;
    this._progress_elmt = null as any;
  };

  public drawLoadingScreen = (): void => {
    this.loading_elmt.classList.add("showing");
    this.loading_elmt.classList.remove("hidden");
    setTimeout(() => {
      this.loading_elmt.classList.remove("showing");
    }, this.loading_transition_duration);
  };

  public loadJson = async <T = any>(key: string, src: string): Promise<T> => {
    if (this._jsons[key]?.loaded) return this._jsons[key]!.json as T;
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json: T = await res.json();
      this._jsons[key] = { loaded: true, json };
      return json;
    } catch (err: any) {
      const msg = `Failed to load JSON resource "${key}" from "${src}": ${err.message}`;
      ErrorHandler.fatal(msg);
      throw new Error(msg);
    }
  };

  public unloadJson = (key: string): void => {
    if (this._jsons[key]) this._jsons[key] = null;
  };
}
