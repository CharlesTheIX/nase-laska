export const getInputKeys = (): Set<string> => {
  const input_key_set: Set<string> = new Set();
  const input_key_sets: KeySetMap = getInputKeySets();
  Object.values(input_key_sets).map((keys: Set<string>) => {
    for (const key of keys.keys()) input_key_set.add(key);
  });
  return input_key_set;
};

export const getInputKeySets = (): KeySetMap => {
  return {
    dev: new Set<string>().add("z"),
    run: new Set<string>().add("Shift"),
    settings: new Set<string>().add("p").add("P"),
    inventory: new Set<string>().add("i").add("I"),
    action: new Set<string>().add(" ").add("Enter"),
    up: new Set<string>().add("w").add("W").add("ArrowUp"),
    down: new Set<string>().add("s").add("S").add("ArrowDown"),
    left: new Set<string>().add("a").add("A").add("ArrowLeft"),
    right: new Set<string>().add("d").add("D").add("ArrowRight")
  };
};

export const getMovementKeys = (): Set<string> => {
  const movement_keys: Set<string> = new Set();
  const input_key_sets: KeySetMap = getInputKeySets();
  const movement_set_names: string[] = ["up", "down", "left", "right"];
  Object.keys(input_key_sets).map((name: string) => {
    if (movement_set_names.includes(name)) {
      for (const key of input_key_sets[name].keys()) movement_keys.add(key);
    }
  });
  return movement_keys;
};
