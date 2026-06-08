import React from 'react';
import { ClipboardList, CheckCircle2, Clock, Percent } from 'lucide-react';

// Import public folder icon assets
import taskListIcon from '../../public/task-list.png';
import checkIcon from '../../public/check.png';
import hourGlassIcon from '../../public/hour-glass.png';

interface StatsCardsProps {
  totalTasksCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  completionRate: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalTasksCount,
  completedTasksCount,
  pendingTasksCount,
  completionRate,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  
      <div className="bg-gradient-to-br from-indigo-50/30 to-purple-50/20 rounded-2xl border border-indigo-100 p-5 flex items-center justify-between h-[120px] card-glow relative overflow-hidden group">
        <div className="flex flex-col justify-between h-full text-left">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Total Tasks</span>
          </span>
          <div className="space-y-0.5 mt-2">
            <span className="text-3xl font-black text-slate-950 block leading-none">{totalTasksCount}</span>
            <span className="text-[9px] font-bold text-slate-400">All tasks in your workspace</span>
          </div>
        </div>

        <div className="relative w-24 h-24 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <div className="absolute -bottom-1 w-16 h-3.5 bg-indigo-500/30 rounded-full blur-[6px] pointer-events-none"></div>
          <img src={taskListIcon} alt="Total Tasks" className="w-full h-full object-contain relative z-10" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50/30 to-teal-50/20 rounded-2xl border border-emerald-100 p-5 flex items-center justify-between h-[120px] card-glow relative overflow-hidden group">
        <div className="flex flex-col justify-between h-full text-left">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
          <div className="space-y-0.5 mt-2">
            <span className="text-3xl font-black text-slate-950 block leading-none">{completedTasksCount}</span>
            <span className="text-[9px] font-bold text-slate-400">Tasks completed</span>
          </div>
        </div>

        <div className="relative w-24 h-24 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <div className="absolute -bottom-1 w-16 h-3.5 bg-emerald-500/35 rounded-full blur-[6px] pointer-events-none"></div>
          <img src={checkIcon} alt="Completed Tasks" className="w-full h-full object-contain relative z-10" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/20 rounded-2xl border border-amber-100 p-5 flex items-center justify-between h-[120px] card-glow relative overflow-hidden group">
        <div className="flex flex-col justify-between h-full text-left">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
          <div className="space-y-0.5 mt-2">
            <span className="text-3xl font-black text-slate-950 block leading-none">{pendingTasksCount}</span>
            <span className="text-[9px] font-bold text-slate-400">Tasks pending review</span>
          </div>
        </div>

        <div className="relative w-28 h-28 rotate-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <div className="absolute -bottom-1 -rotate-12 w-16 h-3.5 bg-amber-500/40 rounded-full blur-[6px] pointer-events-none"></div>
          <img src={hourGlassIcon} alt="Pending Tasks" className="w-full h-full object-contain relative z-10" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-fuchsia-50/30 to-pink-50/20 rounded-2xl border border-fuchsia-100 p-5 flex items-center justify-between h-[120px] card-glow relative overflow-hidden group">
        <div className="flex flex-col justify-between h-full text-left">
          <span className="text-[10px] font-bold text-fuchsia-600 uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" />
            <span>Completion Rate</span>
          </span>
          <div className="space-y-0.5 mt-2">
            <span className="text-3xl font-black text-slate-950 block leading-none">{completionRate}%</span>
            <span className="text-[9px] font-bold text-slate-400">Keep going!</span>
          </div>
        </div>

        <div className="relative w-24 h-24 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 rounded-full bg-[#FFF5FF] shadow-[inset_-4px_-4px_8px_rgba(217,70,239,0.12),_inset_4px_4px_8px_rgba(255,255,255,0.9),_0px_8px_16px_rgba(217,70,239,0.12)] border border-fuchsia-100/40">
          <svg className="w-4/5 h-4/5 transform -rotate-90 relative z-10" viewBox="0 0 36 36">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FDF4FF" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="3.2"
              strokeDasharray={`${completionRate} ${100 - completionRate}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute text-xs font-black text-slate-800 z-10">{completionRate}%</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
