import React from 'react';
import { useApp } from '../context/AppContext';
import logoImg from '../assets/findback-logo.png';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, logout } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <button
          onClick={() => setActiveTab(currentUser ? 'home' : 'about')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            src={logoImg}
            alt="FindBack logo"
            className="w-7 h-7 rounded-lg object-cover"
          />
          <span className="font-bold text-base text-slate-900 tracking-tight group-hover:text-slate-900 transition-colors">
            FindBack
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5 text-sm text-slate-600">
          {currentUser ? (
            // ── DASHBOARD NAV ──────────────────────────────────
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'hover:bg-stone-50 hover:text-slate-900'
                }`}
              >
                Browse
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'hover:bg-stone-50 hover:text-slate-900'
                }`}
              >
                Report Item
              </button>

              <button
                onClick={() => setActiveTab('my-reports')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                  activeTab === 'my-reports'
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'hover:bg-stone-50 hover:text-slate-900'
                }`}
              >
                My Reports
              </button>
            </>
          ) : (
            // ── LANDING NAV ────────────────────────────────────
            <>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3 py-1.5 rounded-md text-sm hover:bg-stone-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                How it Works
              </button>
              <button
                onClick={() => document.querySelector('[data-section="stack"]')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3 py-1.5 rounded-md text-sm hover:bg-stone-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Tech Stack
              </button>
            </>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">
                {currentUser.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              Login →
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
