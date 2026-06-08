import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[inset_0px_2.5px_4px_rgba(255,255,255,0.35),_0px_5px_12px_rgba(79,70,229,0.25)] hover:shadow-[inset_0px_2.5px_6px_rgba(255,255,255,0.45),_0px_8px_18px_rgba(79,70,229,0.35)] hover:scale-[1.02] active:scale-[0.98] transform',
    secondary: 'bg-gradient-to-b from-white to-slate-50 text-slate-700 border border-slate-200/80 shadow-[inset_0px_2px_3px_rgba(255,255,255,0.9),_0px_3px_6px_rgba(15,23,42,0.03)] hover:scale-[1.02] active:scale-[0.98] transform',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[inset_0px_2.5px_4px_rgba(255,255,255,0.35),_0px_5px_12px_rgba(220,38,38,0.25)] hover:shadow-[inset_0px_2.5px_6px_rgba(255,255,255,0.45),_0px_8px_18px_rgba(220,38,38,0.35)] hover:scale-[1.02] active:scale-[0.98] transform',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 hover:scale-[1.02] active:scale-[0.98] transform',
    glass: 'bg-white/60 hover:bg-white/80 text-slate-700 border border-slate-200 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transform',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
