import { readFileSync, writeFileSync } from "fs";

const convertTiledJsonToMapJson = (input_file_path, output_file_path) => {
  const raw = readFileSync(input_file_path, "utf8");
  const data = JSON.parse(raw);

  const m_w = data.width;
  const m_h = data.height;
  const t_size = data.tilewidth;
  const target_layer_group_names = ["collision"];
  const map_json = {
    layers: {},
    size_tiles: { x: m_w, y: m_h},
    size_px: { x: m_w * t_size, y: m_h * t_size }
  };
  const layer_groups = data.layers.filter((layer_group) => {
    if (target_layer_group_names.includes(layer_group.name)) return layer_group;
  });

  layer_groups.map((layer_group) => {
    const layers = [];
    layer_group.layers.map((layer) => {
      const tiles = [];

      layer.data.map((tile, index) => {
        if (tile === 0) return;
        const col = index % m_w;
        const row = Math.floor(index / m_w);
        const t = {
          spritesheet_index: tile,
          tile_position: { x: col, y: row },
          px_position: { x: col * t_size, y: row * t_size },
        };
        tiles.push(t);
      });

      layers.push(tiles);
    });

    map_json.layers[layer_group.name] = layers;
  });
  
  writeFileSync(output_file_path, JSON.stringify(map_json, null, 2), "utf8");
};

convertTiledJsonToMapJson("../project_files/dev/test_1.json", "./src/lib/data/maps/test_1.json");