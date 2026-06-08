import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  userId: Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomRequest extends Request {
  user?: {
    userId: string;
  };
}
