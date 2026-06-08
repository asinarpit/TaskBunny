import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Task } from '../models/Task';
import { CustomRequest } from '../types';
import { CustomError } from '../middleware/errorHandler';

export const createTask = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const task = new Task({
      title,
      description,
      userId,
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || 'all';


    const queryCriteria: any = { userId };

    if (status === 'pending' || status === 'completed') {
      queryCriteria.status = status;
    }

    if (search.trim()) {
      queryCriteria.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(queryCriteria)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(queryCriteria);
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        currentPage: page,
        totalPages,
        totalTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return next(new CustomError('Task not found or unauthorized', 404));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return next(new CustomError('Task not found or unauthorized', 404));
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      if (status === 'completed' && task.status !== 'completed') {
        task.completedAt = new Date();
      } else if (status === 'pending' && task.status !== 'pending') {
        task.completedAt = undefined;
      }
      task.status = status;
    }

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return next(new CustomError('Task not found or unauthorized', 404));
    }

    if (status === 'completed' && task.status !== 'completed') {
      task.completedAt = new Date();
    } else if (status === 'pending' && task.status !== 'pending') {
      task.completedAt = undefined;
    }
    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      return next(new CustomError('Task not found or unauthorized', 404));
    }

    res.status(200).json({
      success: true,
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskAnalytics = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new CustomError('User not authenticated', 401));
    }

    const tz = (req.query.timezone as string) || 'UTC';

    const startOfRange = new Date();
    startOfRange.setDate(startOfRange.getDate() - 9);

    const analytics = await Task.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          status: 'completed',
          completedAt: { $gte: startOfRange }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt', timezone: tz }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const countsMap = new Map<string, number>();
    analytics.forEach((item) => {
      if (item._id) {
        countsMap.set(item._id, item.count);
      }
    });

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(d);

      const y = parts.find(p => p.type === 'year')?.value;
      const m = parts.find(p => p.type === 'month')?.value;
      const dayVal = parts.find(p => p.type === 'day')?.value;
      const dateStr = `${y}-${m}-${dayVal}`;

      const dayName = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short'
      }).format(d);

      const count = countsMap.get(dateStr) || 0;
      result.push({
        date: dateStr,
        day: dayName,
        count
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
