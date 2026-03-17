import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Search, Activity, Clock, Plus, AlertCircle } from 'lucide-react';
import { Button, Card, Table, cn, GlobalLoader } from '../components/ui';
import { activityMonitor, staffRegistry } from '../api/service';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function TimeLine() {
    const [allLogs, setAllLogs] = useState([]);
    const [members, setMembers] = useState([]);
    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
    const [loading, setLoading] = useState(true);
    const [showMarkForm, setShowMarkForm] = useState(false);

    // Filters logic
    const [filterEmployee, setFilterEmployee] = useState('All');
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');

    // New Log Form
    const [markData, setMarkData] = useState({ reference_id: '', status: 'Present', date: new Date().toISOString().split('T')[0] });
    const [markLoading, setMarkLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [logsRes, membersRes] = await Promise.all([
                activityMonitor.getGlobalLogs(),
                staffRegistry.getAll()
            ]);
            setAllLogs(logsRes.data);
            setMembers(membersRes.data);

            const totalRecords = logsRes.data.length;
            const present = logsRes.data.filter(l => l.presence_status === 'Present').length;
            const absent = logsRes.data.filter(l => l.presence_status === 'Absent').length;
            setStats({ total: totalRecords, present, absent });

        } catch (err) {
            toast.error('Failed to retrieve intelligence logs');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        setMarkLoading(true);
        try {
            await activityMonitor.logEntry({
                reference_id: markData.reference_id,
                logged_date: markData.date,
                presence_status: markData.status
            });
            toast.success(`Presence authenticated for ${markData.reference_id}`);
            setShowMarkForm(false);
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'System Conflict: Entry already exists');
        } finally {
            setMarkLoading(false);
        }
    };

    const getMemberName = (refId) => {
        const m = members.find(m => m.reference_id === refId);
        return m ? m.name : 'Unknown';
    };

    const filteredLogs = allLogs.filter(log => {
        const matchesEmployee = filterEmployee === 'All' || log.reference_id === filterEmployee;
        const logDate = new Date(log.logged_date);
        const matchesFrom = !filterFrom || logDate >= new Date(filterFrom);
        const matchesTo = !filterTo || logDate <= new Date(filterTo);
        return matchesEmployee && matchesFrom && matchesTo;
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Registry <span className="text-primary-600">Dynamics</span></h1>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Personnel Presence Intelligence Flow</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-950 flex items-center group">
                    <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 mr-6 transition-transform group-hover:scale-110">
                        <Calendar className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stats.total}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Log Volume</p>
                    </div>
                </Card>
                <Card className="p-8 border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-950 flex items-center group">
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 mr-6 transition-transform group-hover:scale-110">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stats.present}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Verified Active</p>
                    </div>
                </Card>
                <Card className="p-8 border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-950 flex items-center group">
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 mr-6 transition-transform group-hover:scale-110">
                        <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stats.absent}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Idle Registered</p>
                    </div>
                </Card>
            </div>

            {/* Attendance Registry Terminal */}
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden bg-white dark:bg-gray-950">
                <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30 dark:bg-gray-900/30">
                    <div className="flex items-center">
                        <Activity className="w-5 h-5 text-primary-600 mr-3 animate-pulse" />
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase">Intelligence Records</h3>
                    </div>
                    <Button
                        onClick={() => setShowMarkForm(!showMarkForm)}
                        className="rounded-2xl h-14 px-8 shadow-xl shadow-gray-900/20 group overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center font-black text-xs uppercase tracking-widest">
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            {showMarkForm ? 'Cancel Operation' : 'Mark Attendance'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </Button>
                </div>

                {/* Mark Attendance Overlay Form */}
                {showMarkForm && (
                    <div className="p-8 border-b border-gray-50 dark:border-gray-900 bg-primary-50/20 dark:bg-primary-900/5 animate-in slide-in-from-top-4 duration-500">
                        <form onSubmit={handleMarkAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="flex flex-col space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Target Personnel</label>
                                <select
                                    className="h-14 w-full bg-white dark:bg-gray-900 border-2 border-white dark:border-gray-800 rounded-2xl px-4 text-xs font-black shadow-sm focus:border-primary-500 transition-all outline-none dark:text-white"
                                    value={markData.reference_id}
                                    onChange={(e) => setMarkData({ ...markData, reference_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select ID</option>
                                    {members.map(m => (
                                        <option key={m.reference_id} value={m.reference_id}>{m.name} ({m.reference_id})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Log Date</label>
                                <input
                                    type="date"
                                    className="h-14 w-full bg-white dark:bg-gray-900 border-2 border-white dark:border-gray-800 rounded-2xl px-4 text-xs font-black shadow-sm focus:border-primary-500 transition-all outline-none dark:text-white uppercase"
                                    value={markData.date}
                                    onChange={(e) => setMarkData({ ...markData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Presence Key</label>
                                <div className="flex bg-white dark:bg-gray-900 p-1 rounded-2xl border-2 border-white dark:border-gray-800 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setMarkData({ ...markData, status: 'Present' })}
                                        className={cn("flex-1 h-11 rounded-xl text-[10px] font-black uppercase transition-all", markData.status === 'Present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-gray-400 hover:bg-gray-50')}
                                    >
                                        In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMarkData({ ...markData, status: 'Absent' })}
                                        className={cn("flex-1 h-11 rounded-xl text-[10px] font-black uppercase transition-all", markData.status === 'Absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-gray-400 hover:bg-gray-50')}
                                    >
                                        Out
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" disabled={markLoading} className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest">
                                {markLoading ? 'Validating...' : 'Initialize'}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Filters Bar */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/10 dark:bg-gray-900/10 border-b border-gray-50 dark:border-gray-900">
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 ml-1">Identity Filter</label>
                        <select
                            className="h-12 w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-[10px] font-black text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all uppercase"
                            value={filterEmployee}
                            onChange={(e) => setFilterEmployee(e.target.value)}
                        >
                            <option value="All">All Employees</option>
                            {members.map(m => (
                                <option key={m.reference_id} value={m.reference_id}>{m.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 ml-1">Interval Start</label>
                        <input
                            type="date"
                            className="h-12 w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-[10px] font-black text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all uppercase"
                            value={filterFrom}
                            onChange={(e) => setFilterFrom(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 ml-1">Interval End</label>
                        <input
                            type="date"
                            className="h-12 w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-[10px] font-black text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all uppercase"
                            value={filterTo}
                            onChange={(e) => setFilterTo(e.target.value)}
                        />
                    </div>
                </div>

                {/* Registry Table */}
                <div className="overflow-x-auto min-h-[400px] flex flex-col">
                    {loading ? (
                        <GlobalLoader className="bg-transparent backdrop-blur-none flex-1" />
                    ) : (
                        <Table headers={['Operational Date', 'Reference ID', 'Identity Name', 'Status Integrity']} className="text-left w-full border-collapse">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Clock className="text-gray-300 dark:text-gray-700 w-8 h-8" />
                                        </div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Intelligence Records Found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log, idx) => (
                                    <tr key={idx} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-all duration-300 border-b border-gray-50/50 dark:border-gray-900/50 last:border-none">
                                        <td className="px-10 py-6 text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase">
                                            {format(new Date(log.logged_date), 'EEE, MMM do, yyyy')}
                                        </td>
                                        <td className="px-10 py-6 text-[11px] font-black text-primary-600 uppercase tracking-widest">
                                            {log.reference_id}
                                        </td>
                                        <td className="px-10 py-6 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-tighter">
                                            {getMemberName(log.reference_id)}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={cn(
                                                'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all',
                                                log.presence_status === 'Present'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                            )}>
                                                {log.presence_status === 'Present' ? (
                                                    <span className="flex items-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                                                        Present
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></div>
                                                        Absent
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </Table>
                    )}
                </div>
            </Card>
        </div>
    );
}
