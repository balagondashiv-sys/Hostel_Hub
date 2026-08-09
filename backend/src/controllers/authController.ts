import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { env } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: AuthRequest, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return sendError(res, 'Validation failed', result.error.errors, 400);
  }

  const { email, password, name, phone, role } = result.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return sendError(res, 'An account with this email already exists.', [], 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name,
      phone,
      role,
    },
  });

  const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return sendSuccess(res, 'Account created successfully', {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  }, 201);
};

export const login = async (req: AuthRequest, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return sendError(res, 'Validation failed', result.error.errors, 400);
  }

  const { email, password } = result.data;

  const user = await db.user.findUnique({
    where: { email },
    include: {
      studentProfile: {
        include: {
          hostel: true,
          block: true,
          room: true,
          bed: true,
        },
      },
      wardenProfile: {
        include: {
          hostels: { include: { hostel: true } },
        },
      },
      staffProfile: true,
    },
  });

  if (!user || !user.isActive) {
    return sendError(res, 'Invalid credentials or inactive account.', [], 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return sendError(res, 'Invalid credentials.', [], 401);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return sendSuccess(res, 'Login successful', {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      studentProfile: user.studentProfile,
      wardenProfile: user.wardenProfile,
      staffProfile: user.staffProfile,
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', [], 401);
  }

  const user = await db.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      studentProfile: {
        include: {
          hostel: true,
          block: true,
          room: true,
          bed: true,
        },
      },
      wardenProfile: {
        include: {
          hostels: { include: { hostel: true } },
        },
      },
      staffProfile: true,
    },
  });

  return sendSuccess(res, 'User profile fetched', user);
};

export const logout = async (req: AuthRequest, res: Response) => {
  return sendSuccess(res, 'Logout successful');
};
