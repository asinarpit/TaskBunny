import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Filter,
  AlertCircle,
  Inbox,
  Trash,
  ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authContext';
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask, getTaskAnalytics } from '../api/tasks';
import { Task } from '../types';
import { Button } from '../components/common/Button';
import { TaskCard } from '../components/dashboard/TaskCard';
import { TaskFormModal } from '../components/dashboard/TaskFormModal';
import { Modal } from '../components/common/Modal';
import { DashboardSkeleton } from '../components/common/SkeletonLoader';

// Modularized Components
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ProductivityOverview } from '../components/dashboard/ProductivityOverview';
import { QuoteCard } from '../components/dashboard/QuoteCard';

import wavingHandGif from '../public/waving-hand.gif';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  // Query and filter states
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  // Debounce search string
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchVal]);

  // Fetch Tasks query
  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['tasks', page, statusFilter, debouncedSearch],
    queryFn: () =>
      getTasks({
        page,
        limit,
        status: statusFilter,
        search: debouncedSearch,
      }),
  });

  // Fetch analytics query
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data: analyticsResponse } = useQuery({
    queryKey: ['tasks', 'analytics', timezone],
    queryFn: () => getTaskAnalytics(timezone),
  });
  const analyticsData = analyticsResponse?.data;

  // Fetch ALL Tasks for metrics calculation
  const { data: allTasksData } = useQuery({
    queryKey: ['tasks', 'all-metrics'],
    queryFn: () => getTasks({ page: 1, limit: 1000 }),
  });

  // Calculate stats
  const allTasks = allTasksData?.data?.tasks || [];
  const totalTasksCount = allTasks.length;
  const completedTasksCount = allTasks.filter((t) => t.status === 'completed').length;
  const pendingTasksCount = allTasks.filter((t) => t.status === 'pending').length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully!');
      setIsFormOpen(false);
      setSelectedTask(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update task');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'completed' }) =>
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task status updated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
      setIsDeleteOpen(false);
      setTaskToDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    },
  });

  // Action triggers
  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setTaskToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleToggleStatus = (task: Task) => {
    const nextStatus = task.status === 'pending' ? 'completed' : 'pending';
    toggleStatusMutation.mutate({ id: task._id, status: nextStatus });
  };

  const handleFormSubmit = (formData: any) => {
    if (selectedTask) {
      updateTaskMutation.mutate({ id: selectedTask._id, data: formData });
    } else {
      createTaskMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (taskToDeleteId) {
      deleteTaskMutation.mutate(taskToDeleteId);
    }
  };

  const tasksList = data?.data?.tasks || [];
  const totalPages = data?.data?.totalPages || 1;
  const totalTasks = data?.data?.totalTasks || 0;

  // Client-side sorting for the current page tasks list
  const sortedTasksList = [...tasksList].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const getFirstName = () => {
    if (!user?.name) return 'User';
    return user.name.split(' ')[0];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-slate-200 h-screen sticky top-0 z-30 p-5">
        <Sidebar
          user={user}
          logout={logout}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setPage={setPage}
        />
      </aside>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[260px] bg-white border-r border-slate-200 z-50 p-5 flex flex-col justify-between transform transition-transform duration-300 lg:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <Sidebar
          user={user}
          logout={logout}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setPage={setPage}
          isMobile={true}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        <Header
          user={user}
          logout={logout}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 w-full space-y-6">

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                <span>Hey {getFirstName()}!</span>
                <img src={wavingHandGif} alt="Waving hand" className="w-12 h-12 object-contain select-none pointer-events-none shrink-0" />
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Let's crush those tasks today!</p>
            </div>
            <div className="relative self-start sm:self-auto">
              {/* decor svg */}
              <svg className="absolute -top-4 -left-4 w-8 h-8 pointer-events-none select-none overflow-visible" viewBox="0 0 32 32" fill="none">
                <line x1="22" y1="9" x2="20" y2="3" stroke="#60A5FA" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="14" y1="14" x2="8" y2="8" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="9" y1="21" x2="3" y2="19" stroke="#10B981" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="10" y1="30" x2="6" y2="33" stroke="#EC4899" strokeWidth="3.2" strokeLinecap="round" />
              </svg>

              <Button
                variant="primary"
                onClick={handleOpenCreateModal}
                data-create-task-btn="true"
                className="py-2.5 h-[40px] px-6 font-bold text-xs rounded-full flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create New Task
              </Button>
            </div>
          </div>

          {/* Stat Cards - Row Grid */}
          <StatsCards
            totalTasksCount={totalTasksCount}
            completedTasksCount={completedTasksCount}
            pendingTasksCount={pendingTasksCount}
            completionRate={completionRate}
          />

          {/* Content Split: Tasks Grid vs Analytics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left Section: Tasks List (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-[20px] p-5 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <Filter className="w-4 h-4 text-[#4F46E5]" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {statusFilter === 'all' ? 'All Tasks' : statusFilter === 'completed' ? 'Completed Tasks' : 'Pending Tasks'}
                    </span>
                    <span className="bg-indigo-50 text-[#4F46E5] text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-100">
                      {totalTasks}
                    </span>
                  </div>

                  {/* Sorting parameters dropdown */}
                  <div className="flex items-center space-x-1 border rounded-full px-3 py-1 bg-slate-50 border-slate-200/60 text-[10px] text-slate-500 font-bold">
                    <ArrowUpDown size={10} className="text-slate-400 mr-1" />
                    <span>Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-black text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <DashboardSkeleton />
                ) : isError ? (
                  <div className="bg-red-50/50 border border-red-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <h3 className="text-sm font-bold text-slate-900">Failed to load tasks</h3>
                    <p className="text-xs text-slate-500 max-w-md">{(error as Error).message || 'An error occurred.'}</p>
                  </div>
                ) : sortedTasksList.length === 0 ? (
                  <div className="bg-slate-50/50 border border-dashed border-slate-200/80 p-12 rounded-[20px] flex flex-col items-center justify-center text-center space-y-4">
                    <Inbox className="w-10 h-10 text-slate-400" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">No tasks found</h3>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">
                        {debouncedSearch
                          ? `We couldn't find any matches for "${debouncedSearch}". Try updating your query.`
                          : "Your workspace is clear! Start loading tasks into your workflow."}
                      </p>
                    </div>
                    {!debouncedSearch && (
                      <Button
                        variant="secondary"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={handleOpenCreateModal}
                        data-create-task-btn="true"
                        className="text-xs font-bold rounded-full py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800"
                      >
                        Create Your First Task
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 2 Column Tasks Grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {sortedTasksList.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleOpenEditModal}
                          onDelete={handleOpenDeleteModal}
                          onToggleStatus={handleToggleStatus}
                          isToggling={toggleStatusMutation.isPending && toggleStatusMutation.variables?.id === task._id}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-slate-500 font-semibold">
                        <p>
                          Showing <span className="text-slate-900 font-black">{(page - 1) * limit + 1}</span> to{' '}
                          <span className="text-slate-900 font-black">{Math.min(page * limit, totalTasks)}</span> of{' '}
                          <span className="text-slate-900 font-black">{totalTasks}</span> tasks
                        </p>

                        <div className="flex items-center space-x-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1 || isPlaceholderData}
                            className="!px-3 !py-1.5 text-[10px] h-auto rounded-full font-bold"
                          >
                            Previous
                          </Button>
                          <span className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-800 font-extrabold text-[10px]">
                            {page} / {totalPages}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages || isPlaceholderData}
                            className="!px-3 !py-1.5 text-[10px] h-auto rounded-full font-bold"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Dotted border Create task button at bottom */}
                <button
                  onClick={handleOpenCreateModal}
                  data-create-task-btn="true"
                  className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-[#4F46E5] rounded-xl flex items-center justify-center gap-1.5 text-xs text-[#4F46E5] font-black bg-slate-50/30 hover:bg-indigo-50/10 transition-all duration-300"
                >
                  <Plus size={14} />
                  <span>Add New Task</span>
                </button>
              </div>
            </div>

            {/* Right Section: Analytics Overview (1 Column) */}
            <div className="lg:col-span-1 space-y-6">
              <ProductivityOverview
                completedTasksCount={completedTasksCount}
                analyticsData={analyticsData}
              />
              <QuoteCard />
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-[10px] text-slate-400 mt-auto font-sans font-semibold">
          &copy; {new Date().getFullYear()} TaskBunny Inc. Designed by Arpit to streamline developer productivity.
        </footer>
      </div>

      {/* Task Form Modal overlay */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
      />

      {/* Delete task Confirmation dialog */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-6 text-center">
          <div className="inline-flex p-3 bg-red-50 text-red-500 rounded-full mb-2">
            <Trash className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-black text-slate-900">Are you sure?</h4>
            <p className="text-xs text-slate-500 leading-relaxed px-4">
              This action cannot be undone. This will permanently delete the task from your board.
            </p>
          </div>
          <div className="flex justify-center space-x-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteTaskMutation.isPending}
              className="text-xs rounded-full font-bold px-5"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteTaskMutation.isPending}
              className="text-xs rounded-full font-bold px-6"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
