import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types';
import { CustomError } from './errorHandler';

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new CustomError('Authentication failed: No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || 'a@sdfjwefwe21233@12@@asdfasdf@*^123!@';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return next(new CustomError('Authentication failed: Invalid or expired token', 401));
  }
};
