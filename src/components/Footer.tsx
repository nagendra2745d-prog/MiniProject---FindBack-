import React from 'react';
import { useApp } from '../context/AppContext';
import logoImg from '../assets/findback-logo.png';

export const Footer: React.FC = () => {
  const { currentUser, setActiveTab, logout } = useApp();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="FindBack" className="w-5 h-5 rounded object-cover" />
          <span className="font-semibold text-slate-600">FindBack</span>
          <span className="text-stone-300 mx-1">·</span>
          <span>Campus Lost &amp; Found · College mini project</span>
        </div>

        <div className="flex items-center gap-4">
          {!currentUser ? (
            <button
              onClick={() => setActiveTab('login')}
              className="hover:text-slate-700 transition-colors cursor-pointer"
            >
              Student Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="hover:text-slate-700 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
