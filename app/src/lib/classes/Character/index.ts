import Map from "@/lib/classes/Map";
import Camera from "@/lib/classes/Camera";
import Canvas from "@/lib/classes/Canvas";
import Sprite from "@/lib/classes/Sprite";
import Emotion from "@/lib/classes/Emotion";
import Vector2 from "@/lib/classes/Vector2";
import Rectangle from "@/lib/classes/Rectangle";
import { tile_size, canvas_size } from "@/lib/globals";
import { convertTileToIRectangle } from "@/lib/converters";

export default class Character {
  sprite: Sprite;
  emotion: Emotion;
  max_speed: number;
  velocity: Vector2;
  position: Vector2;
  animating: boolean;
  frame_index: number;
  direction: Direction;
  state: CharacterState;
  dest_position: Vector2;
  animation_timers: { [key: string]: { count: number; timeout: number } };

  private constructor(c: ICharacter) {
    this.max_speed = 0;
    this.state = "idle";
    this.frame_index = 0;
    this.velocity = Vector2.zero();
    this.animating = c.animating ?? false;
    this.direction = c.direction ?? "down";
    this.position = c.position ?? Vector2.zero();
    this.emotion = Emotion.init("blank_2", false);
    this.animation_timers = { walking: { count: 0, timeout: 60 } };
    this.dest_position = c.dest_position ?? this.position.duplicate();
    this.sprite = Sprite.init({ name: c.sprite_name, type: "character" });
  }

  static init = (c: ICharacter): Character => new Character(c);

  public drawLayer = (
    layer: SpriteFrameName,
    canvas: Canvas,
    spritesheet: HTMLImageElement,
    camera: Camera,
    map: Map
  ): void => {
    if (!this.sprite.frame_sets) return;

    var r_src: IRectangle;
    var src_frame: IRectangle;
    const v_dest: Vector2 = this.position.duplicate();
    t_layer(v_dest, camera, map);
    var r_dest: IRectangle = Rectangle.tile(v_dest).value;
    switch (layer) {
      case "lower":
        src_frame = this.sprite.frame_sets[this.state].frames[this.direction].lower[this.frame_index];
        r_src = convertTileToIRectangle(src_frame);
        canvas.drawImage(spritesheet, r_src, r_dest);
        break;
      case "upper":
        r_dest.y -= tile_size.h;
        src_frame = this.sprite.frame_sets[this.state].frames[this.direction].upper[this.frame_index];
        r_src = convertTileToIRectangle(src_frame);
        canvas.drawImage(spritesheet, r_src, r_dest);
        break;
      case "emotion":
        if (!this.emotion.visible) break;
        r_dest.y -= tile_size.h;
        r_src = { w: tile_size.w, h: tile_size.h, x: this.emotion.t_pos.x, y: this.emotion.t_pos.y };
        canvas.drawImage(spritesheet, r_src, r_dest);
        break;
    }
  };

  public drawDestination = (canvas: Canvas): void => {
    const r_dest: IRectangle = { ...this.dest_position.value, ...tile_size };
    canvas.drawRectangle({ rectangle: r_dest });
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

  public updateFrame = (time_step: number): void => {
    switch (this.state) {
      case "idle":
        this.frame_index = 0;
        break;

      case "walking":
        if (!this.sprite.frame_sets) break;
        this.animation_timers.walking.count += this.velocity.length * time_step;
        if (this.animation_timers.walking.count < this.animation_timers.walking.timeout) return;
        this.animation_timers.walking.count = 0;
        var next_frame: number = this.frame_index + 1;
        if (next_frame >= this.sprite.frame_sets[this.state].frame_count) next_frame = 0;
        this.frame_index = next_frame;
        break;
    }
  };
}

const t_layer = (v: Vector2, c: Camera, m: Map): void => {
  var v_t = Vector2.init(canvas_size.w / 2 / c.scale, canvas_size.h / 2 / c.scale);
  v_t = Vector2.subtract(c.position, v_t);
  if (v_t.x < 0) v.x += v_t.x;
  if (v_t.y < 0) v.y += v_t.y;
  if (v_t.x > m.size.w - canvas_size.w / c.scale) v.x += v_t.x - (m.size.w - canvas_size.w / c.scale);
  if (v_t.y > m.size.h - canvas_size.h / c.scale) v.y += v_t.y - (m.size.h - canvas_size.h / c.scale);
};
