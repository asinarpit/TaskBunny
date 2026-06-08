import { body, param } from 'express-validator';
import { validate } from './auth';

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 100 })
    .withMessage('Task title must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  validate,
];

export const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task ID format'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Task title must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be either pending or completed'),
  validate,
];

export const updateTaskStatusValidator = [
  param('id').isMongoId().withMessage('Invalid task ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'completed'])
    .withMessage('Status must be either pending or completed'),
  validate,
];

export const mongoIdValidator = [
  param('id').isMongoId().withMessage('Invalid task ID format'),
  validate,
];
