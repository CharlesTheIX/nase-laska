import Vector2 from "@/lib/classes/Vector2";
import Character from "@/lib/classes/Character";
import { player_movement_type, tile_size } from "@/lib/globals";
import updatePlayerDestinationPosition from "./helpers/updatePlayerDestinationPosition";
import { getMapEdgeCollision, getMapCollisions } from "@/lib/classes/Character/helpers/handleCollisions";

export default class Player {
  position: IVector2;
  character: Character;

  private constructor(p: IPlayer) {
    this.position = Vector2.init(p.position.x, p.position.y);
    this.character = Character.init({
      animating: false,
      position: this.position,
      sprite_name: p.sprite_name
    });
  }

  static init = (p: IPlayer): Player => new Player(p);

  public update = (props: PlayerUpdateProps): void => {
    const { time_step, input_handler, map } = props;
    this.character.emotion.update(time_step);
    this.character.max_speed = Math.ceil((tile_size * 20) / time_step);
    if (this.character.animating && player_movement_type === "tiled") {
      this.character.moveToDestination();
      this.character.updateFrame(time_step);
    } else {
      this.character.velocity = Vector2.zero();
      updatePlayerDestinationPosition({
        time_step,
        input_handler,
        character: this.character,
        type: player_movement_type
      });

      this.character.updateFrame(time_step);
      if (getMapEdgeCollision(this.character, map) || getMapCollisions(this.character, map)) {
        this.character.dest_position = this.character.position.duplicate();
      }
      if (player_movement_type === "tiled") return;
      this.character.position = this.character.dest_position.duplicate();
    }
  };
}
