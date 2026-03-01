import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LayoutDashboard, Workflow, Users, Settings, LogOut, Bell, Search, Plus, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from './StatCard';

const MOCK_WORKFLOWS = [
    { id: 1, name: 'Customer Onboarding', status: 'Active', runs: 1240, successRate: '98%', lastRun: '2 mins ago' },
    { id: 2, name: 'Lead Enrichment', status: 'Active', runs: 856, successRate: '100%', lastRun: '15 mins ago' },
    { id: 3, name: 'Daily Data Sync', status: 'Paused', runs: 45, successRate: '85%', lastRun: '1 day ago' },
    { id: 4, name: 'Support Ticket Router', status: 'Failed', runs: 320, successRate: '60%', lastRun: '5 mins ago' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        localStorage.removeItem('saas_token');
        localStorage.removeItem('saas_user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
                            <Brain className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-outfit font-bold text-lg tracking-tight">Reasoning Engine</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>
                        <LayoutDashboard className="w-4 h-4" /> Overview
                    </button>
                    <button onClick={() => setActiveTab('workflows')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'workflows' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>
                        <Workflow className="w-4 h-4" /> Workflows
                    </button>
                    <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'team' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>
                        <Users className="w-4 h-4" /> Team
                    </button>
                </div>

                <div className="p-4 border-t border-slate-800 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl z-10">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search workflows, runs, or data..."
                                className="w-full bg-slate-900 focus:bg-slate-950 border border-slate-800 focus:border-primary/50 text-sm rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-slate-950"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-500 p-[2px]">
                            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Canvas */}
                <main className="flex-1 overflow-y-auto p-8 relative z-10">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold font-outfit tracking-tight text-white mb-1">Overview</h1>
                            <p className="text-slate-400">Welcome back, John. Here's what's happening today.</p>
                        </div>
                        <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            <Plus className="w-4 h-4" /> New Workflow
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Automations" value="24" trend={12} trendLabel="vs last month" icon={Workflow} colorClass={{ bg: 'bg-primary', text: 'text-primary' }} />
                        <StatCard title="Successful Runs" value="8,402" trend={5.4} trendLabel="vs last month" icon={Activity} colorClass={{ bg: 'bg-emerald-500', text: 'text-emerald-500' }} />
                        <StatCard title="Failed Runs" value="12" trend={-20} trendLabel="vs last month" icon={Activity} colorClass={{ bg: 'bg-red-500', text: 'text-red-500' }} />
                        <StatCard title="Active Team Members" value="5" icon={Users} colorClass={{ bg: 'bg-indigo-500', text: 'text-indigo-500' }} />
                    </div>

                    {/* Recent Workflows Section */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold font-outfit text-white">Recent Workflows</h2>
                            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1 text-sm">
                                View All <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-4 font-semibold">Workflow Name</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Total Runs</th>
                                        <th className="px-6 py-4 font-semibold">Success Rate</th>
                                        <th className="px-6 py-4 font-semibold text-right">Last Run</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {MOCK_WORKFLOWS.map((wf) => (
                                        <tr key={wf.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => navigate('/')}>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-200 group-hover:text-primary transition-colors">{wf.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${wf.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    wf.status === 'Failed' ? 'bg-red-500/10 text-red-400' :
                                                        'bg-slate-500/10 text-slate-400'
                                                    }`}>
                                                    {wf.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>}
                                                    {wf.status === 'Failed' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5"></span>}
                                                    {wf.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 font-mono">{wf.runs.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${parseInt(wf.successRate) > 90 ? 'bg-emerald-500' : parseInt(wf.successRate) > 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: wf.successRate }}></div>
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-mono">{wf.successRate}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400 text-xs">{wf.lastRun}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
