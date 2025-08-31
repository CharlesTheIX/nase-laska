import Character from "@/lib/classes/Character";
import InputHandler from "@/lib/classes/InputHandler";
import { tile_size, player_movement_type } from "@/lib/globals";
import { getInputKeySets, getMovementKeys } from "@/lib/inputKeys";

export default (time_step: number, input_handler: InputHandler, character: Character): void => {
  var state: CharacterState = "idle";
  const key_sets: KeySetMap = getInputKeySets();
  var direction: Direction = character.direction;
  const last_key: string = input_handler.last_key;
  const movement_key_pressed: boolean = [...input_handler.keys].some((key) => getMovementKeys().has(key));

  if (movement_key_pressed) state = "walking";
  if (key_sets.up.has(last_key)) direction = "up";
  else if (key_sets.down.has(last_key)) direction = "down";
  else if (key_sets.left.has(last_key)) direction = "left";
  else if (key_sets.right.has(last_key)) direction = "right";

  if (character.direction !== direction) {
    character.input_timer.start();
  } else {
    switch (player_movement_type) {
      case "omni":
        if ([...input_handler.keys].some((key) => key_sets.up.has(key))) character.velocity.y = -character.max_speed;
        if ([...input_handler.keys].some((key) => key_sets.down.has(key))) character.velocity.y = character.max_speed;
        if ([...input_handler.keys].some((key) => key_sets.left.has(key))) character.velocity.x = -character.max_speed;
        if ([...input_handler.keys].some((key) => key_sets.right.has(key))) character.velocity.x = character.max_speed;
        if (character.velocity.length > character.max_speed) character.velocity.normalize;
        character.dest_position.add(character.velocity);
        break;

      case "mono":
        if (key_sets.up.has(last_key)) character.velocity.y = -character.max_speed / time_step;
        else if (key_sets.down.has(last_key)) character.velocity.y = character.max_speed / time_step;
        else if (key_sets.left.has(last_key)) character.velocity.x = -character.max_speed / time_step;
        else if (key_sets.right.has(last_key)) character.velocity.x = character.max_speed / time_step;
        character.dest_position.add(character.velocity);
        break;

      case "tiled":
        if (character.direction === direction) {
          if (movement_key_pressed) {
            character.animating = true;

            if (key_sets.up.has(last_key)) {
              character.velocity.y = -character.max_speed;
              character.dest_position.y -= tile_size;
            } else if (key_sets.down.has(last_key)) {
              character.velocity.y = character.max_speed;
              character.dest_position.y += tile_size;
            } else if (key_sets.left.has(last_key)) {
              character.velocity.x = -character.max_speed;
              character.dest_position.x -= tile_size;
            } else if (key_sets.right.has(last_key)) {
              character.velocity.x = character.max_speed;
              character.dest_position.x += tile_size;
            }
          }
        }
        break;
    }
  }

  character.state = state;
  character.direction = direction;
};
