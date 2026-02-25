import React from 'react';

export default function Inspector({ selectedNode, setNodes }) {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 text-slate-500 text-sm text-center">
        Select a node to configure
      </div>
    );
  }

  const handleChange = (key, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: { ...node.data, [key]: value },
          };
        }
        return node;
      })
    );
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="font-bold text-slate-200 border-b border-slate-800 pb-2">
        {selectedNode.data.label} Settings
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Label</label>
        <input
          type="text"
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          value={selectedNode.data.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Configuration / Prompt</label>
        <textarea
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          placeholder="Enter prompt, SQL, or JSON..."
          value={selectedNode.data.config || ''}
          onChange={(e) => handleChange('config', e.target.value)}
        />
      </div>
      
      <div className="text-xs text-slate-500 mt-4">
        ID: {selectedNode.id}<br/>
        Type: {selectedNode.type}
      </div>
    </div>
  );
}