import { loading_element_data, spritesheet_srcs } from "@/lib/globals";

export default class Resources {
  count: number;
  loading_element: HTMLDivElement;
  progress_element: HTMLDivElement;
  image_srcs: { [key: string]: string };
  images: { [key: string]: ImageResource | null };

  private constructor() {
    this.count = 0;
    this.images = {};
    this.image_srcs = { spritesheet: spritesheet_srcs.png, map: "./assets/maps/test_2.png" };
    this.loading_element = document.getElementById(loading_element_data.id) as HTMLDivElement;
    this.progress_element = document.getElementById(loading_element_data.progress_bar_id) as HTMLDivElement;

    Object.keys(this.image_srcs).forEach((key: string) => {
      this.count++;
      if (!this.image_srcs[key]) return;
      const image = new Image();
      image.src = this.image_srcs[key];
      this.images[key] = { image, loaded: false };
      image.onload = () => {
        (this.images[key] as ImageResource).loaded = true;
      };
    });
  }

  static init = (): Resources => new Resources();

  public drawLoadingScreen = (): void => {
    this.loading_element.classList.add("showing");
    this.loading_element.classList.remove("hidden");
    setTimeout(() => {
      this.loading_element.classList.remove("showing");
    }, loading_element_data.transition_time * 2);
  };

  public clearLoadingScreen = (): void => {
    this.loading_element.classList.add("hiding");
    setTimeout(() => {
      this.loading_element.classList.add("hidden");
      this.loading_element.classList.remove("hiding");
      this.progress_element.style.width = "";
    }, loading_element_data.transition_time * 2);
  };
}
