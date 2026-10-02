import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ClaimModal } from './components/ClaimModal';
import { EditReportModal } from './components/EditReportModal';

import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { activeTab, currentUser } = useApp();

  // Landing page and login are full-width website-style pages
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col text-slate-900" style={{ backgroundColor: '#FAFAF7' }}>
        <Navbar />
        <main className="flex-1">
          {activeTab === 'login' ? <LoginPage /> : <AboutPage />}
        </main>
        <Footer />
      </div>
    );
  }

  // After login: dashboard layout with container
  return (
    <div className="min-h-screen flex flex-col text-slate-900" style={{ backgroundColor: '#F4F4F1' }}>
      <Navbar />
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {(activeTab === 'home' || activeTab === 'about') && <HomePage />}
        {activeTab === 'report' && <ReportPage />}
        {activeTab === 'my-reports' && <MyReportsPage />}
      </main>
      <Footer />

      {/* Global Modals */}
      <ItemDetailModal />
      <ClaimModal />
      <EditReportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
