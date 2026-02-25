import React, { useState } from 'react';
import { workflowEngine } from './lib/workflow-engine';
import { storageAdapter } from './lib/workflow-storage';

// Default workflow definition to ensure we have something to run
const SAMPLE_WORKFLOW = {
    name: "User Signup Flow",
    version: "1.0",
    nodes: [
        { id: "trigger", type: "start", entry: true, data: { label: "Webhook Trigger" } },
        { id: "log-1", type: "log", data: { message: "Received new user signup request" } },
        { id: "log-2", type: "log", data: { message: "Validating email address..." } },
        { id: "log-3", type: "log", data: { message: "Sending welcome email to user..." } }
    ],
    edges: [
        { source: "trigger", target: "log-1" },
        { source: "log-1", target: "log-2" },
        { source: "log-2", target: "log-3" }
    ]
};

export default function UserApp() {
    const [email, setEmail] = useState("alice@example.com");
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState("idle"); // idle, running, completed, error
    const [result, setResult] = useState(null);

    // Helper to ensure the workflow exists in LocalStorage
    const ensureWorkflowExists = async () => {
        try {
            await storageAdapter.loadWorkflow("signup-process");
        } catch {
            console.log("Seeding default workflow...");
            await storageAdapter.saveWorkflow("signup-process", SAMPLE_WORKFLOW);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset State
        setLogs([]);
        setStatus("running");
        setResult(null);

        // 1. Create Payload
        const payload = {
            userId: `user_${Math.floor(Math.random() * 1000)}`,
            email,
            source: "web_form",
            timestamp: new Date().toISOString()
        };

        try {
            await ensureWorkflowExists();

            // 2. Execute Workflow with Log Streaming
            const resultContext = await workflowEngine.execute("signup-process", payload, {
                onLog: (logEntry) => {
                    setLogs(prev => [...prev, logEntry]);
                }
            });

            // 3. Handle Output
            setResult(resultContext.results);
            setStatus("completed");
        } catch (error) {
            console.error(error);
            setStatus("error");
            setLogs(prev => [...prev, { timestamp: Date.now(), message: `❌ Error: ${error.message}` }]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8 font-sans text-gray-800">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold">User Signup Simulation</h1>
                <p className="text-gray-500">Simulates a frontend triggering a backend workflow.</p>
            </div>

            {/* UI Input Section */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">1. User Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={status === 'running'}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {status === 'running' ? 'Processing...' : 'Submit Signup'}
                    </button>
                </form>
            </div>

            {/* Logs Stream Section */}
            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow font-mono text-sm h-64 overflow-y-auto">
                <h2 className="text-gray-400 font-semibold mb-2 sticky top-0 bg-gray-900 pb-2 border-b border-gray-700 flex justify-between">
                    <span>Server Logs</span>
                    {status === 'running' && <span className="animate-pulse text-green-400">● Live</span>}
                </h2>
                <ul className="space-y-1">
                    {logs.length === 0 && <li className="text-gray-600 italic">Waiting for execution...</li>}
                    {logs.map((log, i) => (
                        <li key={i} className="flex gap-3">
                            <span className="text-gray-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                            <span>{log.message}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Output Section */}
            {status === 'completed' && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h2 className="text-green-800 font-semibold mb-2">✅ Workflow Output</h2>
                    <pre className="text-sm text-green-900 overflow-auto bg-green-100 p-4 rounded">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}