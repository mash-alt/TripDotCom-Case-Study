import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Globe, ArrowLeft, Mail, Lock, User, Phone, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  const validateName = (value: string, field: 'firstName' | 'lastName') => {
    const trimmed = value.trim();
    const label = field === 'firstName' ? 'First' : 'Last';
    if (!trimmed) return `${label} name is required`;
    if (trimmed.length < 2) return `At least 2 characters required`;
    if (trimmed.length > 50) return `Maximum 50 characters allowed`;
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return `Only letters, spaces, hyphens, and apostrophes`;
    return '';
  };

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email address';
    if (trimmed.length > 254) return 'Email address is too long';
    return '';
  };

  const validatePhone = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    const cleaned = trimmed.replace(/[\s()-]/g, '');
    if (cleaned.length < 7) return 'Phone number is too short';
    if (cleaned.length > 15) return 'Phone number is too long';
    if (!/^\+?[0-9]+$/.test(cleaned)) return 'Please enter a valid phone number';
    return '';
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 5) return { score: 4, label: 'Strong', color: 'bg-green-500' };
    return { score: 5, label: 'Excellent', color: 'bg-emerald-500' };
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Must be at least 8 characters';
    if (value.length > 128) return 'Maximum 128 characters allowed';
    if (!/[a-z]/.test(value)) return 'Must contain a lowercase letter';
    if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter';
    if (!/[0-9]/.test(value)) return 'Must contain a number';
    return '';
  };

  const isFieldValid = (field: keyof typeof errors) => touched[field] && !errors[field] && formData[field].trim() !== '';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const newErrors = {
      firstName: validateName(formData.firstName, 'firstName'),
      lastName: validateName(formData.lastName, 'lastName'),
      email: validateEmail(formData.email),
      phoneNumber: validatePhone(formData.phoneNumber),
      password: validatePassword(formData.password),
    };

    setTouched({ firstName: true, lastName: true, email: true, phoneNumber: true, password: true });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      await register({
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        password: formData.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="relative z-10 w-full max-w-xl px-12">
          <Link to="/" className="flex items-center gap-2 group mb-12 inline-flex">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Globe className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">Trip<span className="text-primary font-extrabold italic">.com</span></span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">Start your journey <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">with us today.</span></h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-md">Create a customer account to unlock member pricing, booking history, loyalty rewards, refunds, and support tools.</p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 relative overflow-y-auto">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors lg:hidden">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md my-auto pt-16 lg:pt-0">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Create an Account</h2>
            <p className="text-gray-500 font-medium">Join Trip.com to book hotels with real backend data.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${isFieldValid('firstName') ? 'text-green-500' : errors.firstName ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData((c) => ({ ...c, firstName: e.target.value }));
                      if (touched.firstName) setErrors((c) => ({ ...c, firstName: validateName(e.target.value, 'firstName') }));
                    }}
                    onBlur={() => {
                      setTouched((c) => ({ ...c, firstName: true }));
                      setErrors((c) => ({ ...c, firstName: validateName(formData.firstName, 'firstName') }));
                    }}
                    className={`w-full bg-gray-50 border rounded-2xl py-4 pl-12 pr-11 font-medium focus:ring-2 focus:bg-white outline-none transition-all placeholder:text-gray-400 ${
                      isFieldValid('firstName') ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20' :
                      errors.firstName && touched.firstName ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' :
                      'border-gray-200 focus:border-primary focus:ring-primary/20'
                    }`}
                    placeholder="John"
                  />
                  {isFieldValid('firstName') && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
                  {errors.firstName && touched.firstName && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />}
                </div>
                {errors.firstName && touched.firstName && <p className="mt-1.5 text-xs font-semibold text-red-600 ml-1 flex items-center gap-1">{errors.firstName}</p>}
                <p className="mt-1 text-[10px] text-gray-400 ml-1">{formData.firstName.trim().length}/50</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${isFieldValid('lastName') ? 'text-green-500' : errors.lastName ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData((c) => ({ ...c, lastName: e.target.value }));
                      if (touched.lastName) setErrors((c) => ({ ...c, lastName: validateName(e.target.value, 'lastName') }));
                    }}
                    onBlur={() => {
                      setTouched((c) => ({ ...c, lastName: true }));
                      setErrors((c) => ({ ...c, lastName: validateName(formData.lastName, 'lastName') }));
                    }}
                    className={`w-full bg-gray-50 border rounded-2xl py-4 pl-12 pr-11 font-medium focus:ring-2 focus:bg-white outline-none transition-all placeholder:text-gray-400 ${
                      isFieldValid('lastName') ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20' :
                      errors.lastName && touched.lastName ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' :
                      'border-gray-200 focus:border-primary focus:ring-primary/20'
                    }`}
                    placeholder="Doe"
                  />
                  {isFieldValid('lastName') && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
                  {errors.lastName && touched.lastName && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />}
                </div>
                {errors.lastName && touched.lastName && <p className="mt-1.5 text-xs font-semibold text-red-600 ml-1 flex items-center gap-1">{errors.lastName}</p>}
                <p className="mt-1 text-[10px] text-gray-400 ml-1">{formData.lastName.trim().length}/50</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${isFieldValid('email') ? 'text-green-500' : errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((c) => ({ ...c, email: e.target.value }));
                    if (touched.email) setErrors((c) => ({ ...c, email: validateEmail(e.target.value) }));
                  }}
                  onBlur={() => {
                    setTouched((c) => ({ ...c, email: true }));
                    setErrors((c) => ({ ...c, email: validateEmail(formData.email) }));
                  }}
                  className={`w-full bg-gray-50 border rounded-2xl py-4 pl-12 pr-11 font-medium focus:ring-2 focus:bg-white outline-none transition-all placeholder:text-gray-400 ${
                    isFieldValid('email') ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20' :
                    errors.email && touched.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' :
                    'border-gray-200 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="name@example.com"
                />
                {isFieldValid('email') && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
                {errors.email && touched.email && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />}
              </div>
              {errors.email && touched.email && <p className="mt-1.5 text-xs font-semibold text-red-600 ml-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Phone Number <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className={`h-5 w-5 transition-colors ${isFieldValid('phoneNumber') ? 'text-green-500' : errors.phoneNumber ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    setFormData((c) => ({ ...c, phoneNumber: e.target.value }));
                    if (touched.phoneNumber) setErrors((c) => ({ ...c, phoneNumber: validatePhone(e.target.value) }));
                  }}
                  onBlur={() => {
                    setTouched((c) => ({ ...c, phoneNumber: true }));
                    setErrors((c) => ({ ...c, phoneNumber: validatePhone(formData.phoneNumber) }));
                  }}
                  className={`w-full bg-gray-50 border rounded-2xl py-4 pl-12 pr-11 font-medium focus:ring-2 focus:bg-white outline-none transition-all placeholder:text-gray-400 ${
                    isFieldValid('phoneNumber') ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20' :
                    errors.phoneNumber && touched.phoneNumber ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' :
                    'border-gray-200 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="+63 912 345 6789"
                />
                {isFieldValid('phoneNumber') && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
                {errors.phoneNumber && touched.phoneNumber && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />}
              </div>
              {errors.phoneNumber && touched.phoneNumber && <p className="mt-1.5 text-xs font-semibold text-red-600 ml-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${isFieldValid('password') ? 'text-green-500' : errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData((c) => ({ ...c, password: e.target.value }));
                    if (touched.password) setErrors((c) => ({ ...c, password: validatePassword(e.target.value) }));
                  }}
                  onBlur={() => {
                    setTouched((c) => ({ ...c, password: true }));
                    setErrors((c) => ({ ...c, password: validatePassword(formData.password) }));
                  }}
                  className={`w-full bg-gray-50 border rounded-2xl py-4 pl-12 pr-20 font-medium focus:ring-2 focus:bg-white outline-none transition-all placeholder:text-gray-400 ${
                    isFieldValid('password') ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20' :
                    errors.password && touched.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' :
                    'border-gray-200 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Password strength</span>
                    <span className={`text-xs font-bold ${
                      getPasswordStrength(formData.password).score <= 1 ? 'text-red-600' :
                      getPasswordStrength(formData.password).score <= 2 ? 'text-orange-600' :
                      getPasswordStrength(formData.password).score <= 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>{getPasswordStrength(formData.password).label}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div key={level} className={`h-1.5 flex-1 rounded-full transition-all ${
                        level <= getPasswordStrength(formData.password).score ? getPasswordStrength(formData.password).color : 'bg-gray-200'
                      }`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {[
                      { test: formData.password.length >= 8, label: '8+ characters' },
                      { test: formData.password.length >= 12, label: '12+ characters' },
                      { test: /[a-z]/.test(formData.password), label: 'Lowercase letter' },
                      { test: /[A-Z]/.test(formData.password), label: 'Uppercase letter' },
                      { test: /[0-9]/.test(formData.password), label: 'Number' },
                      { test: /[^a-zA-Z0-9]/.test(formData.password), label: 'Special character' },
                    ].map(({ test, label }) => (
                      <div key={label} className={`flex items-center gap-1.5 text-xs ${test ? 'text-green-600' : 'text-gray-400'}`}>
                        {test ? <CheckCircle className="h-3.5 w-3.5 shrink-0" /> : <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gray-300" />}
                        <span className={test ? 'font-semibold' : ''}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && touched.password && <p className="mt-1.5 text-xs font-semibold text-red-600 ml-1">{errors.password}</p>}
            </div>

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-primary-dark transition-all transform active:scale-[0.98] mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Register'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
