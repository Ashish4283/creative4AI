import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, colorClass }) {
    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            {/* Background Glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.bg}`}></div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-slate-950/50 border border-white/5 ${colorClass.text}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`text-xs font-medium px-2 py-1 rounded-full border ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            trend < 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <div className="text-3xl font-bold text-white font-outfit tracking-tight">{value}</div>
                {trendLabel && <p className="text-xs text-slate-500 mt-2">{trendLabel}</p>}
            </div>
        </div>
    );
}
