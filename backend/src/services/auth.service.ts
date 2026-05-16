import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { RegisterInput, LoginInput } from '../schemas';
import { JwtPayload, UserRole } from '../types';

const SALT_ROUNDS = 12;

const signToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role } as JwtPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const registerUser = async (input: RegisterInput) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    const error = new Error('Email already in use.') as Error & {
      statusCode: number;
    };
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role ?? 'sales',
  });

  const token = signToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select(
    '+passwordHash'
  );

  if (!user) {
    const error = new Error('Invalid email or password.') as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.') as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    const error = new Error('User not found.') as Error & {
      statusCode: number;
    };
    error.statusCode = 404;
    throw error;
  }
  return user;
};
