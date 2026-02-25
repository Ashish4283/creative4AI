import React from 'react';
import { Play, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export default function RunBar({ nodes, edges }) {
  const handleSave = () => {
    const workflow = { nodes, edges };
    console.log('Saved Workflow:', workflow);
    toast({ title: 'Workflow Saved', description: 'Check console for JSON output.' });
  };

  const handleRun = () => {
    console.log('Running Workflow...');
    toast({ title: 'Running Workflow', description: 'Execution started...' });
    // Future: Send to backend
  };

  return (
    <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
        </Link>
        <h1 className="font-semibold text-slate-200">Untitled Workflow</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={handleSave} className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
          <Save className="w-4 h-4 mr-2" /> Save
        </Button>
        <Button size="sm" onClick={handleRun} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Play className="w-4 h-4 mr-2" /> Run
        </Button>
      </div>
    </div>
  );
}