import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { GlobalLoader } from './components/ui';
import { loadingEmitter, systemGate } from './api/service';
import Analytics from './pages/Analytics';
import Directory from './pages/Directory';
import TimeLine from './pages/TimeLine';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuth') === 'true';
  });
  
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Subscribe to global loading states
    loadingEmitter.subscribe(setIsGlobalLoading);

    // Keep-Alive Heartbeat for Render (every 40 seconds)
    const interval = setInterval(() => {
        systemGate.heartbeat().catch(() => {});
    }, 40000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#111827', color: '#fff', borderRadius: '1rem', border: '1px solid #1f2937' } }} />
        {isGlobalLoading && <GlobalLoader />}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#111827', color: '#fff', borderRadius: '1rem', border: '1px solid #1f2937' } }} />
      
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-300">
        {/* Sidebar for Desktop */}
        <Sidebar className="hidden lg:flex flex-col w-72 h-full" />

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity animate-in fade-in" 
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-gray-950 shadow-2xl animate-in slide-in-from-left duration-300">
              <Sidebar 
                className="w-full h-full border-none" 
                onLinkClick={() => setMobileMenuOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            onMenuClick={() => setMobileMenuOpen(true)}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
            <div className="max-w-7xl mx-auto text-gray-900 dark:text-white pb-20">
              <Routes>
                <Route path="/dashboard" element={<Analytics />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/timeline" element={<TimeLine />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
