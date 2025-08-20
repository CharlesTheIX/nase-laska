import { getEmotionSpriteData } from "@/lib/classes/Sprite/helpers/getCharacterSprite";

export default class Emotion {
  timer: number;
  t_pos: IVector2;
  visible: boolean;

  constructor() {
    this.timer = 0;
    this.visible = false;
    this.t_pos = { x: 16, y: 3 };
  }

  static init = (name: string, visible?: boolean): Emotion => {
    const emotion = new Emotion();
    const emotion_sprite_data: EmotionData = getEmotionSpriteData(name);
    emotion.visible = !!visible;
    emotion.t_pos = emotion_sprite_data.sprite_px_position;
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
    const emotion_sprite_data: EmotionData = getEmotionSpriteData(name);
    this.visible = false;
    this.t_pos = emotion_sprite_data.sprite_px_position;
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
