import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
  );
};

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
      <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
        <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  );
};
