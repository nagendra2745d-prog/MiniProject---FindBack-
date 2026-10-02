import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logoImg from '../assets/findback-logo.png';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, setActiveTab } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      const result = loginWithCredentials(username, password);
      if (!result.success && result.error) setErrorMsg(result.error);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="w-full max-w-sm">

        {/* Back link */}
        <button
          onClick={() => setActiveTab('about')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </button>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">

          {/* Brand header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-stone-100">
            <img src={logoImg} alt="FindBack" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <div className="text-base font-bold text-slate-900">FindBack</div>
              <div className="text-xs text-slate-400">Campus Lost &amp; Found</div>
            </div>
          </div>

          <h1 className="text-lg font-bold text-slate-900 mb-1">Sign in to continue</h1>
          <p className="text-sm text-slate-500 mb-6">
            Use your campus student credentials.
          </p>



          {errorMsg && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. student"
                className="w-full text-sm px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 bg-white transition-all"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
            >
              {isLoading ? 'Signing in…' : 'Sign in to FindBack'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          FindBack · Campus student portal only
        </p>
      </div>
    </div>
  );
};
