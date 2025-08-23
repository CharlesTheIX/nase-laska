import { getEmotionSpriteData } from "@/lib/classes/Sprite/helpers/getSprite";
import Sprite from "./Sprite";

export default class Emotion {
  timer: number;
  sprite: Sprite;
  visible: boolean;

  constructor() {
    this.timer = 0;
    this.visible = false;
    this.sprite = Sprite.empty();
  }

  static init = (name: string, visible?: boolean): Emotion => {
    const emotion = new Emotion();
    emotion.visible = !!visible;
    emotion.sprite = getEmotionSpriteData(name);
    return emotion;
  };

  public hide = (): this => {
    this.visible = false;
    return this;
  };

  public show = (): this => {
    this.visible = true;
    return this;
  };

  public setEmotionData = (name: string): this => {
    this.visible = false;
    this.sprite = getEmotionSpriteData(name);
    return this;
  };

  public setTimer = (count: number): this => {
    this.timer = count;
    this.visible = true;
    if (this.timer > 0) return this;
    this.timer = 0;
    this.visible = false;
    return this;
  };

  public update = (time_step: number): void => {
    if (!this.timer) return;
    this.timer -= time_step;
    if (this.timer <= 0) {
      this.timer = 0;
      this.visible = false;
      return;
    }
  };
}
