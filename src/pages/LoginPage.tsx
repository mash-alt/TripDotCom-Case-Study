import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Globe, ArrowLeft, Mail, Lock, Apple } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo ?? '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ ...formData, role });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="relative z-10 w-full max-w-xl px-12">
          <Link to="/" className="flex items-center gap-2 group mb-12 inline-flex">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Globe className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">Trip<span className="text-primary font-extrabold italic">com</span></span>
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">Unlock exclusive <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">member rates.</span></h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-md">Sign in with the MySQL-backed auth system to manage bookings, payments, refunds, loyalty points, and support tickets.</p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors lg:hidden">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('customer')} className={`rounded-2xl py-3 font-bold border ${role === 'customer' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600'}`}>Customer</button>
              <button type="button" onClick={() => setRole('admin')} className={`rounded-2xl py-3 font-bold border ${role === 'admin' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600'}`}>Admin</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="email" required value={formData.email} onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all placeholder:text-gray-400" placeholder="name@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input type="password" required value={formData.password} onChange={(e) => setFormData((current) => ({ ...current, password: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all placeholder:text-gray-400" placeholder="••••••••" />
              </div>
            </div>

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-primary-dark transition-all transform active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Don&apos;t have an account? <Link to="/register" className="font-bold text-primary hover:underline">Register now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
