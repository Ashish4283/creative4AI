import React from 'react';
import { Brain, Database, Webhook, FileJson } from 'lucide-react';

export default function Toolbox() {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-4">
      <div className="font-bold text-slate-400 text-xs uppercase tracking-wider">Toolbox</div>
      <div className="space-y-2">
        <div className="p-3 bg-slate-800 rounded border border-slate-700 cursor-grab hover:border-slate-500 transition-colors flex items-center gap-3" onDragStart={(e) => onDragStart(e, 'aiNode', 'AI Prompt')} draggable>
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-slate-200">AI Prompt</span>
        </div>
        <div className="p-3 bg-slate-800 rounded border border-slate-700 cursor-grab hover:border-slate-500 transition-colors flex items-center gap-3" onDragStart={(e) => onDragStart(e, 'apiNode', 'API Request')} draggable>
          <Webhook className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-200">API Request</span>
        </div>
        <div className="p-3 bg-slate-800 rounded border border-slate-700 cursor-grab hover:border-slate-500 transition-colors flex items-center gap-3" onDragStart={(e) => onDragStart(e, 'dbNode', 'DB Query')} draggable>
          <Database className="w-4 h-4 text-green-400" />
          <span className="text-sm text-slate-200">DB Query</span>
        </div>
         <div className="p-3 bg-slate-800 rounded border border-slate-700 cursor-grab hover:border-slate-500 transition-colors flex items-center gap-3" onDragStart={(e) => onDragStart(e, 'mapperNode', 'MR Mapper')} draggable>
          <FileJson className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-slate-200">MR Mapper</span>
        </div>
      </div>
    </div>
  );
}