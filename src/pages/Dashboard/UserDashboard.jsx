import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserDashboardStats } from '../../services/api';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getUserDashboardStats();
                if (res.status === 'success') {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white border-none">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-outfit selection:bg-indigo-500/30">
            {/* Header */}
            <header className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-lg">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-semibold text-xl tracking-tight">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/builder')}
                            className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-sm font-medium"
                        >
                            + New Workflow
                        </motion.button>
                        <button onClick={handleLogout} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {data?.user?.name || user?.name}</h1>
                    <p className="text-zinc-400">Here's what's happening with your workflows today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h3 className="text-zinc-400 font-medium text-sm mb-1">Total Workflows</h3>
                        <p className="text-4xl font-bold text-white">{data?.stats?.total_workflows || 0}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-16 h-16 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-zinc-400 font-medium text-sm mb-1">End User Interactions</h3>
                        <p className="text-4xl font-bold text-white">{data?.stats?.total_app_users || 0}</p>
                    </motion.div>
                </div>

                {/* Recent Workflows */}
                <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Recent Workflows
                    </h2>

                    {!data?.recent_workflows || data.recent_workflows.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-zinc-900/20">
                            <p className="text-zinc-500 mb-4">You haven't created any workflows yet.</p>
                            <button onClick={() => navigate('/builder')} className="text-indigo-400 hover:text-indigo-300 font-medium">Create your first workflow &rarr;</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.recent_workflows.map((wf, idx) => (
                                <motion.div
                                    key={wf.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 border border-white/5 bg-zinc-900/50 rounded-xl hover:bg-zinc-800/80 transition-colors cursor-pointer flex justify-between items-center group"
                                    onClick={() => navigate('/builder')}
                                >
                                    <div>
                                        <h3 className="font-semibold text-lg text-zinc-200 group-hover:text-indigo-400 transition-colors">{wf.name}</h3>
                                        <p className="text-xs text-zinc-500 mt-1">Last edited: {new Date(wf.updated_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                        &rarr;
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
