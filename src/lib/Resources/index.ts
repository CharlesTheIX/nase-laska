import Storage from "@/lib/Storage";
import ErrorHandler from "@/lib/ErrorHandler";
import { init_image_srcs, init_audio_srcs } from "./_data";

type JsonResource<T = any> = { loaded: boolean; json: T | null };
type ImageResource = { loaded: boolean; image: HTMLImageElement };
type AudioResource = { loaded: boolean; audio: HTMLAudioElement; duration: number };

export default class Resources {
  private _storage: Storage;
  private _count: number = 0;
  private _loading_elmt: HTMLDivElement;
  private _progress_elmt: HTMLDivElement;
  private _loading_transition_duration = 600;
  private _jsons: { [key: string]: JsonResource | null } = {};
  private _images: { [key: string]: ImageResource | null } = {};
  private _audios: { [key: string]: AudioResource | null } = {};
  private _image_srcs: { [key: string]: string } = { ...init_image_srcs };
  private _audio_srcs: { [key: string]: string } = { ...init_audio_srcs };

  private constructor(storage: Storage) {
    this._storage = storage;
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
        audio.src = this.audio_srcs[key];
        if (key === "music") audio.volume = this._storage.settings_data.music_volume / 10;
        else audio.volume = this._storage.settings_data.sfx_volume / 10;

        this.audios[key] = { audio, loaded: false, duration: 0 };
        audio.oncanplaythrough = () => {
          (this.audios[key] as AudioResource).loaded = true;
          (this.audios[key] as AudioResource).duration = audio.duration;
        };
      });
    } catch (err: any) {
      const msg = `Resources initialization error: ${err.message}`;
      ErrorHandler.fatal(msg);
      throw new Error(msg);
    }
  }

  // STATICS ----------------------------------------------------------------------------------------------------------------------------------------
  public static init = (storage: Storage): Resources => new Resources(storage);

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
    this._audios = {};
    this._image_srcs = {};
    this._audio_srcs = {};
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

  public playAudio = (key: string, loop: boolean = false): void => {
    const audioResource = this._audios[key];
    if (audioResource && audioResource.loaded) {
      audioResource.audio.loop = loop;
      audioResource.audio.currentTime = 0;
      audioResource.audio.play().catch((err) => ErrorHandler.warn(`Failed to play audio "${key}": ${err.message}`));
    }
  };

  public pauseAudio = (key: string): void => {
    const audioResource = this._audios[key];
    if (audioResource && audioResource.loaded) audioResource.audio.pause();
  };

  public stopAudio = (key: string): void => {
    const audioResource = this._audios[key];
    if (audioResource && audioResource.loaded) {
      audioResource.audio.pause();
      audioResource.audio.currentTime = 0;
    }
  };

  public setAudioVolume = (volume: number, music: boolean = true): void => {
    if (music) {
      const audioResource = this._audios["music"];
      if (!audioResource || !audioResource.loaded) return;

      audioResource.audio.volume = volume;
      this.storage.settings_data = { music_volume: Math.round(volume * 10) };
      return;
    }

    Object.keys(this.audios).forEach((key: string) => {
      if (key === "music") return;
      const audioResource = this._audios[key];

      if (!audioResource || !audioResource.loaded) return;
      audioResource.audio.volume = volume;
    });

    this.storage.settings_data = { sfx_volume: Math.round(volume * 10) };
  };

  public unloadJson = (key: string): void => {
    if (this._jsons[key]) this._jsons[key] = null;
  };
}
