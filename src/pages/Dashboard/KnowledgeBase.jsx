import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Edit2, Zap, Activity, Shield, Link, ChevronRight, Clock,
    Settings, Globe, Database, HelpCircle, Layers, Cpu, Server, Code, FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Core Logic Content
const coreLogicCards = [
    {
        title: 'Start Trigger',
        description: 'The foundation of your workflow.',
        icon: Zap,
        howTo: [
            '1. Open Settings: Double-click the node.',
            '2. Choose Type: Select "Webhook" for instant data, "Manual" for button-starts, or "Schedule" for periodic tasks.',
            '3. Webhook URL: Copy the generated URL to external apps (like Shopify or Stripe) to send data into Creative 4 AI.',
        ],
        proTip: 'Use "{{trigger.id}}" in subsequent nodes to reference the incoming data.',
    },
    {
        title: 'If / Else',
        description: 'Intelligent decision making.',
        icon: Activity,
        howTo: [
            '1. Value 1: Use the variable picker or type "{{data.field_name}}".',
            '2. Operator: Choose "Equals", "Contains", "Greater Than", etc.',
            '3. Value 2: The static value or variable to compare against.',
        ],
        action: 'Connect nodes to the Green handle (True) and Red handle (False).',
    },
    {
        title: 'Context Memory',
        description: 'The short-term memory of your agent.',
        icon: Shield,
        howTo: [
            '1. Operation: Set to "Store" to save data, or "Read" to fetch it.',
            '2. Key Name: A unique name (e.g., "customer_history").',
            '3. Value: The information you want to save.',
        ],
        useCase: 'Saving a user\'s name in a multi-step conversation so the AI can use it later.',
    },
    {
        title: 'Recruit Workflow',
        description: 'Call a sub-process inside your main flow.',
        icon: Link,
        howTo: [
            '1. Select Workflow: Choose from your list of created flows.',
            '2. Input Mapping: Pass specific data from your current flow into the sub-flow.',
        ],
        proTip: 'Use this to create reusable modules like "Global Error Handler" or "Data Logger".',
    }
];

// Content for other tabs
const flowControlCards = [
    {
        title: 'Wait / Delay',
        description: 'Pauses the cognitive execution thread.',
        icon: () => <Clock className="w-5 h-5 text-rose-400" />,
        howTo: [
            '1. Set Duration: Input the number of seconds, minutes, or hours.',
            '2. Connect: Place this between two nodes where a delay is required (e.g., waiting for an external API state update).'
        ],
        useCase: 'Rate limiting outgoing requests to an external service.'
    },
    {
        title: 'Merge Paths',
        description: 'Re-converges multiple branch paths into a single pipeline.',
        icon: () => <Layers className="w-5 h-5 text-cyan-400" />,
        howTo: [
            '1. Connect all divergent paths into the left-side of this node.',
            '2. Extract the unified output from the right.'
        ]
    },
    {
        title: 'Split In Batches',
        description: 'Throttles high-volume data arrays into smaller chunks.',
        icon: () => <Database className="w-5 h-5 text-emerald-400" />,
        howTo: [
            '1. Batch Size: Input the maximum number of items (e.g., 20).',
            '2. Processing: The node will iteratively trigger the downstream path until the array is exhausted.'
        ]
    }
];

const systemPluginsCards = [
    {
        title: 'AI Model',
        description: 'Primary generative intelligence block.',
        icon: () => <Cpu className="w-5 h-5 text-purple-500" />,
        howTo: [
            '1. Select Task: Choose "Custom", "Summarize", or "Classify".',
            '2. Prompt: Write clear instructions using double-brackets {{data}} to inject variables.'
        ]
    },
    {
        title: 'API Request (Webhooks)',
        description: 'Interface with any cloud software.',
        icon: () => <Globe className="w-5 h-5 text-blue-500" />,
        howTo: [
            '1. Method: Select GET, POST, PUT, DELETE.',
            '2. URL: Enter the endpoint.',
            '3. Auth: Add Bearer Tokens in the Headers section.'
        ]
    },
    {
        title: 'User App UI',
        description: 'Render interactive forms for humans.',
        icon: () => <FileCode className="w-5 h-5 text-pink-500" />,
        howTo: [
            '1. Add Fields: Define Label, Type (Text, Dropdown, File), and Validation.',
            '2. Flow Execution: Execution pauses until the human submits the generated form.'
        ]
    }
];


