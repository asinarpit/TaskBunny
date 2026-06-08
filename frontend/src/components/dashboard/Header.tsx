import React, { useState } from 'react';
import { Menu, Search, ChevronDown, LogOut } from 'lucide-react';
import { User } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface HeaderProps {
  user: User | null;
  logout: () => void;
  searchVal: string;
  setSearchVal: (val: string) => void;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  logout,
  searchVal,
  setSearchVal,
  onOpenMobileSidebar,
}) => {
  const [isHeaderProfileOpen, setIsHeaderProfileOpen] = useState(false);
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 h-[64px] px-6 flex items-center justify-between">
      <div className="flex items-center w-full md:max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 border border-slate-200 mr-3"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* search  */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="text-slate-400 w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/60 border border-slate-200/60 text-slate-900 placeholder-slate-400 text-xs rounded-full pl-10 pr-4 py-2 transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] h-9"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3.5 pl-4 shrink-0">
        <div className="relative">
          <div
            onClick={() => setIsHeaderProfileOpen(!isHeaderProfileOpen)}
            className="flex items-center space-x-2 cursor-pointer select-none hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={`https://api.dicebear.com/7.x/open-peeps/svg?seed=${encodeURIComponent(user?.email || 'default')}`} 
                alt="User Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="text-xs font-bold text-slate-700 hidden sm:block">{user?.name || 'Arpit Singh'}</span>
            <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
          </div>

          {isHeaderProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-fadeIn text-left">
              <button
                onClick={() => {
                  setIsHeaderProfileOpen(false);
                  setIsSignoutOpen(true);
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

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
    </header>
  );
};

export default Header;
