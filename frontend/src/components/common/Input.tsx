import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`w-full bg-white hover:bg-slate-50 border text-slate-900 placeholder-slate-400 text-sm rounded-xl py-2 h-10 transition-all duration-200 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
              icon ? 'pl-11' : 'px-4'
            } ${
              isPassword ? 'pr-11' : 'pr-4'
            } ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/30'
                : 'border-slate-200 focus:border-brand-500'
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-semibold pl-1 animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
