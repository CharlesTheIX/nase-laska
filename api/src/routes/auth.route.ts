import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { defaultError } from '../constants/defaultResponses';
if (process.env.ENV !== 'production') dotenv.config({ path: './.env' });

const authorise = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const isAuth =
    authHeader &&
    authHeader.split(' ')[0] === process.env.AUTH_KEY &&
    authHeader.split(' ')[1] === process.env.AUTH_SECRET;

  if (isAuth) return next();

  res.status(401).send({
    ...defaultError,
    message: 'Unauthorised',
    status: 401
  });
};

export default authorise;
