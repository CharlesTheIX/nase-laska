import Model from "../../models/Character.model";
import { defaultSuccess, defaultError } from "../../constants/defaultResponses";

type Props = {
  name: string;
  select?: string[];
};

export default async (props: Props): Promise<ApiResponse> => {
  const { name, select = [] } = props;
  try {
    const item = await Model.findOne({ name }).select(select.join(" "));
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
