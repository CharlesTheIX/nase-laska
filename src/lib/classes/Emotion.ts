import Sprite from "@/lib/classes/Sprite";
import { tile_size } from "@/lib/globals";
import Vector2 from "@/lib/classes/Vector2";
import Rectangle from "@/lib/classes/Rectangle";
import getEmotionSpriteData from "@/lib/helpers/getEmotionSpriteData";
import applyCameraVectorTranslation from "@/lib/helpers/applyCameraVectorTranslation";

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

  public draw = (props: DrawEmotionProps): void => {
    const { canvas, spritesheet, camera, m_size, position } = props;
    if (!this.sprite.srcs) return;

    var r_src: IRectangle;
    var src_pos: IVector2;
    const v_dest: Vector2 = position.duplicate();
    applyCameraVectorTranslation({ type: "layer", camera, v: v_dest, m_size });
    var r_dest: IRectangle = Rectangle.tile(v_dest).value;

    if (!this.visible || !this.sprite.srcs) return;
    r_dest.y -= tile_size;
    src_pos = this.sprite.srcs[0];
    r_src = { w: tile_size, h: tile_size, x: src_pos.x, y: src_pos.y };
    canvas.drawImage(spritesheet, r_src, r_dest);
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
    }
  };
}
