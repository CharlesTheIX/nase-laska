import Model from "../../models/Character.model";
import getCharacterById from "./getCharacterById";
import { defaultSuccess, defaultError } from "../../constants/defaultResponses";

type Props = {
  _id: string;
  update: any;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, update } = props;
  try {
    const original_item = await getCharacterById({ _id });
    if (original_item.error) throw new Error("Item not found.");
    const new_update: any = {
      name: original_item.data.name,
      width: original_item.data.width,
      height: original_item.data.height,
      frame_sets: original_item.data.frame_sets
    };

    if (update.name) new_update.name = update.name;
    if (update.width) new_update.width = update.width;
    if (update.height) new_update.height = update.height;
    if (update.frame_sets) new_update.frame_sets = update.frame_sets;

    const updated_item = await Model.findByIdAndUpdate(original_item.data._id, new_update, {
      new: true
    });
    if (!updated_item) throw new Error("No data found.");
    return {
      ...defaultSuccess,
      status: 204
    };
  } catch (error: any) {
    return {
      ...defaultError,
      message: error.message
    };
  }
};
