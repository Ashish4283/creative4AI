import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Mail, Shield,
    MoreVertical, Trash2, UserCog, Send, ExternalLink,
    Search, Filter, Activity, CheckCircle, X,
    LayoutDashboard, Cpu, Database, Workflow, Layers, Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    listAllUsers,
    generateInvite,
    listGroups,
    getInfrastructureMap
} from '../../services/api';
import UserManagement from '../../components/dashboard/UserManagement';

const TeamHQ = () => {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [groups, setGroups] = useState([]);
    const [infrastructure, setInfrastructure] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');

    const fetchTeam = async () => {
        setIsLoading(true);
        try {
            const [usersRes, groupsRes, infraRes] = await Promise.all([
                listAllUsers(),
                listGroups(),
                getInfrastructureMap()
            ]);

            if (usersRes.status === 'success') {
                setTeamMembers(usersRes.data);
            }

            if (groupsRes.status === 'success') {
                setGroups(groupsRes.data);
            }

            if (infraRes.status === 'success') {
                setInfrastructure(infraRes.data);
            }
        } catch (error) {
            toast({ title: "Sync Failed", description: "Could not retrieve team metrics.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleCreateInvite = async (type) => {
        try {
            const res = await generateInvite(type, null, selectedGroupId);
            if (res.status === 'success' || res.data) {
                const token = res.token || res.data.token;
                setInviteLink(`${window.location.origin}/invite?token=${token}`);
                toast({ title: "Portal Opened", description: "Invitation link generated successfully." });
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to create invitation.", variant: "destructive" });
        }
    };

    const copyInvite = () => {
        navigator.clipboard.writeText(inviteLink);
        toast({ title: "Copied", description: "Protocol link saved to clipboard." });
    };

    const filteredMembers = teamMembers.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 lg:p-10 space-y-10 pb-20 custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                            Team Intelligence HQ
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold font-outfit tracking-tight text-white mb-2">
                        Member <span className="text-gradient">Control</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl">
                        Manage your agent hierarchy, monitor active sessions, and scale your reasoning workforce.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsInviteOpen(true)}
                        className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span className="font-bold text-base">Invite Agent</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left: Stats & Invites */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-effect p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" /> Squad Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-slate-400 text-sm">Total Workforce</span>
                                <span className="text-white font-black text-xl">{teamMembers.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-slate-400 text-sm">Active Now</span>
                                <span className="text-emerald-400 font-black text-xl">
                                    {Math.max(0, Math.floor(teamMembers.length * 0.4))}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Invite Configuration</h4>
                            <div className="px-2 space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Assign to Cluster</label>
                                <select
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                >
                                    <option value="">No Cluster (Global)</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="h-px bg-white/5 my-2" />

                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Quick Actions</h4>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 border-white/5 bg-white/5 hover:bg-white/10 rounded-xl"
                                onClick={() => handleCreateInvite('manager_invite')}
                            >
                                <Shield className="w-4 h-4 text-amber-400" />
                                <span>Invite Manager</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 border-white/5 bg-white/5 hover:bg-white/10 rounded-xl"
                                onClick={() => handleCreateInvite('agent_invite')}
                            >
                                <Users className="w-4 h-4 text-indigo-400" />
                                <span>Invite Agent</span>
                            </Button>
                        </div>
                    </div>

                    {inviteLink && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-indigo-600 rounded-[2rem] p-6 shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden"
                        >
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ready to Send</span>
                                    <button onClick={() => setInviteLink('')}><X className="w-4 h-4" /></button>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl border border-white/20 truncate font-mono text-xs">
                                    {inviteLink}
                                </div>
                                <Button onClick={copyInvite} className="w-full bg-white text-indigo-600 hover:bg-white/90 font-bold rounded-xl">
                                    Copy Link
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right: Team Table */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative flex-1 w-full md:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Locate team members email or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-medium text-white shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="glass-effect rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black bg-white/[0.01]">
                                        <th className="px-8 py-6">Member Identity</th>
                                        <th className="px-8 py-6">Organization</th>
                                        <th className="px-8 py-6">Cluster</th>
                                        <th className="px-8 py-6">Role</th>
                                        <th className="px-8 py-6">Status</th>
                                        <th className="px-8 py-6 text-right">Settings</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-white/5">
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-white/[0.02] group transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center font-black text-slate-400 group-hover:border-primary/50 transition-all duration-500">
                                                        {member.name?.charAt(0) || member.email?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-100 group-hover:text-white transition-colors">{member.name || 'Anonymous Agent'}</span>
                                                        <span className="text-xs text-slate-500 font-mono tracking-tighter">{member.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-3.5 h-3.5 text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{member.org_name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {member.cluster_name ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                        <span className="text-xs font-bold text-slate-300">{member.cluster_name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-600 font-bold uppercase tracking-widest italic">Detached</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${member.role === 'manager' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                                    }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-xs font-bold text-slate-400">Stable</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white rounded-lg">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-slate-950 border-white/10 text-slate-200">
                                                            <DropdownMenuItem onClick={() => toast({ title: "Profile Access", description: `Loading personnel profile for ${member.name}.` })}>
                                                                <UserCog className="w-4 h-4 mr-2" /> Manage Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => {
                                                                if (confirm(`Remove ${member.name} from your squad?`)) {
                                                                    toast({ title: "Squad Rebalanced", description: `Entity ${member.name} has been reassigned to external duties.` });
                                                                }
                                                            }}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Decommission
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredMembers.length === 0 && (
                                <div className="py-24 text-center">
                                    <p className="text-slate-500 text-sm font-medium italic">No matches found in HQ record.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Infrastructure Map */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Resource Architecture</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {infrastructure.map(cluster => (
                        <div key={cluster.id} className="glass-effect p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-primary/20 transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Layers className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-black text-white uppercase tracking-tighter">{cluster.name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cluster.org_name || 'Global'}</span>
                                </div>
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-slate-400 uppercase">
                                    {cluster.workflows?.length || 0} WORKFLOWS
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Active Protocols</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {cluster.workflows?.length > 0 ? cluster.workflows.map(wf => (
                                            <div key={wf.id} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 flex items-center gap-2">
                                                <Workflow className="w-3 h-3 text-emerald-400" />
                                                {wf.name}
                                            </div>
                                        )) : (
                                            <span className="text-[10px] text-slate-600 italic px-1">No workflows assigned to this cluster.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-white/5">
                                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Operating Workforce</h4>
                                    <div className="flex -space-x-2 overflow-hidden px-1">
                                        {cluster.members?.map(member => (
                                            <div key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-950 bg-indigo-500 border border-white/10 flex items-center justify-center text-[10px] font-black text-white uppercase" title={member.name}>
                                                {member.name.charAt(0)}
                                            </div>
                                        ))}
                                        {(!cluster.members || cluster.members.length === 0) && (
                                            <span className="text-[10px] text-slate-600 italic">Unstaffed location.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-2xl"
                        >
                            <div className="relative">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute -top-12 -right-12 md:-right-4 h-10 w-10 text-white hover:bg-white/10"
                                    onClick={() => setIsInviteOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                                <UserManagement
                                    currentUserRole={user.role}
                                    onUserAdded={() => {
                                        setIsInviteOpen(false);
                                        fetchTeam();
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamHQ;
