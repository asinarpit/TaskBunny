import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskAnalytics,
} from '../controllers/task';
import {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
  mongoIdValidator,
} from '../validators/task';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createTaskValidator, createTask);
router.get('/', getTasks);
router.get('/analytics', getTaskAnalytics);
router.get('/:id', mongoIdValidator, getTaskById);
router.put('/:id', updateTaskValidator, updateTask);
router.patch('/:id/status', updateTaskStatusValidator, updateTaskStatus);
router.delete('/:id', mongoIdValidator, deleteTask);

export default router;
