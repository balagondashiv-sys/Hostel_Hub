import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { sendError } from '../utils/response';
import { db } from '../config/db';

export interface AuthRequest extends Request {
  io?: any;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    studentId?: string;
    wardenId?: string;
    staffId?: string;
    hostelId?: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return sendError(res, 'Authentication token required. Please sign in.', [], 401);
  }

  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      include: {
        studentProfile: true,
        wardenProfile: { include: { hostels: true } },
        staffProfile: true,
      },
    });

    if (!user || !user.isActive) {
      return sendError(res, 'Account inactive or not found.', [], 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentId: user.studentProfile?.id,
      wardenId: user.wardenProfile?.id,
      staffId: user.staffProfile?.id,
      hostelId: user.studentProfile?.hostelId || user.wardenProfile?.hostels[0]?.hostelId || undefined,
    };

    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired session token. Please sign in again.', [], 403);
  }
};

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', [], 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, `Access forbidden. Required role: ${allowedRoles.join(' or ')}`, [], 403);
    }

    next();
  };
};
