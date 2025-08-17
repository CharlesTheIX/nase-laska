import { Router, NextFunction } from 'express';
const router = Router();
router.route('/').get(async (_, __, next: NextFunction) => {
  const error: any = new Error('An error occurred');
  error.status = 500;
  next(error);
});
export default router;
