import errorLogger from './errorLogger';
import { Request, Response } from 'express';
const errorHandler = (error: any, request: Request, response: Response): void => {
  errorLogger.error({
    message: `${error.status || 500} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`,
    error: error.stack
  });
  response.status(error.status || 500).json({ error: error.message });
};
export default errorHandler;
