import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Clock, BarChart3, ShieldCheck, X } from 'lucide-react';
import { cn } from '../ui';

const SidebarItem = ({ icon: Icon, label, to, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => cn(
            'flex items-center w-full px-4 py-4 text-sm font-semibold transition-all duration-300 rounded-2xl group relative overflow-hidden',
            isActive
                ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400'
        )}
    >
        {({ isActive }) => (
            <>
                <Icon className={cn('w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110', isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500')} />
                <span className="relative z-10 uppercase tracking-tighter">{label}</span>
                {isActive && (
                    <span className="absolute right-0 top-0 h-full w-1.5 bg-white opacity-40 rounded-l-full animate-in fade-in slide-in-from-right-1"></span>
                )}
            </>
        )}
    </NavLink>
);

export const Sidebar = ({ onLinkClick, className, onClose }) => {
    const items = [
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/directory', label: 'Employee Registry', icon: Users },
        { path: '/timeline', label: 'Attendance Log', icon: Clock },
    ];

    return (
        <aside className={cn("bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-900", className)}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-8 h-20 border-b border-gray-50 dark:border-gray-900">
                    <div className="flex items-center">
                        <div className="p-2.5 bg-primary-600 rounded-xl mr-3 shadow-lg shadow-primary-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                            HRMS <span className="text-primary-600">Lite</span>
                        </span>
                    </div>
                    {onClose && (
                        <button 
                            onClick={onClose}
                            className="lg:hidden p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="px-6 py-10">
                    <nav className="space-y-3">
                        {items.map((item) => (
                            <SidebarItem
                                key={item.path}
                                label={item.label}
                                icon={item.icon}
                                to={item.path}
                                onClick={onLinkClick}
                            />
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8">
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                        <div className="flex items-center space-x-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform">
                                AD
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-black text-gray-900 dark:text-white tracking-widest truncate">ADMIN</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
