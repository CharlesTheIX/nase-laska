import Model from "../../models/Character.model";
import { defaultSuccess, defaultError } from "../../constants/defaultResponses";

type Props = {
  select?: string[];
};

export default async (props: Props): Promise<ApiResponse> => {
  const { select = [] } = props;
  try {
    const items = await Model.find().select(select.join(" "));
    if (!items) throw new Error("No data found.");
    return {
      ...defaultSuccess,
      data: items
    };
  } catch (error: any) {
    return {
      ...defaultError,
      message: error.message
    };
  }
};
