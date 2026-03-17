import React from 'react';
import { Menu, Moon, Sun, Bell, Terminal, LogOut } from 'lucide-react';

export const Navbar = ({ onMenuClick, darkMode, toggleDarkMode, onLogout }) => {
    return (
        <header className="h-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-50 dark:border-gray-900 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="lg:hidden p-3 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-2xl">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden lg:flex items-center space-x-2 text-primary-600">
                  <Terminal size={18} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">HR Management System</span>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest leading-none mb-1">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                
                <div className="w-px h-6 bg-gray-100 dark:bg-gray-800 hidden sm:block"></div>

                <div className="flex items-center space-x-2">
                  <button className="p-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-all duration-300 rounded-2xl relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-gray-950"></span>
                  </button>
                  <button
                      onClick={toggleDarkMode}
                      className="p-3 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all duration-300 rounded-2xl"
                  >
                      {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                      onClick={onLogout}
                      className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all duration-300 rounded-2xl group"
                      title="Logout"
                  >
                      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
            </div>
        </header>
    );
};
