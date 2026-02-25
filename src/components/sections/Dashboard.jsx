import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageAdapter } from '../../lib/workflow-storage';

const Dashboard = () => {
    const [workflows, setWorkflows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadWorkflows();
    }, []);

    const loadWorkflows = async () => {
        try {
            const list = await storageAdapter.listWorkflows();
            setWorkflows(list);
        } catch (error) {
            console.error("Failed to load workflows", error);
        }
    };

    const handlePromote = async (id, targetEnv) => {
        try {
            await storageAdapter.promoteWorkflow(id, targetEnv);
            await loadWorkflows();
            alert(`App promoted to ${targetEnv} successfully!`);
        } catch (error) {
            console.error("Promotion failed", error);
            alert("Failed to promote app.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this app?")) {
            await storageAdapter.deleteWorkflow(id);
            await loadWorkflows();
        }
    };

    const getEnvColor = (env) => {
        switch (env) {
            case 'production': return 'bg-green-100 text-green-800 border-green-200';
            case 'test': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">App Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your Drafts, Test (UAT), and Production environments.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/builder')}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        + New App
                    </button>
                </div>

                <div className="grid gap-4">
                    {workflows.map((workflow) => (
                        <div key={workflow.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold text-gray-900">{workflow.name || 'Untitled App'}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getEnvColor(workflow.environment)} uppercase`}>
                                        {workflow.environment || 'draft'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    ID: <span className="font-mono">{workflow.id}</span> • Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate(`/builder?id=${workflow.id}`)}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Open Editor
                                </button>

                                {(!workflow.environment || workflow.environment === 'draft') && (
                                    <button 
                                        onClick={() => handlePromote(workflow.id, 'test')}
                                        className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100"
                                    >
                                        Promote to Test
                                    </button>
                                )}

                                {workflow.environment === 'test' && (
                                    <button 
                                        onClick={() => handlePromote(workflow.id, 'production')}
                                        className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
                                    >
                                        Promote to Prod
                                    </button>
                                )}

                                <button 
                                    onClick={() => handleDelete(workflow.id)}
                                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {workflows.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No apps found. Create your first workflow!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;