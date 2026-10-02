import React from 'react';
import { useApp } from '../context/AppContext';
import logoImg from '../assets/findback-logo.png';

export const AboutPage: React.FC = () => {
  const { setActiveTab, currentUser } = useApp();

  return (
    <div className="w-full" style={{ backgroundColor: '#FAFAF7' }}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAFAF7' }} className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-20 sm:py-28 flex flex-col sm:flex-row sm:items-center gap-12 sm:gap-16">

          {/* Left */}
          <div className="flex-1 max-w-xl">
            {/* Logo + wordmark lockup */}
            <div className="flex items-center gap-3 mb-8">
              <img src={logoImg} alt="FindBack" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">FindBack</div>
                <div className="text-xs text-slate-400">Campus Lost &amp; Found</div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
              Lost something<br />on campus?
            </h1>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              FindBack is a simple, honest lost &amp; found system for students. Report what you lost, browse what others found, and safely reclaim your belongings.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab(currentUser ? 'home' : 'login')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                {currentUser ? 'Open FindBack →' : 'Get Started →'}
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-stone-300 hover:border-stone-400 bg-white rounded-md transition-colors cursor-pointer"
              >
                How it works
              </button>
            </div>
          </div>

          {/* Right — stats card */}
          <div className="shrink-0 w-full sm:w-72">
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
              {/* card header */}
              <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2.5">
                <img src={logoImg} alt="" className="w-6 h-6 rounded-md object-cover" />
                <span className="text-sm font-semibold text-slate-800">FindBack</span>
                <span className="ml-auto text-xs text-stone-400">v1.0</span>
              </div>
              {/* stats */}
              <div className="px-5 py-4 space-y-4">
                {[
                  { label: 'Active listings', value: '15+' },
                  { label: 'Average match time', value: '< 24 hrs' },
                  { label: 'Student verified', value: '100%' },
                  { label: 'Storage backend', value: 'SQLite' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{s.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>
              {/* card footer */}
              <div className="px-5 py-3 border-t border-stone-100 bg-stone-50">
                <button
                  onClick={() => setActiveTab(currentUser ? 'home' : 'login')}
                  className="w-full py-1.5 text-sm font-medium text-slate-900 hover:text-slate-900 transition-colors cursor-pointer text-center"
                >
                  {currentUser ? 'Open catalog →' : 'Sign in to access →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY WE BUILT IT ──────────────────────────────── */}
      <section className="bg-white border-b border-stone-200 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="mb-10">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-widest">Why FindBack</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-3">
              Built for the campus lost &amp; found problem
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Notice boards get ignored. WhatsApp groups are chaotic. FindBack gives lost items a proper home — with photos, locations, categories, and verified ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                label: '01',
                title: 'Smart Search',
                desc: 'Search by name, category, or location. Gemini AI understands natural descriptions so you don\'t have to guess the right keywords.',
              },
              {
                label: '02',
                title: 'Verified Claims',
                desc: 'Anyone can browse — but claiming an item requires proof. Claimants submit their student ID and item-specific details before approval.',
              },
              {
                label: '03',
                title: 'Real Backend',
                desc: 'Data lives in a local SQLite database via an Express REST API — not just localStorage. It actually persists and syncs correctly.',
              },
            ].map((f) => (
              <div
                key={f.label}
                className="border border-stone-200 rounded-xl p-6 bg-stone-50 hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="text-3xl font-bold text-stone-200 select-none">{f.label}</span>
                <h3 className="text-base font-semibold text-slate-900 mt-2 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" style={{ backgroundColor: '#FAFAF7' }} className="border-b border-stone-200 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="mb-10">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-widest">How FindBack works</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Three steps, that's it</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                step: '1',
                title: 'Report an item',
                desc: 'Upload a photo, pick a category and campus location, and add a short description. Takes under a minute.',
              },
              {
                step: '2',
                title: 'Browse & search',
                desc: 'Filter by lost/found, category, or location. The search bar finds items by name, description, or place.',
              },
              {
                step: '3',
                title: 'Claim & collect',
                desc: 'Submit your student ID and proof of ownership. The finder reviews it and you arrange a pickup.',
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 sm:flex-col sm:gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 text-sm font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 mb-1.5">{s.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ───────────────────────────────────── */}
      <section className="bg-white border-b border-stone-200 py-16 sm:py-20" data-section="stack">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="mb-10">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-widest">Tech stack</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">What powers FindBack</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'React 19', sub: 'UI' },
              { name: 'TypeScript', sub: 'Types' },
              { name: 'Vite', sub: 'Build' },
              { name: 'Tailwind CSS', sub: 'Styling' },
              { name: 'Gemini AI', sub: 'Search' },
              { name: 'SQLite', sub: 'Database' },
            ].map((t) => (
              <div key={t.name} className="p-4 border border-stone-200 rounded-lg bg-stone-50 text-center hover:border-stone-300 hover:bg-white transition-all">
                <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t.sub}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs text-slate-400 space-y-1">
            <p>
              Frontend:{' '}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-slate-600">localhost:3000</code>
              {' '}→ proxied to Express at{' '}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-slate-600">localhost:5000</code>
            </p>
            <p>
              Database:{' '}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-slate-600">campus_lost_found.db</code>
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAFAF7' }} className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="bg-white border border-stone-200 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <img src={logoImg} alt="FindBack" className="w-10 h-10 rounded-xl object-cover shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  Ready to use FindBack?
                </h2>
                <p className="text-sm text-slate-500">
                  Demo credentials:{' '}
                  <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-slate-700 text-xs">student</code>
                  {' '}·{' '}
                  <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-slate-700 text-xs">student123</code>
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab(currentUser ? 'home' : 'login')}
              className="shrink-0 px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              {currentUser ? 'Open Catalog →' : 'Student Login →'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
