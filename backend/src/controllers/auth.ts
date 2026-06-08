import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { CustomRequest } from '../types';
import { CustomError } from '../middleware/errorHandler';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'a@sdfjwefwe21233@12@@asdfasdf@*^123!@';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
};

export const register = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new CustomError('Email already in use', 400));
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError('Invalid email or password', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new CustomError('Invalid email or password', 401));
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
