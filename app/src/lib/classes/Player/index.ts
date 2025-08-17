import Camera from "@/lib/classes/Camera";
import Vector2 from "@/lib/classes/Vector2";
import Character from "@/lib/classes/Character";
import { player_movement_type } from "@/lib/globals";
import { KeySetMap, getInputKeySets } from "@/lib/inputKeys";
import updatePlayerDestinationPosition from "./helpers/updatePlayerDestinationPosition";
import { getMapEdgeCollision, getMapCollisions } from "@/lib/classes/Character/helpers/handleCollisions";

export interface IPlayer {
  camera: Camera;
  sprite_name?: string;
  character?: Character;
}

export default class Player {
  camera: Camera;
  character: Character;

  private constructor(p: IPlayer) {
    this.camera = p.camera;
    this.character = Character.init({
      animating: false,
      sprite_name: p.sprite_name ?? "david",
      position: this.camera.center_position
    });
  }

  static init = (p: IPlayer): Player => new Player(p);

  public update = (props: PlayerUpdateProps): void => {
    const { time_step, input_handler, map } = props;

    if (this.character.input_timeout > 0) {
      this.character.input_timeout -= time_step;
      return;
    }

    switch (player_movement_type) {
      case "tiled":
        if (this.character.animating) {
          this.character.moveToDestination();
          return;
        }
    }

    this.character.input_timeout = 0;
    this.character.velocity = Vector2.zero();
    const key_sets: KeySetMap = getInputKeySets();
    this.character.max_speed = Math.ceil(16 / time_step);
    if ([...input_handler.keys].some((key) => key_sets.run.has(key))) this.character.max_speed *= 4;

    updatePlayerDestinationPosition({
      time_step,
      input_handler,
      character: this.character,
      type: player_movement_type
    });

    if (getMapEdgeCollision(this.character, map) || getMapCollisions(this.character, map)) {
      this.character.dest_position = this.character.position.duplicate();
      return;
    }

    switch (player_movement_type) {
      case "tiled":
        return;
      default:
        this.character.position = this.character.dest_position.duplicate();
    }
  };

  public updateFrame = (): void => {
    switch (this.character.state) {
      case "idle":
        this.character.frame_index = 0;
        break;
      case "walking":
        if (!this.character.sprite.frame_sets) break;
        var next_frame: number = this.character.frame_index + 1;
        if (next_frame >= this.character.sprite.frame_sets[this.character.state].frame_count) next_frame = 0;
        this.character.frame_index = next_frame;
        break;
    }
  };
}
