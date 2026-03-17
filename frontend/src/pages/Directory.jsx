import React, { useEffect, useState } from 'react';
import { Trash2, Search, UserPlus, FileDown, Filter, Mail, Hash, Zap } from 'lucide-react';
import { Button, Input, Card, Table, GlobalLoader } from '../components/ui';
import { staffRegistry } from '../api/service';
import toast from 'react-hot-toast';

export default function Directory() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ reference_id: '', name: '', contact_email: '', team_unit: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        fetchRegistry();
    }, []);

    const fetchRegistry = async () => {
        try {
            const res = await staffRegistry.getAll();
            setMembers(res.data);
        } catch (err) {
            toast.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleOnboard = async (e) => {
        e.preventDefault();
        try {
            await staffRegistry.enroll(formData);
            setFormData({ reference_id: '', name: '', contact_email: '', team_unit: '' });
            setShowForm(false);
            toast.success(`${formData.name} successfully registered`);
            fetchRegistry();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Onboarding failed');
        }
    };

    const handleOffboard = async (id) => {
        if (window.confirm('Delete employee record for ID: ' + id + '?')) {
            try {
                await staffRegistry.terminate(id);
                toast.success('Employee record deleted');
                fetchRegistry();
            } catch (err) {
                toast.error('Termination operation failed');
            }
        }
    };

    const filteredRegistry = members.filter(m =>
        (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.reference_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTeam === '' || m.team_unit === selectedTeam)
    );

    const exportDataStream = () => {
        const headers = ['Ref ID', 'Name', 'Email', 'Team', 'Active Logs', 'Missed Logs'];
        const csvRows = members.map(m => [
            m.reference_id,
            m.name,
            m.contact_email,
            m.team_unit,
            m.count_present || 0,
            m.count_absent || 0
        ]);

        const content = [headers, ...csvRows].map(r => r.join(",")).join("\n");
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Staff_Registry_Export_${new Date().getTime()}.csv`;
        link.click();
        toast.success('Registry export initiated');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-800">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Employee <span className="text-primary-600">Registry</span></h1>
                    <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest flex items-center">
                        <Hash className="w-3 h-3 mr-1 text-primary-500" />
                        {members.length} Active Employee Records
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={exportDataStream} className="rounded-2xl bg-gray-50 hover:bg-gray-100 border-none px-6 text-xs font-black uppercase tracking-widest">
                        <FileDown className="w-4 h-4 mr-2 text-primary-600" />
                        Export
                    </Button>
                    <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none px-6 text-xs font-black uppercase tracking-widest">
                        <UserPlus className="w-4 h-4 mr-2" />
                        {showForm ? 'Cancel' : 'Register'}
                    </Button>
                </div>
            </div>

            {showForm && (
                <Card className="p-8 border-primary-100 dark:border-primary-900 bg-gradient-to-br from-white to-primary-50/20 dark:from-gray-900 dark:to-primary-900/5 rounded-[2rem]">
                    <h3 className="text-lg font-bold mb-6 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-primary-600" />
                        Register New Employee Profile
                    </h3>
                    <form onSubmit={handleOnboard} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <Input
                            label="Employee ID"
                            placeholder="PHR-XXXX"
                            value={formData.reference_id}
                            onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                            required
                            className="rounded-xl border-gray-200 shadow-sm"
                        />
                        <Input
                            label="Full Name"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="rounded-xl border-gray-200 shadow-sm"
                        />
                        <Input
                            label="Verified Email"
                            type="email"
                            placeholder="jsmith@hrmslite.com"
                            value={formData.contact_email}
                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                            required
                            className="rounded-xl border-gray-200 shadow-sm"
                        />
                        <div className="flex flex-col space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                            <select
                                className="h-12 w-full rounded-xl border border-gray-200 shadow-sm dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-xs font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none dark:text-white"
                                value={formData.team_unit}
                                onChange={(e) => setFormData({ ...formData, team_unit: e.target.value })}
                                required
                            >
                                <option value="">Select Unit</option>
                                <option value="Executive">Executive</option>
                                <option value="Architecture">Architecture</option>
                                <option value="Operations">Operations</option>
                                <option value="Growth">Growth</option>
                                <option value="Creative">Creative</option>
                            </select>
                        </div>
                        <div className="col-span-full lg:col-span-1">
                            <Button type="submit" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest">
                                Register Employee
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card className="rounded-[2.5rem] overflow-hidden border-gray-50 shadow-xl dark:shadow-none dark:bg-gray-900/40">
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row items-center gap-4 border-b border-gray-50 dark:border-gray-900">
                    <div className="relative flex-1 w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className="w-full pl-12 pr-4 py-4 text-sm font-medium bg-transparent focus:outline-none dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex items-center px-4">
                        <Filter className="w-4 h-4 text-gray-400 mr-2" />
                        <select
                            className="w-full py-4 text-sm font-bold bg-transparent focus:outline-none dark:text-white"
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            <option value="Executive">Executive</option>
                            <option value="Architecture">Architecture</option>
                            <option value="Operations">Operations</option>
                            <option value="Growth">Growth</option>
                            <option value="Creative">Creative</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <GlobalLoader className="bg-transparent backdrop-blur-none" />
                ) : filteredRegistry.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-400">No matching employees found.</p>
                    </div>
                ) : (
                    <Table
                        headers={['Employee Details', 'Department', 'Stats', 'Action']}
                        className="text-left"
                    >
                        {filteredRegistry.map((m) => (
                            <tr key={m.reference_id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-all duration-300">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-black mr-4 shadow-md">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{m.name}</div>
                                            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase mt-0.5 tracking-tighter">
                                                <Mail className="w-2.5 h-2.5 mr-1" />
                                                {m.contact_email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50">
                                        {m.team_unit}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-6">
                                        <div className="text-center group">
                                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter group-hover:text-emerald-500 transition-colors">Active</div>
                                            <div className="text-emerald-600 dark:text-emerald-400 font-black text-lg leading-none mt-1">{m.count_present || 0}</div>
                                        </div>
                                        <div className="w-px h-6 bg-gray-100 dark:bg-gray-800"></div>
                                        <div className="text-center group">
                                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter group-hover:text-rose-500 transition-colors">Idle</div>
                                            <div className="text-rose-600 dark:text-rose-400 font-black text-lg leading-none mt-1">{m.count_absent || 0}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => handleOffboard(m.reference_id)}
                                        className="text-gray-300 dark:text-gray-700 hover:text-rose-600 dark:hover:text-rose-400 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-300"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </div>
    );
}
