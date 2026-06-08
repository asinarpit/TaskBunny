import React from 'react';
import { Edit2, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
  isToggling?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  isToggling = false,
}) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`group relative bg-white border border-slate-200 transition-all duration-300 rounded-[20px] p-5 flex flex-col justify-between card-glow text-left ${isCompleted ? 'bg-slate-50/40 opacity-90' : 'bg-white'
        }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${isCompleted
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-amber-50 text-amber-600'
              }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Completed
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 mr-1" />
                Pending
              </>
            )}
          </span>

          <div className="flex items-center text-[10px] text-slate-400 font-bold">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {formattedDate}
          </div>
        </div>

        <h4
          className={`text-sm font-black mb-1.5 transition-all duration-200 ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
            }`}
        >
          {task.title}
        </h4>

        <p
          className={`text-xs mb-3 leading-relaxed ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-500 font-medium'
            }`}
        >
          {task.description || (
            <span className="italic text-slate-400">No description provided</span>
          )}
        </p>
      </div>

      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => onToggleStatus(task)}
          disabled={isToggling}
          className={`h-7 px-4 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-[0.98] ${isCompleted
            ? 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
            : 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[inset_0px_2px_3px_rgba(255,255,255,0.35),_0px_3px_8px_rgba(79,70,229,0.2)] hover:shadow-[inset_0px_2px_4.5px_rgba(255,255,255,0.45),_0px_5px_12px_rgba(79,70,229,0.3)]'
            }`}
        >
          <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>{isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-full border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="w-7 h-7 rounded-full border border-slate-200/80 hover:bg-red-50 hover:border-red-200 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
