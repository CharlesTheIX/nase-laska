import json
import os
import glob
from typing import List, Dict, Any

def reformat_json_in_dir(source_dir: str, dest_dir: str) -> None:
    """
    Reads JSON data from each .json file in source_dir, curates a new JSON object by reading keys and moving them,
    and writes the curated JSON to the dest_dir with the same filename.
    For this example, curation flattens the 'rect' object into top-level keys for map data.
    """
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    
    json_files: List[str] = glob.glob(os.path.join(source_dir, '*.json'))
    for input_file in json_files:
        try:
            with open(input_file, 'r') as f:
                data: Dict[str, Any] = json.load(f)
            




            curated_data: Dict[str, Any] = {}
            for key, value in data.items():
                if key == 'rect' and isinstance(value, dict):
                    # Flatten rect keys
                    curated_data.update(value)
                else:
                    curated_data[key] = value
            





            filename: str = os.path.basename(input_file)
            output_file: str = os.path.join(dest_dir, filename)
            with open(output_file, 'w') as f:
                json.dump(curated_data, f, indent=4)
            
        except FileNotFoundError:
            print(f"Error: File {input_file} not found.")
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in {input_file}.")
        except Exception as e:
            print(f"An error occurred with {input_file}: {e}")

SOURCE_DIR: str = '/Users/davidcharles/repos/rpg/.project_files/maps'
DEST_DIR: str = '/Users/davidcharles/repos/rpg/assets/data'
if __name__ == "__main__":
    reformat_json_in_dir(SOURCE_DIR, DEST_DIR)