export default function KnowledgeBase() {
    const [selectedCategory, setSelectedCategory] = useState("Process Builder Nodes Details");
    const [selectedTab, setSelectedTab] = useState("Core Logic");

    const renderCards = () => {
        let cardsToRender = [];
        if (selectedTab === 'Core Logic') cardsToRender = coreLogicCards;
        else if (selectedTab === 'Flow Control') cardsToRender = flowControlCards;
        else if (selectedTab === 'System Plugins') cardsToRender = systemPluginsCards;
        else cardsToRender = []; // Placeholder for others

        if (cardsToRender.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <HelpCircle className="w-12 h-12 mb-4 opacity-50" />
                    <p>Documentation for {selectedTab} is being updated.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cardsToRender.map((card, i) => (
                    <div key={i} className="glass-effect bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl hover:border-primary/30 transition-all hover:bg-slate-900/60 relative overflow-hidden group">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                {typeof card.icon === 'function' ? <card.icon /> : <card.icon className="w-5 h-5 text-amber-500" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">{card.title}</h3>
                                <p className="text-sm text-slate-400 mt-1">{card.description}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HOW TO CONFIGURE:</h4>
                            <div className="space-y-1">
                                {card.howTo.map((step, idx) => (
                                    <p key={idx} className="text-xs text-slate-300 leading-relaxed">{step}</p>
                                ))}
                            </div>

                            {card.proTip && (
                                <p className="text-xs text-slate-300 leading-relaxed mt-4">
                                    <span className="font-bold text-slate-400 uppercase">PRO TIP: </span>
                                    {card.proTip}
                                </p>
                            )}

                            {card.action && (
                                <p className="text-xs text-slate-300 leading-relaxed mt-4">
                                    <span className="font-bold text-slate-400 uppercase">ACTION: </span>
                                    {card.action}
                                </p>
                            )}

                            {card.useCase && (
                                <p className="text-xs text-slate-300 leading-relaxed mt-4">
                                    <span className="font-bold text-slate-400 uppercase">USE CASE: </span>
                                    {card.useCase}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="h-full overflow-y-auto p-6 lg:p-10 pb-20 custom-scrollbar bg-slate-950 font-sans relative">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -mt-40 -mr-40" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <Layers className="w-6 h-6 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Enterprise Knowledge Base</h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search knowledge articles..."
                            className="w-full bg-slate-900 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-slate-500 shadow-inner"
                        />
                    </div>
                    <Button variant="outline" className="rounded-full border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 font-medium h-10 px-6 gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Database
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                {/* Sidebar Categories */}
                <div className="w-full lg:w-64 shrink-0 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">Knowledge Categories</h4>
                    <div className="space-y-2">
                        {["Process Builder Nodes Details", "Getting Started Guide", "Integrations & APIs"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                                    selectedCategory === cat
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {cat === "Process Builder Nodes Details" && <Zap className={cn("w-4 h-4", selectedCategory === cat ? "text-white" : "text-slate-500")} />}
                                {cat === "Getting Started Guide" && <HelpCircle className={cn("w-4 h-4", selectedCategory === cat ? "text-white" : "text-slate-500")} />}
                                {cat === "Integrations & APIs" && <Server className={cn("w-4 h-4", selectedCategory === cat ? "text-white" : "text-slate-500")} />}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-8">
                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1.5 rounded-full border border-white/5 w-fit">
                        {["Core Logic", "Flow Control", "System Plugins", "Builder Features", "Detailed Directory"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                                    selectedTab === tab
                                        ? "bg-slate-800 text-white shadow-sm"
                                        : "text-slate-400 hover:text-slate-200"
                                )}
                            >
                                {tab === 'Core Logic' && <Settings className="w-3.5 h-3.5" />}
                                {tab === 'Flow Control' && <Activity className="w-3.5 h-3.5" />}
                                {tab === 'System Plugins' && <Globe className="w-3.5 h-3.5" />}
                                {tab === 'Builder Features' && <Edit2 className="w-3.5 h-3.5" />}
                                {tab === 'Detailed Directory' && <ChevronRight className="w-3.5 h-3.5" />}
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="min-h-[400px]">
                        {renderCards()}
                    </div>
                </div>
            </div>
        </div>
    );
}
