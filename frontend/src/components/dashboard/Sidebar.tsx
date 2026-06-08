import React, { useState } from 'react';
import {
  LogOut,
  X,
  Sparkles,
  LayoutGrid,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { User } from '../../types';
import { BunnyDecoration } from './BunnyDecoration';
import sidebarDecor from '../../public/sidebar-decor.svg';
import logo from '../../public/logo.svg';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface SidebarProps {
  user: User | null;
  logout: () => void;
  statusFilter: 'all' | 'pending' | 'completed';
  setStatusFilter: (filter: 'all' | 'pending' | 'completed') => void;
  setPage: (page: number) => void;
  isMobile?: boolean;
  onCloseMobileSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  logout,
  statusFilter,
  setStatusFilter,
  setPage,
  isMobile = false,
  onCloseMobileSidebar,
}) => {
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);

  const sidebarNavItems = [
    { id: 'all', label: 'Dashboard', icon: LayoutGrid },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'pending', label: 'Pending', icon: Clock },
  ];

  return (
    <div className="flex flex-col h-full justify-between relative">
      <div className="space-y-4 relative z-10">

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src={logo} alt="TaskBunny Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl mt-2 font-extrabold text-slate-900 tracking-tight leading-none">TaskBunny</h1>
          </div>
          {isMobile && onCloseMobileSidebar && (
            <button
              onClick={onCloseMobileSidebar}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="space-y-1 pt-4">
          {sidebarNavItems.map((item) => {
            const isActive =
              (item.id === 'all' && statusFilter === 'all') ||
              (item.id === 'completed' && statusFilter === 'completed') ||
              (item.id === 'pending' && statusFilter === 'pending');
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'all') {
                    setStatusFilter('all');
                  } else if (item.id === 'completed' || item.id === 'pending') {
                    setStatusFilter(item.id);
                  }
                  setPage(1);
                  if (isMobile && onCloseMobileSidebar) onCloseMobileSidebar();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[inset_0px_2.5px_4px_rgba(255,255,255,0.35),_0px_5px_12px_rgba(79,70,229,0.2)]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <Sparkles size={12} className="text-white shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile summary */}
      <div className="border-t border-slate-100 pt-4 mt-auto relative z-10">
        <div
          onClick={() => setIsSignoutOpen(true)}
          className="flex items-center justify-between p-2.5 hover:bg-red-50/50 hover:text-red-600 transition-colors rounded-2xl cursor-pointer group/profile"
        >
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shrink-0 select-none group-hover/profile:border-red-200 transition-colors">
              <img 
                src={`https://api.dicebear.com/7.x/open-peeps/svg?seed=${encodeURIComponent(user?.email || 'default')}`} 
                alt="User Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="overflow-hidden leading-normal text-left">
              <p className="text-xs font-black text-slate-900 group-hover/profile:text-red-700 truncate">{user?.name || 'Arpit Singh'}</p>
              <p className="text-[9px] text-slate-400 group-hover/profile:text-red-500/80 truncate">{user?.email || 'asin060902@gmail.com'}</p>
            </div>
          </div>
          <LogOut size={14} className="text-slate-400 group-hover/profile:text-red-600 transition-colors shrink-0" />
        </div>
      </div>

      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <img src={sidebarDecor} alt="Sidebar Decoration" className="w-[80px] object-contain" />
      </div>

      <BunnyDecoration className="absolute top-1/2 -translate-y-1/2 right-[-95px] w-[200px] h-[200px] pointer-events-none select-none z-0" />

      <Modal
        isOpen={isSignoutOpen}
        onClose={() => setIsSignoutOpen(false)}
        title="Sign Out"
        size="sm"
      >
        <div className="space-y-6 text-center">
          <div className="inline-flex p-3 bg-red-50 text-red-500 rounded-full mb-2">
            <LogOut className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-black text-slate-900">Are you sure?</h4>
            <p className="text-xs text-slate-500 leading-relaxed px-4">
              You will be signed out of your TaskBunny workspace session. Any unsaved changes might not be synced.
            </p>
          </div>
          <div className="flex justify-center space-x-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsSignoutOpen(false)}
              className="text-xs rounded-full font-bold px-5"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsSignoutOpen(false);
                logout();
              }}
              className="text-xs rounded-full font-bold px-6"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
