import { tile_size } from "@/lib/globals";
import Player from "@/lib/classes/Player";
import Sprite from "@/lib/classes/Sprite";
import Emotion from "@/lib/classes/Emotion";
import Vector2 from "@/lib/classes/Vector2";
import Rectangle from "@/lib/classes/Rectangle";
import applyCameraVectorTranslation from "@/lib/helpers/applyCameraVectorTranslation";

export default class Animal {
  sprite: Sprite;
  emotion: Emotion;
  max_speed: number;
  velocity: Vector2;
  position: Vector2;
  animating: boolean;
  frame_index: number;
  direction: Direction;
  is_follower: boolean;
  state: CharacterState;
  dest_position: Vector2;
  frame_index_count: number;
  animation_timers: { [key: string]: { count: number; timeout: number } };

  private constructor(a: Partial<IAnimal>) {
    this.max_speed = 0;
    this.state = "walking";
    this.frame_index = 0;
    this.frame_index_count = 0;
    this.velocity = Vector2.zero();
    this.animating = a.animating ?? false;
    this.direction = a.direction ?? "down";
    this.is_follower = a.is_follower ?? false;
    this.position = a.position ?? Vector2.zero();
    this.emotion = Emotion.init("blank_1", false);
    this.sprite = Sprite.init("animal", a.sprite_name ?? "cat");
    this.animation_timers = { walking: { count: 0, timeout: 60 } };
    this.dest_position = a.dest_position ?? this.position.duplicate();
  }

  static init = (a: Partial<IAnimal>): Animal => new Animal(a);

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
        switch (this.direction) {
          case "up":
          case "down":
            r_dest.y -= tile_size;
            break;
          case "left":
            r_dest.x += tile_size;
            break;
          case "right":
            r_dest.x -= tile_size;
            break;
        }
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

  public update = (p: Player, time_step: number): void => {
    if (this.is_follower) {
      // if (p.character.state !== "walking") return;
      if (p.character.position === this.position) return;
      this.state = p.character.state;
      this.velocity = p.character.velocity;
      this.direction = p.character.direction;
      this.position = p.character.position.duplicate();

      switch (this.direction) {
        case "up":
          this.position.y += tile_size;
          break;
        case "down":
          this.position.y -= tile_size;
          break;
        case "left":
          this.position.x += tile_size;
          break;
        case "right":
          this.position.x -= tile_size;
          break;
      }

      this.updateFrame(time_step);
    }
  };

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
