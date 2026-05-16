import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { asyncHandler } from '../utils/asyncHandler';

const signToken = (id: string, email: string, role: string) =>
  jwt.sign({ id, email, role }, env.JWT_SECRET as string, { expiresIn: '7d' });

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as RegisterInput;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already registered' });
    return;
  }
  const user = await User.create({ name, email, password, role });
  const token = signToken(user.id, user.email, user.role);
  res.status(201).json({ success: true, data: { user, token } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }
  const token = signToken(user.id, user.email, user.role);
  const userObj = user.toJSON();
  res.json({ success: true, data: { user: userObj, token } });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as { user?: { id: string } }).user?.id;
  const user = await User.findById(userId).lean();
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, data: { user } });
});