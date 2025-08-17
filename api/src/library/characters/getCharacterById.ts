import mongoose from "mongoose";
import Model from "../../models/Character.model";
import { defaultSuccess, defaultError } from "../../constants/defaultResponses";

type Props = {
  _id: string;
  select?: string[];
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, select = [] } = props;
  try {
    const object_id = new mongoose.Types.ObjectId(_id);
    const item = await Model.findById(object_id).select(select.join(" "));
    if (!item) throw new Error("No data found.");
    return {
      ...defaultSuccess,
      data: item
    };
  } catch (error: any) {
    return {
      ...defaultError,
      message: error.message
    };
  }
};
