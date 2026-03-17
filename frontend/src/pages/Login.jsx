import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Activity, Sun, Moon } from 'lucide-react';
import { Card } from '../components/ui';
import toast from 'react-hot-toast';

export default function Login({ onLogin, darkMode, toggleDarkMode }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate auth
        setTimeout(() => {
            if (username === 'Admin' && password === '12345') {
                toast.success('Access Granted: System Initialized');
                onLogin();
            } else {
                toast.error('Invalid Credentials: Access Denied');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-500">
            {/* Theme Toggle Button */}
            <div className="absolute top-8 right-8 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-xl hover:scale-110 transition-all duration-300 group"
                >
                    {darkMode ? (
                        <Sun className="text-amber-400 group-hover:rotate-90 transition-transform duration-500" size={24} />
                    ) : (
                        <Moon className="text-primary-600 group-hover:-rotate-12 transition-transform duration-500" size={24} />
                    )}
                </button>
            </div>
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-primary-600 rounded-[2rem] shadow-2xl shadow-primary-600/20 mb-6">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                        HRMS <span className="text-primary-600">Lite</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Attendance Management System</p>
                </div>

                <Card className="p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-gray-100 dark:border-gray-900">
                    <div className="mb-8 p-6 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-3xl">
                        <div className="flex items-center text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-2">
                            <Activity size={14} className="mr-2 animate-pulse" />
                            System Login
                        </div>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">
                            Use authorized credentials to initialize the attendance environment:
                            <span className="block mt-2 text-primary-600 dark:text-primary-400 font-black">
                                USERNAME: Admin / PASSWORD: 12345
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Username</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 dark:bg-gray-900 dark:border-gray-800 dark:text-white focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none font-bold text-sm"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Password</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 dark:bg-gray-900 dark:border-gray-800 dark:text-white focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none font-bold text-sm"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm transition-all duration-300 shadow-xl shadow-primary-600/20 flex items-center justify-center group disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    SECURE LOGIN
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
