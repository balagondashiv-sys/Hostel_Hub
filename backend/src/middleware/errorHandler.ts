import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled Error: ${err.message || err}`, err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong. Please try again.';
  return sendError(res, message, err.errors || [], statusCode);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, `Route ${req.originalUrl} not found`, [], 404);
};
