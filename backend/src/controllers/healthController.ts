import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const getHealth = (req: Request, res: Response) => {
  return sendSuccess(res, 'HostelHub API is operational', {
    status: 'ok',
    service: 'hostelhub-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};
