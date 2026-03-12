import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

type Mode = 'login' | 'register';

const AuthPage = ({ mode }: { mode: Mode }) => {
  const navigate  = useNavigate();
  const setAuth   = useAuthStore((s) => s.setAuth);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const payload =
        mode === 'register'
          ? { name: fd.get('name'), email: fd.get('email'), password: fd.get('password') }
          : { email: fd.get('email'), password: fd.get('password') };

      const { data } = await api.post(`/auth/${mode}`, payload);
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <TrendingUp size={22} />
          </div>
          <span className="text-xl font-bold text-gray-800">SpendSmart</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {mode === 'login' ? 'Sign in to your account' : 'Start tracking your finances'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input name="name" type="text" placeholder="Your name" required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" placeholder="you@email.com" required
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" placeholder="••••••••" required minLength={6}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <Link to={mode === 'login' ? '/register' : '/login'}
            className="text-indigo-600 font-medium hover:underline">
            {mode === 'login' ? 'Register' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
