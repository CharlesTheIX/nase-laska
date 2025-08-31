/*
  inputKeys.ts

  This file is used to create and export key sets so that the types of player input can 
  be controlled from a single place, And new key groups by adding them to the returned
  object within the getInputKeySets function below.
*/

export const getInputKeySets = (): KeySetMap => {
  return {
    dev: new Set<string>().add("z"),
    run: new Set<string>().add("Shift"),
    camera: new Set<string>().add("-").add("="),
    settings: new Set<string>().add("p").add("P"),
    inventory: new Set<string>().add("i").add("I"),
    action: new Set<string>().add(" ").add("Enter"),
    up: new Set<string>().add("w").add("W").add("ArrowUp"),
    down: new Set<string>().add("s").add("S").add("ArrowDown"),
    left: new Set<string>().add("a").add("A").add("ArrowLeft"),
    right: new Set<string>().add("d").add("D").add("ArrowRight")
  };
};

export const getInputKeys = (set_names?: string[]): Set<string> => {
  const keys: Set<string> = new Set();
  const input_key_sets: KeySetMap = getInputKeySets();
  if (set_names && set_names.length > 0) {
    Object.keys(input_key_sets).map((name: string) => {
      if (set_names.includes(name) && input_key_sets[name]) {
        for (const key of input_key_sets[name].keys()) keys.add(key);
      }
    });
  } else {
    Object.values(input_key_sets).map((set: Set<string>) => {
      for (const key of set.keys()) {
        keys.add(key);
      }
    });
  }
  return keys;
};

export const getActionKeys = (): Set<string> => getInputKeys(["action"]);
export const getCameraKeys = (): Set<string> => getInputKeys(["camera"]);
export const getDevKeys = (): Set<string> => getInputKeys(["dev"]);
export const getInventoryKeys = (): Set<string> => getInputKeys(["inventory"]);
export const getMovementKeys = (): Set<string> => getInputKeys(["up", "down", "left", "right"]);
export const getRunKeys = (): Set<string> => getInputKeys(["run"]);
export const getSettingsKeys = (): Set<string> => getInputKeys(["settings"]);
