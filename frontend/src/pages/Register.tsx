import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authContext';
import { registerUser } from '../api/auth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import logo from '../public/logo.svg';
import bunnyBg from '../public/bunny-bg.png';

const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordVal = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      login(response.data.token, response.data.user);
      toast.success('Account created successfully! Welcome!');
      navigate('/', { replace: true });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute password strength metrics
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[@$!%*?&]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(passwordVal);

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

      <div className="w-full max-w-[420px] bg-white/70 border border-slate-200/80 p-8 rounded-[20px] shadow-card backdrop-blur-md relative z-10 text-center space-y-6 animate-fadeIn">

        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-xs font-semibold">Join TaskBunny and streamline your workflow</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-1.5 text-left">
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            {passwordVal && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Password Strength</span>
                  <span className={strength.score <= 2 ? 'text-red-500' : strength.score <= 4 ? 'text-amber-500' : 'text-emerald-500'}>
                    {strength.label}
                  </span>
                </div>
                <div className="flex space-x-1 h-1">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${idx <= strength.score ? strength.color : 'bg-slate-200'
                        }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            icon={<Check className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" variant="primary" className="w-full h-10" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <div className="text-xs text-slate-400 border-t border-slate-100 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 hover:text-brand-600 font-bold transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
