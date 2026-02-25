import { storageAdapter } from './workflow-storage';

class WorkflowEngine {
    constructor() {
        console.log("Workflow Engine Loaded: v2.1 (N8N Adaptors + Auto-Backend)");
        this.handlers = {
            'default': async (node, inputs) => inputs,
            
            'appNode': async (node, inputs) => {
                // Pass through inputs (which contain the form data from the start payload)
                return inputs;
            },

            // --- N8N-STYLE ADAPTORS & UTILS ---

            'webhookNode': async (node, inputs) => {
                return { ...inputs, _trigger: 'webhook', timestamp: new Date().toISOString() };
            },

            'httpRequestNode': async (node, inputs) => {
                const { url, method = 'GET', headers = {}, body } = node.data;
                try {
                    const options = {
                        method,
                        headers: { 'Content-Type': 'application/json', ...headers }
                    };
                    if (method !== 'GET' && method !== 'HEAD' && body) {
                        options.body = typeof body === 'string' ? body : JSON.stringify(body);
                    }
                    
                    const response = await fetch(url, options);
                    const data = await response.json();
                    return { ...inputs, data, status: response.status };
                } catch (error) {
                    return { ...inputs, error: error.message, status: 'error' };
                }
            },

            'setNode': async (node, inputs) => {
                // Merges defined values into the workflow data
                const { values } = node.data; // Expected format: { key: value }
                return { ...inputs, ...values };
            },

            'ifNode': async (node, inputs) => {
                const { value1, operator, value2 } = node.data;
                // Simple comparison logic
                // In a real app, value1/value2 would be resolved from inputs using {{variable}} syntax
                const v1 = inputs[value1] !== undefined ? inputs[value1] : value1;
                const v2 = inputs[value2] !== undefined ? inputs[value2] : value2;
                
                const isTrue = v1 == v2; // Simplified loose equality for demo
                return { ...inputs, _route: isTrue ? ['true'] : ['false'] };
            },

            'aiNode': async (node, inputs) => {
                // Mock AI response for preview
                await new Promise(resolve => setTimeout(resolve, 1000));
                const task = node.data.taskType || 'custom';
                return {
                    ...inputs,
                    ai_result: `[Mock AI Output for ${task}]: Processed ${JSON.stringify(inputs)}`
                };
            },

            'pythonNode': async (node, inputs, options = {}) => {
                const code = node.data.code || '';
                let env = options.environment || 'draft';
                
                // AUTO-DETECT: If code is custom (not the tutorial mock), force 'test' mode to use backend
                const isMockCode = code.includes('moviepy') || code.includes('ffmpeg');
                if (env === 'draft' && !isMockCode) {
                    console.log("Auto-switching to 'test' environment to execute custom Python code on backend.");
                    env = 'test';
                }
                
                // 1. REMOTE EXECUTION (Test & Production)
                // If environment is test or production, we send the code to the server for real execution.
                if (env === 'production' || env === 'test') {
                    const apiUrl = node.data.backendUrl || 'https://workflow-backend-8uwh.onrender.com/execute';
                
                    if (apiUrl) {
                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'X-Workflow-Env': env 
                            },
                            body: JSON.stringify({
                                code: code,
                                inputs: inputs,
                                requirements: node.data.requirements,
                                environment: env
                            })
                        });

                        if (!response.ok) throw new Error(`Backend Error (${env}): ${response.statusText}`);
                        return await response.json();
                    } catch (error) {
                        console.error(`Remote Execution Failed (${env}):`, error);
                        throw error;
                    }
                    }
                }

                // 2. DRAFT / MOCK MODE
                // Detects specific tutorial code to simulate execution in the browser.
                if (code.includes('moviepy') || code.includes('ffmpeg')) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
                    
                    const targetFormat = inputs.target_format || 'mp4';
                    const sourceFile = inputs.source_file?.[0]?.name || 'video.mp4';
                    const baseName = sourceFile.split('.')[0];
                    
                    // Return a sample video/audio for preview purposes
                    // Using a public domain sample video (Big Buck Bunny)
                    const sampleUrl = targetFormat === 'mp3' 
                        ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                        : 'https://www.w3schools.com/html/mov_bbb.mp4';

                    return {
                        ...inputs,
                        ui: {
                            type: 'media',
                            files: [
                                { 
                                    url: sampleUrl, 
                                    mime: targetFormat === 'mp3' ? 'audio/mpeg' : 'video/mp4',
                                    name: `converted_${baseName}.${targetFormat}`
                                }
                            ]
                        },
                        file_path: `/exports/converted_${baseName}.${targetFormat}`
                    };
                }

                // Fallback if no backend configured
                return { ...inputs, status: 'python_script_executed_locally', note: 'No backend URL configured' };
            },

            'exportNode': async (node, inputs) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                // Pass through the UI object so the Inspector can render the preview
                return { 
                    ...inputs, 
                    url: inputs.ui?.files?.[0]?.url || '#',
                    status: 'success' 
                };
            },

            'logicNode': async (node, inputs) => {
                // Simple logic evaluation
                const { conditionVar, conditionOp, conditionVal } = node.data;
                // In a real engine, we'd evaluate this against inputs
                return { ...inputs, logic_result: true };
            }
        };
    }

    async execute(workflowId, payload, options = {}) {
        const { onLog = () => {}, userId } = options;
        const log = (msg) => onLog({ timestamp: new Date(), message: msg });

        log(`Workflow ${workflowId} started.`);

        try {
            const workflow = await storageAdapter.loadWorkflow(workflowId);
            
            // Access Control Check
            if (workflow.ownerId && workflow.ownerId !== 'public' && userId && workflow.ownerId !== userId) {
                throw new Error(`Access Denied: User ${userId} does not have permission to execute this workflow.`);
            }

            const env = options.environment || workflow.environment || 'draft';
            log(`Execution Environment: ${env}`);
            const { nodes, edges } = workflow;

            // Build Graph
            const nodeMap = new Map(nodes.map(n => [n.id, n]));
            const incoming = new Map();
            const outgoing = new Map();

            edges.forEach(e => {
                if (!outgoing.has(e.source)) outgoing.set(e.source, []);
                outgoing.get(e.source).push({ id: e.target, handle: e.sourceHandle });
                
                if (!incoming.has(e.target)) incoming.set(e.target, []);
                incoming.get(e.target).push(e.source);
            });

            // Execution Queue (BFS)
            const queue = nodes.filter(n => !incoming.has(n.id) || n.entry).map(n => n.id);
            const results = {};
            const nodeStatus = {};

            // Initialize start nodes
            queue.forEach(id => results[id] = payload);

            while (queue.length > 0) {
                const nodeId = queue.shift();
                const node = nodeMap.get(nodeId);
                
                // Prepare Inputs
                let nodeInputs = results[nodeId] || {};
                const parents = incoming.get(nodeId) || [];
                if (parents.length > 0) {
                    nodeInputs = parents.reduce((acc, pid) => ({ ...acc, ...results[pid] }), {});
                }

                // Execute Handler
                const handler = this.handlers[node.data.type] || this.handlers['default'];
                if (!this.handlers[node.data.type]) {
                    log(`Warning: No handler for node type '${node.data.type}'. Passing through.`);
                }

                try {
                    const output = await handler(node, nodeInputs, { ...options, environment: env });
                    results[nodeId] = output;
                    nodeStatus[nodeId] = 'completed';

                    // Trigger Children
                    const children = outgoing.get(nodeId) || [];
                    children.forEach(edge => {
                        const childId = edge.id;

                        // Branching Logic: If node returned a specific route (e.g. 'true' or 'false'), filter edges
                        if (results[nodeId]?._route) {
                            const allowedRoutes = results[nodeId]._route;
                            // If the edge is connected to a handle that isn't in the allowed routes, skip it
                            if (edge.handle && !allowedRoutes.includes(edge.handle)) return;
                        }

                        const childParents = incoming.get(childId) || [];
                        if (childParents.every(pid => nodeStatus[pid] === 'completed') && !queue.includes(childId)) {
                            queue.push(childId);
                        }
                    });
                } catch (err) {
                    log(`Error in ${node.data.label}: ${err.message}`);
                    throw err;
                }
            }

            log(`Workflow completed successfully.`);
            return { status: 'completed', results, nodeStatus };
        } catch (error) {
            log(`Execution failed: ${error.message}`);
            return { status: 'failed', results: {}, nodeStatus: {} };
        }
    }
}

export const workflowEngine = new WorkflowEngine();