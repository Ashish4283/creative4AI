import React, { memo } from 'react';
import { HelpCircle } from 'lucide-react';

const HelpTooltip = ({ text }) => (
    <div className="group relative inline-flex items-center ml-1.5 align-middle">
        <HelpCircle className="w-3 h-3 text-slate-600 hover:text-blue-400 cursor-help transition-colors" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-[10px] text-slate-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
    </div>
);

export default memo(HelpTooltip);
