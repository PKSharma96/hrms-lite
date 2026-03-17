import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Users, UserCheck, UserX, BarChart3, Rocket, Activity, Zap } from 'lucide-react';
import { Card, cn, GlobalLoader } from '../components/ui';
import { dataInsights } from '../api/service';

const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-gray-100/50 dark:border-gray-800/50">
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
            <Icon size={120} />
        </div>
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
                {trend && (
                    <div className="mt-3 flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                        <Zap size={10} className="mr-1 fill-emerald-500" />
                        {trend}
                    </div>
                )}
            </div>
            <div className={cn('p-4 rounded-2xl shadow-lg', color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </Card>
);

export default function Analytics({ setActiveTab, navigateToDirectory }) {
    const [stats, setStats] = useState({ staff_count: 0, active_today: 0, inactive_today: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    });

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    const fetchData = (date) => {
        setLoading(true);
        dataInsights.getOverview(date)
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">System Overview</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Attendance <span className="text-primary-600">Analytics</span></h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        Daily attendance overview for <span className="text-gray-900 dark:text-gray-200 font-bold underline decoration-primary-500 decoration-2">{selectedDate}</span>
                    </p>
                </div>
                {/* <div className="flex items-center bg-white dark:bg-gray-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 bg-transparent text-sm font-bold focus:outline-none dark:text-white"
                    />
                </div> */}
            </div>

            {loading ? (
                <GlobalLoader className="bg-white dark:bg-gray-950 min-h-[500px] shadow-sm border border-gray-100 dark:border-gray-800" />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <MetricCard
                            title="Total Employees"
                            value={stats.staff_count}
                            icon={Users}
                            color="bg-indigo-600"
                            trend="+2 this month"
                        />
                        <MetricCard
                            title="Present Today"
                            value={stats.active_today}
                            icon={UserCheck}
                            color="bg-emerald-600"
                            trend="Stable flow"
                        />
                        <MetricCard
                            title="Absent Today"
                            value={stats.inactive_today}
                            icon={UserX}
                            color="bg-rose-600"
                            trend="Needs review"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 p-8 border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Attendance Trend</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Weekly Trend</p>
                                </div>
                                <Activity className="text-primary-600 animate-pulse" size={20} />
                            </div>

                            <div className="h-64 flex items-end justify-between px-4 mt-8 space-x-2 md:space-x-4">
                                {[
                                    { day: 'MON', val: 85, color: 'bg-primary-600' },
                                    { day: 'TUE', val: 92, color: 'bg-primary-500' },
                                    { day: 'WED', val: 78, color: 'bg-primary-400' },
                                    { day: 'THU', val: 95, color: 'bg-primary-600' },
                                    { day: 'FRI', val: 88, color: 'bg-primary-500' },
                                    { day: 'SAT', val: 35, color: 'bg-indigo-300' },
                                    { day: 'SUN', val: 20, color: 'bg-indigo-200' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center group/bar max-w-[40px]">
                                        <div className="w-full relative h-full flex flex-col justify-end">
                                            <div
                                                className={cn("w-full rounded-t-xl transition-all duration-1000 ease-out group-hover/bar:brightness-110 shadow-lg", item.color)}
                                                style={{ height: `${item.val}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                    {item.val}% Attendance
                                                </div>
                                            </div>
                                        </div>
                                        <span className="mt-4 text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-tighter">{item.day}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-900 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-600 shadow-sm"></div>
                                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Present</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-200 shadow-sm"></div>
                                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Weekend</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-gray-900 text-white border-none shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Rocket size={100} />
                            </div>
                            <h3 className="text-xl font-black mb-2 tracking-tight uppercase">Quick Actions</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">Manage your employees and logs quickly.</p>
                            <div className="space-y-4 relative z-10">
                                <NavLink
                                    to="/directory"
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-900/50 flex items-center justify-center group"
                                >
                                    Register Employee
                                    <Rocket className="w-4 h-4 ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                </NavLink>
                                <NavLink
                                    to="/timeline"
                                    className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center"
                                >
                                    Attendance Log
                                    <Zap className="w-4 h-4 ml-2 text-primary-400" />
                                </NavLink>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
