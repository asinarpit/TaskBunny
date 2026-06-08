import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Task title is required')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must not exceed 500 characters')
    .default(''),
  status: z.enum(['pending', 'completed']).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task | null;
  isLoading?: boolean;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  isLoading = false,
}) => {
  const isEditMode = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          status: task.status,
        });
      } else {
        reset({
          title: '',
          description: '',
          status: 'pending',
        });
      }
    }
  }, [task, isOpen, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <Input
          label="Task Title"
          placeholder="What needs to be done?"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Add details about this task..."
            className={`w-full bg-white hover:bg-slate-50 border text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/30'
                : 'border-slate-200 focus:border-brand-500'
              }`}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-semibold pl-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {isEditMode && (
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
              Status
            </label>
            <select
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              {...register('status')}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
