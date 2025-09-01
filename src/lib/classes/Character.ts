import Timer from "@/lib/classes/Timer";
import { tile_size } from "@/lib/globals";
import Sprite from "@/lib/classes/Sprite";
import Emotion from "@/lib/classes/Emotion";
import Vector2 from "@/lib/classes/Vector2";
import Rectangle from "@/lib/classes/Rectangle";
import applyCameraVectorTranslation from "@/lib/helpers/applyCameraVectorTranslation";

export default class Character {
  sprite: Sprite;
  emotion: Emotion;
  max_speed: number;
  velocity: Vector2;
  position: Vector2;
  input_timer: Timer;
  animating: boolean;
  frame_index: number;
  direction: Direction;
  state: CharacterState;
  dest_position: Vector2;
  frame_index_count: number;
  animation_timers: { [key: string]: { count: number; timeout: number } };

  private constructor(c: Partial<ICharacter>) {
    this.max_speed = 0;
    this.state = "idle";
    this.frame_index = 0;
    this.frame_index_count = 0;
    this.velocity = Vector2.zero();
    this.animating = c.animating ?? false;
    this.direction = c.direction ?? "down";
    this.position = c.position ?? Vector2.zero();
    this.emotion = Emotion.init("blank_1", false);
    this.input_timer = Timer.init("count_down", 0);
    this.animation_timers = { walking: { count: 0, timeout: 60 } };
    this.sprite = Sprite.init("character", c.sprite_name ?? "pavla");
    this.dest_position = c.dest_position ?? this.position.duplicate();
  }

  static init = (c: Partial<ICharacter>): Character => new Character(c);

  public drawLayer = (props: DrawCharacterLayerProps): void => {
    const { layer, canvas, spritesheet, camera, m_size } = props;
    if (!this.sprite.srcs) return;

    var r_src: IRectangle;
    var src_pos: IVector2;
    const v_dest: Vector2 = this.position.duplicate();
    applyCameraVectorTranslation({ type: "layer", camera, v: v_dest, m_size });
    var r_dest: IRectangle = Rectangle.tile(v_dest).value;

    switch (layer) {
      case "lower":
        src_pos = this.sprite.srcs[this.frame_index + 16];
        break;
      case "upper":
        r_dest.y -= tile_size;
        src_pos = this.sprite.srcs[this.frame_index];
        break;
    }

    r_src = { w: tile_size, h: tile_size, x: src_pos.x, y: src_pos.y };
    canvas.drawImage(spritesheet, r_src, r_dest);
  };

  public moveToDestination = (): void => {
    var distance = Vector2.subtract(this.dest_position, this.position);
    if (distance.length <= this.velocity.length) {
      this.state = "idle";
      this.animating = false;
      this.animation_timers.walking.count = 0;
      this.position = this.dest_position.duplicate();
      return;
    }

    var normal = Vector2.normalize(distance);
    normal = Vector2.scale(normal, this.velocity.length);
    this.position.add(normal);
  };

  public update = (): void => {};

  public updateFrame = (time_step: number): void => {
    var offset: number = 0;
    switch (this.direction) {
      case "up":
        offset = 4;
        break;
      case "down":
        offset = 0;
        break;
      case "left":
        offset = 8;
        break;
      case "right":
        offset = 12;
        break;
    }

    switch (this.state) {
      case "idle":
        this.frame_index = offset;
        this.frame_index_count = 0;
        break;

      case "walking":
        if (!this.sprite.srcs) break;
        this.animation_timers.walking.count += this.velocity.length * time_step;
        if (this.animation_timers.walking.count < this.animation_timers.walking.timeout) break;
        this.animation_timers.walking.count = 0;

        this.frame_index_count += 1;
        this.frame_index = offset + this.frame_index_count;
        if (this.frame_index_count % 4 === 0) {
          this.frame_index = offset;
          this.frame_index_count = 0;
        }
        break;
    }
  };
}
