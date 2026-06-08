import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authContext';
import { loginUser } from '../api/auth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import logo from '../public/logo.svg';
import bunnyBg from '../public/bunny-bg.png';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      login(response.data.token, response.data.user);
      toast.success('Logged in successfully! Welcome back.');
      navigate('/', { replace: true });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Invalid email or password. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bunnyBg})` }}
    >
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex items-center justify-center space-x-2.5 mb-6 relative z-10 animate-fadeIn">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src={logo} alt="TaskBunny Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-bold mt-2 text-slate-900 tracking-tight leading-none">TaskBunny</h1>
      </div>

      <div className="w-full max-w-[420px] bg-white/70 border border-slate-200/80 p-5 sm:p-8 rounded-2xl sm:rounded-[20px] shadow-card backdrop-blur-md relative z-10 text-center space-y-5 sm:space-y-6 animate-fadeIn">

        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-xs font-semibold">Please log in to manage your tasks</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            type="password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" variant="primary" className="w-full h-10" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <div className="text-xs text-slate-400 border-t border-slate-100 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-500 hover:text-brand-600 font-bold transition-colors">
            Create One
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
