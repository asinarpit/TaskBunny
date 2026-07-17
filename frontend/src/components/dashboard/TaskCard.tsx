import React from 'react';
import { Edit2, Trash2, Calendar, CheckCircle, Clock, MoreVertical } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isCompleted = task.status === 'completed';

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div
      className={`group relative bg-white border border-slate-200 transition-all duration-300 rounded-2xl sm:rounded-[20px] p-3.5 sm:p-5 flex flex-col justify-between card-glow text-left ${isCompleted ? 'bg-slate-50/40 opacity-90' : 'bg-white'
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

      <div className="pt-3 sm:pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleStatus(task)}
          disabled={isToggling}
          className={`h-7 px-3 sm:px-4 rounded-full text-[10px] font-bold flex items-center gap-1 sm:gap-1.5 transition-all active:scale-[0.98] shrink-0 ${isCompleted
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

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-7 h-7 rounded-full border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            title="More Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-32 bg-white border border-slate-100 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] z-20 py-1.5 animate-in fade-in duration-100">
              <button
                onClick={() => {
                  onEdit(task);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors gap-2"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task._id);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50/80 transition-colors gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

