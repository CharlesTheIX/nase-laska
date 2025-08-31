import Game from "@/lib/classes/Game";
import Vector2 from "@/lib/classes/Vector2";
import Character from "@/lib/classes/Character";
import Inventory from "@/lib/classes/Inventory";
import RespawnItem from "@/lib/classes/Items/RespawnItem";
import { player_movement_type, tile_size } from "@/lib/globals";
import updatePlayerAction from "@/lib/helpers/updatePlayerAction";
import getInventoryItemData from "@/lib/helpers/getInventoryItemData";
import updatePlayerDestinationPosition from "@/lib/helpers/updatePlayerDestinationPosition";
import { getCharacterMapCollisions, getCharacterMapEdgeCollision } from "@/lib/helpers/handleCharacterCollisions";

export default class Player {
  name: string;
  game_speed: number;
  character: Character;
  inventory: Inventory;

  private constructor(p: IPlayer) {
    this.game_speed = 1;
    this.name = p.sprite_name;
    this.inventory = Inventory.init(p.inventory);
    this.character = Character.init({
      animating: false,
      sprite_name: p.sprite_name,
      position: Vector2.init(p.position.x, p.position.y)
    });
  }

  static init = (p: IPlayer): Player => new Player(p);

  public update = (time_step: number, game: Game): void => {
    if (!game.map) return;
    this.character.input_timer.update(time_step);
    this.character.emotion.update(time_step);
    if (!this.character.input_timer.complete) return this.character.updateFrame(time_step);

    this.character.max_speed = Math.ceil((tile_size * this.game_speed) / time_step);
    if (this.character.animating && player_movement_type === "tiled") {
      this.character.moveToDestination();
      return this.character.updateFrame(time_step);
    }

    this.character.velocity = Vector2.zero();
    const item = updatePlayerAction(this.character, game.map, game.input_handler);
    if (item.item && game.message_screen) {
      switch (item.type) {
        case "static":
          this.character.emotion.setEmotionData("speaking");
          break;
        case "respawn":
          const respawn_item = item.item as RespawnItem;
          respawn_item.hidden = true;
          respawn_item.collected_at = Date.now();
          this.character.emotion.setEmotionData("pleased");
          const inventory_item_data = getInventoryItemData(respawn_item.item_name);
          if (inventory_item_data) this.inventory.addItem(inventory_item_data);
          break;
        default:
          return;
      }

      game.state = "message";
      game.input_timer.start();
      this.character.emotion.show();
      game.message_screen.message = item.item.message;
    }

    this.character.updateFrame(time_step);
    updatePlayerDestinationPosition(time_step, game.input_handler, this.character);
    const has_map_collision = getCharacterMapCollisions(this.character, game.map);
    const has_map_edge_collision = getCharacterMapEdgeCollision(this.character, game.map);
    if (has_map_collision || has_map_edge_collision) this.character.dest_position = this.character.position.duplicate();
    if (player_movement_type === "tiled") return;
    this.character.position = this.character.dest_position.duplicate();
  };
}
