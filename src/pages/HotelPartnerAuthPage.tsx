import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ChevronLeft, Lock, Mail, UserRound } from 'lucide-react';
import { authApi } from '@/api/services';
import { useAuth } from '@/hooks/useAuth';

type AccessRole = 'hotel_owner' | 'hotel_staff';
type Mode = 'login' | 'create';

export default function HotelPartnerAuthPage() {
  const navigate = useNavigate();
  const { login, setSession } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<AccessRole>('hotel_owner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ownerEmail: '',
  });

  const redirectByRole = (selectedRole: AccessRole) => {
    navigate(selectedRole === 'hotel_owner' ? '/owner' : '/staff', { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (mode === 'create' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login({
          email: formData.email.trim(),
          password: formData.password,
          role,
        });
        redirectByRole(role);
        return;
      }

      const session = await authApi.registerPartner({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        ownerEmail: role === 'hotel_staff' ? formData.ownerEmail.trim() : undefined,
      });

      setSession(session);
      redirectByRole(role);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to continue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.05fr_1fr]">
          <aside className="hidden border-r border-slate-200 bg-slate-50 p-10 lg:block">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-700 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Trip.com Partner Access</p>
                <p className="text-xs text-slate-500">Internal-only route</p>
              </div>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Hotel operations portal</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Use this page for hotel owner and hotel staff account onboarding and sign-in.
              This route is intentionally separate from the public customer flows.
            </p>

            <div className="mt-10 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Available access</p>
              <p className="text-sm text-slate-700">Hotel Owner: manage hotel data, inventory, and pricing.</p>
              <p className="text-sm text-slate-700">Hotel Staff: operate day-to-day bookings and guest workflow.</p>
            </div>
          </aside>

          <main className="p-6 sm:p-10">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              <ChevronLeft className="h-4 w-4" />
              Back to home
            </Link>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {mode === 'login' ? 'Partner sign in' : 'Create partner account'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {mode === 'login'
                  ? 'Select your role and sign in with your partner account credentials.'
                  : 'Create a role-specific partner account for hotel operations.'}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('create')}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${mode === 'create' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Create account
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('hotel_owner')}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${role === 'hotel_owner' ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
              >
                Hotel Owner
              </button>
              <button
                type="button"
                onClick={() => setRole('hotel_staff')}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${role === 'hotel_staff' ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
              >
                Hotel Staff
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'create' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</span>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-slate-500"
                      placeholder="Enter full legal name"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Work email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-slate-500"
                    placeholder="name@hotel.com"
                  />
                </div>
              </label>

              {mode === 'create' && role === 'hotel_staff' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Owner account email</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.ownerEmail}
                      onChange={(event) => setFormData((current) => ({ ...current, ownerEmail: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-slate-500"
                      placeholder="existing.owner@hotel.com"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-slate-500"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </label>

              {mode === 'create' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm password</span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.confirmPassword}
                      onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-slate-500"
                      placeholder="Re-enter password"
                    />
                  </div>
                </label>
              )}

              {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign in to portal' : 'Create partner account'}
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
