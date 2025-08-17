/* P */
type PlayerMovementType = "mono" | "omni" | "tiled";
type PlayerUpdateProps = { time_step: number; input_handler: InputHandler; map: Map };
