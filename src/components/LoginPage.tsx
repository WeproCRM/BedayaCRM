import { useState } from 'react';
import { login } from '../services/auth';
import { LoadingSpinner } from './LoadingSpinner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch {
      setError('بيانات الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071120] via-[#0f172a] to-[#111827]">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#111c2d] p-10 rounded-3xl flex flex-col gap-4 shadow-2xl">
        <img src="/logo.png" alt="Bedaya" className="w-24 mx-auto mb-2" />
        <h1 className="text-white text-center text-2xl font-bold mb-4">BedayaCRM</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/40 outline-none focus:border-cyan-400/50 transition-colors"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/40 outline-none focus:border-cyan-400/50 transition-colors"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-cyan-400 text-black font-bold py-3.5 rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  );
}