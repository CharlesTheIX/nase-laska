import { Router, Response } from 'express';
import { defaultSuccess } from '../constants/defaultResponses';
const router = Router();
router.route('/').get(async (_, response: Response) => {
  const res: ApiResponse = {
    ...defaultSuccess,
    message: 'OK'
  };
  return response.status(200).json(res);
});
export default router;
