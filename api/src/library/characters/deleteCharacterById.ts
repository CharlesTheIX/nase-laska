import mongoose from "mongoose";
import Model from "../../models/Character.model";
import { defaultSuccess, defaultError } from "../../constants/defaultResponses";

export default async (_id: string): Promise<ApiResponse> => {
  try {
    const object_id = new mongoose.Types.ObjectId(_id);
    const deleted_tem = await Model.findByIdAndDelete(object_id, {
      new: true
    });
    if (!deleted_tem) throw new Error("No data found.");
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
