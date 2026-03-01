import React, { memo } from 'react';
import BaseNode from './BaseNode';
import { PlayCircle, Zap, FileText, Download, Box, Database, Terminal, FileSpreadsheet, Bot, Wand2, Activity, Globe, Send, Image, LayoutPanelLeft } from 'lucide-react';

const NODE_TYPES = {
    // TRIGGERS
    default: { icon: Zap, title: 'Start Trigger', colors: { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' }, isEntry: true },
    webhookNode: { icon: Globe, title: 'Webhook Trigger', colors: { border: 'border-fuchsia-500', text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]' }, isEntry: true },
    appNode: { icon: LayoutPanelLeft, title: 'User App UI', colors: { border: 'border-pink-500', text: 'text-pink-400', bg: 'bg-pink-500/10', shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]' }, help: "Creates an interactive form for end users" },

    // AI / PROCESSING
    aiNode: { icon: Bot, title: 'AI Model', colors: { border: 'border-violet-500', text: 'text-violet-400', bg: 'bg-violet-500/10', shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' }, help: "Runs generative AI tasks" },
    pythonNode: { icon: Terminal, title: 'Python Script', colors: { border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' } },
    logicNode: { icon: Activity, title: 'Logic / Condition', colors: { border: 'border-indigo-500', text: 'text-indigo-400', bg: 'bg-indigo-500/10', shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.3)]' }, routes: [{ id: 'true', colorClass: '!border-green-500' }, { id: 'false', colorClass: '!border-red-500' }] },
    mediaConvert: { icon: Image, title: 'Media Converter', colors: { border: 'border-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10', shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' } },

    // INTEGRATIONS & OUTPUT
    httpRequestNode: { icon: Globe, title: 'HTTP Request', colors: { border: 'border-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' } },
    sqlNode: { icon: Database, title: 'SQL Query', colors: { border: 'border-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' } },
    googleSheetsNode: { icon: FileSpreadsheet, title: 'Google Sheets', colors: { border: 'border-emerald-600', text: 'text-emerald-500', bg: 'bg-emerald-600/10', shadow: 'shadow-[0_0_15px_rgba(5,150,105,0.3)]' } },
    emailNode: { icon: Send, title: 'Send Email', colors: { border: 'border-red-500', text: 'text-red-400', bg: 'bg-red-500/10', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' } },
    exportNode: { icon: Download, title: 'Export / End', colors: { border: 'border-teal-500', text: 'text-teal-400', bg: 'bg-teal-500/10', shadow: 'shadow-[0_0_15px_rgba(20,184,166,0.3)]' }, isEnd: true },

    // UTILS
    setNode: { icon: Box, title: 'Set Variable', colors: { border: 'border-slate-400', text: 'text-slate-300', bg: 'bg-slate-400/10', shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]' } },
    fileNode: { icon: FileText, title: 'Read File', colors: { border: 'border-slate-500', text: 'text-slate-400', bg: 'bg-slate-500/10', shadow: 'shadow-[0_0_15px_rgba(100,116,139,0.3)]' } }
};

const WorkflowNode = ({ id, data, selected }) => {
    // Fallback to a generic node type if not found
    const typeDef = NODE_TYPES[data.type] || { icon: Box, title: 'Generic Node', colors: { border: 'border-slate-500', text: 'text-slate-400', bg: 'bg-slate-500/10', shadow: 'shadow-[0_0_15px_rgba(100,116,139,0.3)]' } };

    // Determine dynamic properties (e.g. dynamic routes for Logic)
    const routes = data.type === 'logicNode' || data.type === 'ifNode' ? [{ id: 'true', colorClass: '!border-green-500' }, { id: 'false', colorClass: '!border-red-500' }] : undefined;

    return (
        <BaseNode
            id={id}
            data={{ ...data, isEntry: typeDef.isEntry, isEnd: typeDef.isEnd, routes }}
            selected={selected}
            icon={typeDef.icon}
            title={typeDef.title}
            colorClass={typeDef.colors.text}
            borderClass={typeDef.colors.border}
            bgClass={typeDef.colors.bg}
            shadowClass={typeDef.colors.shadow}
            helpText={typeDef.help}
        >
            {/* Contextual content inside the node based on type */}
            <div className="flex flex-col gap-1.5">
                {data.type === 'default' && data.triggerType && (
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-1.5 rounded border border-slate-800 flex justify-between">
                        <span>Type:</span> <span className="text-amber-400">{data.triggerType.toUpperCase()}</span>
                    </div>
                )}

                {data.type === 'appNode' && (
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-1.5 rounded border border-slate-800">
                        {data.fields?.length || 0} fields configured
                    </div>
                )}

                {data.type === 'aiNode' && data.taskType && (
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-1.5 rounded border border-slate-800 flex justify-between">
                        <span>Task:</span> <span className="text-violet-400">{data.taskType}</span>
                    </div>
                )}

                {data.type === 'httpRequestNode' && data.url && (
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-1.5 rounded border border-slate-800 truncate" title={data.url}>
                        {data.method || 'GET'} {new URL(data.url).hostname}
                    </div>
                )}

                {data.type === 'exportNode' && data.destination && (
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-1.5 rounded border border-slate-800 flex justify-between">
                        <span>To:</span> <span className="text-teal-400 hover:text-teal-300">{data.destination}</span>
                    </div>
                )}

                {data.type === 'mediaConvert' && data.targetFormat && (
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-1.5 rounded border border-slate-800 flex justify-between">
                        <span>Output:</span> <span className="text-cyan-400 uppercase">{data.targetFormat}</span>
                    </div>
                )}

                {/* Show short note if added */}
                {data.note && (
                    <div className="text-[10px] text-slate-500 italic mt-1 pb-1 border-b border-white/5 border-dashed">
                        {data.note}
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export default memo(WorkflowNode);
