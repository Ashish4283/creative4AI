import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, X, Check, Users, Shield, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listAllUsers, assignWorkflow } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function DelegationModal({ workflow, isOpen, onClose, onSuccess }) {
    const { user: currentUser } = useAuth();
    const [team, setTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTeam();
            setSelectedUserId(workflow?.assigned_to || null);
        }
    }, [isOpen]);

    const fetchTeam = async () => {
        setIsLoading(true);
        try {
            const res = await listAllUsers();
            if (res.status === 'success') {
                // Filter to only show users in the same group or managed by this person
                let members = res.data;
                if (currentUser.role !== 'admin') {
                    members = members.filter(m => m.manager_id == currentUser.id || m.id == currentUser.id);
                }
                setTeam(members.filter(m => m.id !== currentUser.id)); // Don't show self for delegation
            }
        } catch (error) {
            console.error("Team fetch error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedUserId) return;
        setIsProcessing(true);
        try {
            const res = await assignWorkflow(workflow.id, selectedUserId);
            if (res.status === 'success') {
                toast({ title: "Protocol Delegated", description: `Task assigned successfully.` });
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast({ title: "Assignment Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredTeam = team.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-950 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1 px-2 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                                            Workflow Delegation
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Delegate Protocol</h3>
                                    <p className="text-slate-500 text-sm mt-1">Assign "{workflow?.name}" to a specialized agent.</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search for an agent..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-medium text-white"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[350px] overflow-y-auto p-4 space-y-2">
                            {isLoading ? (
                                <div className="py-20 text-center animate-pulse text-slate-600 text-[10px] font-black uppercase tracking-widest">Identifying Agents...</div>
                            ) : filteredTeam.length === 0 ? (
                                <div className="py-20 text-center space-y-4">
                                    <Users className="w-12 h-12 text-slate-800 mx-auto" />
                                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No available agents in this sector</p>
                                </div>
                            ) : (
                                filteredTeam.map(member => (
                                    <button
                                        key={member.id}
                                        onClick={() => setSelectedUserId(member.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-2xl transition-all border group",
                                            selectedUserId === member.id
                                                ? "bg-primary/20 border-primary/40 shadow-xl shadow-primary/10"
                                                : "bg-white/[0.02] border-transparent hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-all",
                                                selectedUserId === member.id ? "bg-primary border-primary text-white" : "bg-zinc-900 border-white/10 text-slate-500"
                                            )}>
                                                {member.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col items-start px-3">
                                                <span className="font-bold text-white transition-colors capitalize">{member.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{member.role}</span>
                                                    {member.group_name && <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">• {member.group_name}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedUserId === member.id && (
                                            <div className="bg-primary p-1.5 rounded-full shadow-lg shadow-primary/20">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4">
                            <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold px-6">Cancel</Button>
                            <Button
                                disabled={!selectedUserId || isProcessing}
                                onClick={handleAssign}
                                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-10 h-12 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                            >
                                {isProcessing ? "Processing..." : "Confirm Delegation"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
