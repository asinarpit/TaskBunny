import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div
        className={`relative w-full bg-white border border-slate-200 rounded-[20px] shadow-modal transform transition-all duration-200 scale-100 flex flex-col max-h-[90vh] overflow-hidden ${sizes[size]}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60">
          <h3 className="text-lg font-bold text-slate-950 font-sans">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-slate-650 font-sans text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
