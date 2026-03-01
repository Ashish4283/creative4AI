import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboardStats } from '../../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAdminDashboardStats();
                if (res.status === 'success') {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching admin stats", error);
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
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
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
                            A
                        </div>
                        <span className="font-semibold text-xl tracking-tight text-white">Admin Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                            {user?.role}
                        </span>
                        <button onClick={handleLogout} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
                    <p className="text-zinc-400">System metrics and recent SaaS users.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-zinc-400 font-medium text-sm mb-1 uppercase tracking-wider">Total Users</h3>
                        <p className="text-5xl font-black text-white">{data?.stats?.total_users || 0}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                    >
                        <h3 className="text-zinc-400 font-medium text-sm mb-1 uppercase tracking-wider">Total Workflows</h3>
                        <p className="text-5xl font-black text-indigo-400">{data?.stats?.total_workflows || 0}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                    >
                        <h3 className="text-zinc-400 font-medium text-sm mb-1 uppercase tracking-wider">Total Admins</h3>
                        <p className="text-5xl font-black text-rose-400">{data?.stats?.total_admins || 0}</p>
                    </motion.div>
                </div>

                {/* Users Table */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold font-outfit">Recent Registrations</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-900/80">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800 bg-zinc-900/30">
                                {data?.recent_users?.map((usr) => (
                                    <tr key={usr.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-mono">#{usr.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{usr.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-400">{usr.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usr.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                                {usr.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                            {new Date(usr.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
