import Vector2 from "@/lib/classes/Vector2";
import Character from "@/lib/classes/Character";
// import { getInputKeySets } from "@/lib/inputKeys";
import { player_movement_type, tile_size } from "@/lib/globals";
import updatePlayerDestinationPosition from "./helpers/updatePlayerDestinationPosition";
import { getMapEdgeCollision, getMapCollisions } from "@/lib/classes/Character/helpers/handleCollisions";

export default class Player {
  character: Character;

  private constructor(p: IPlayer) {
    this.character = Character.init({
      animating: false,
      sprite_name: p.sprite_name ?? "david",
      position: Vector2.init(22 * tile_size.w, 16 * tile_size.h)
    });
  }

  static init = (p: IPlayer): Player => new Player(p);

  public update = (props: PlayerUpdateProps): void => {
    const { time_step, input_handler, map } = props;
    this.character.emotion.update(time_step);
    this.character.max_speed = Math.ceil(tile_size.w / time_step);
    // const key_sets: KeySetMap = getInputKeySets();
    // if ([...input_handler.keys].some((key) => key_sets.run.has(key))) this.character.velocity.scale(2);
    // if (this.character.input_timeout > 0) {
    //   this.character.input_timeout -= time_step;
    //   return;
    // }

    // this.character.input_timeout = 0;
    if (this.character.animating && player_movement_type === "tiled") {
      this.character.moveToDestination();
      this.character.updateFrame(time_step);
      return;
    }

    this.character.velocity = Vector2.zero();
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

    if (player_movement_type === "tiled") return;
    this.character.updateFrame(time_step);
    this.character.position = this.character.dest_position.duplicate();
  };
}
