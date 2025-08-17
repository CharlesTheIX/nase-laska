import Model from "../../models/Character.model";
import { defaultSuccess, defaultError } from "../../constants/defaultResponses";

export default async (props: any): Promise<ApiResponse> => {
  const { name, width, height, frame_sets } = props;
  try {
    const new_content: any = {
      name,
      frame_sets,
      width: width ?? 1,
      height: height ?? 2
    };
    const new_item = new Model(new_content);
    if (!new_item) throw new Error("Item not created.");
    await new_item.save();
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
