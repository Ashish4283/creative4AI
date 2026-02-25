import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Brain, Webhook, FileText, FileJson, GitBranch, Play, Save, Settings, ChevronLeft, ChevronRight, History, Activity, Download, Cloud, AppWindow, Wand2, AlertCircle, FolderOpen, Upload, Copy, Trash2, Check, HardDrive, ExternalLink, Plus, X, Code, FileCode, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Inspector from './Inspector';
import AIWorkflowPlanner from './AIWorkflowPlanner';
import { storageAdapter } from '@/lib/workflow-storage';
import { workflowEngine } from '@/lib/workflow-engine';

const NODE_POLICIES = {
  fileNode: { required: ['fileName'], defaults: { fileName: '', fileSize: '' } },
  driveNode: { required: ['fileId'], defaults: { oauthConnected: false } },
  dataNode: { required: ['operation'], defaults: { operation: 'mapping' } },
  apiNode: { required: ['url'], defaults: { url: 'https://api.example.com', method: 'GET' } },
  aiNode: { required: ['config'], defaults: { taskType: 'custom', config: 'You are a helpful assistant.' } },
  appNode: { required: ['appTitle'], defaults: { appTitle: 'New App', fields: [] } },
  customNode: { required: ['code'], defaults: { code: '// Access previous data via `data` variable\n// Return an object to pass to next node\nreturn { result: true };' } },
  pythonNode: { required: ['code'], defaults: { code: '# Access previous data via `data` variable\n# Return a dictionary to pass to next node\ndef main(data):\n    # Train your model here\n    return { "status": "success" }', requirements: 'pandas\nnumpy', backendUrl: 'https://workflow-backend-8uwh.onrender.com/execute' } },
  logicNode: { required: ['conditionVar', 'conditionOp', 'conditionVal'], defaults: { conditionOp: '==' } },
  exportNode: { required: ['destination'], defaults: { destination: 'drive', format: 'csv' } },
  default: { required: [], defaults: {} }
};

// Custom Node Component for n8n/Figma feel
const WorkflowNode = ({ data, selected }) => {
  const typeConfig = {
    fileNode: { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-200 dark:border-orange-800' },
    driveNode: { icon: Cloud, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200 dark:border-blue-800' },
    dataNode: { icon: FileJson, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-800' },
    apiNode: { icon: Webhook, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200 dark:border-blue-800' },
    aiNode: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-200 dark:border-purple-800' },
    appNode: { icon: AppWindow, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-200 dark:border-pink-800' },
    customNode: { icon: Code, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-800' },
    pythonNode: { icon: FileCode, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-800' },
    logicNode: { icon: GitBranch, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-800' },
    exportNode: { icon: Download, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-800' },
    default: { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-200 dark:border-slate-800' }
  };

  const config = typeConfig[data.type] || typeConfig.default;
  const IconComponent = config.icon;
  
  const statusStyles = {
    idle: 'border-border hover:border-primary/50',
    running: 'border-blue-500 ring-1 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    success: 'border-green-500 ring-1 ring-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    error: 'border-red-500 ring-1 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  };

  const currentStatus = data.status || 'idle';

  return (
    <div className={`relative group transition-all duration-200 ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg' : ''} ${statusStyles[currentStatus]} rounded-xl bg-card border min-w-[280px]`}>
      <div className={`rounded-xl overflow-hidden`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center gap-3 ${config.bg} ${config.border} bg-opacity-50`}>
          <div className={`p-2 rounded-lg bg-background shadow-sm ${config.color} ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex-grow min-w-0 flex flex-col">
            <span className="text-xs font-bold text-foreground truncate leading-tight">{data.label}</span>
            <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider opacity-80">
              {data.type?.replace('Node', '') || 'WORKFLOW'}
            </span>
          </div>
          {currentStatus === 'running' && (
            <div className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce"></span>
            </div>
          )}
          {currentStatus === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {currentStatus === 'success' && (
            <Check className="w-4 h-4 text-green-500" />
          )}
        </div>
        
        {/* Body */}
        <div className="p-3 space-y-2 bg-card/50">
             <div className="text-xs text-muted-foreground font-medium">
                {data.fileId ? (
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded border border-border/50">
                        <FileText className="w-3 h-3 opacity-70" />
                        <span className="truncate">{data.fileName || data.fileId}</span>
                    </div>
                ) : data.url ? (
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded border border-border/50">
                        <span className="font-mono text-[10px] bg-primary/10 text-primary px-1 rounded">{data.method || 'GET'}</span>
                        <span className="truncate">{data.url}</span>
                    </div>
                ) : data.config ? (
                    <div className="bg-muted/50 p-2 rounded border border-border/50 italic">
                        "{data.config.substring(0, 40)}{data.config.length > 40 ? '...' : ''}"
                    </div>
                ) : (
                    <div className="text-slate-400 italic">Not configured</div>
                )}
             </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-muted-foreground/30 !border-2 !border-background transition-all hover:!bg-primary hover:!w-4 hover:!h-4 -ml-1.5" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-muted-foreground/30 !border-2 !border-background transition-all hover:!bg-primary hover:!w-4 hover:!h-4 -mr-1.5" />
    </div>
  );
};

const initialNodes = [
  {
    id: '1',
    type: 'workflowNode',
    data: { label: 'Start Trigger', type: 'default' },
    position: { x: 250, y: 5 },
    entry: true,
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const WorkflowBuilder = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isToolboxCollapsed, setIsToolboxCollapsed] = useState(false);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState(() => 'wf_' + Math.random().toString(36).substr(2, 9));
  const [workflowMeta, setWorkflowMeta] = useState({ name: 'Untitled Workflow', version: 0, environment: 'draft' });
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [storageMode, setStorageMode] = useState('browser');
  const [contextMenu, setContextMenu] = useState(null);
  const [clipBoard, setClipBoard] = useState([]);
  const [executionResults, setExecutionResults] = useState({});
  const [runHistory, setRunHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCodeViewOpen, setIsCodeViewOpen] = useState(false);
  const [codeViewContent, setCodeViewContent] = useState('');
  const isJustLoaded = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const nodeTypes = useMemo(() => ({
    workflowNode: WorkflowNode,
  }), []);

  const recordHistory = useCallback(() => {
    setPast((prev) => [...prev, { nodes, edges }]);
    setFuture([]);
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    setFuture((prev) => [{ nodes, edges }, ...prev]);
    setPast(newPast);
    setNodes(previous.nodes);
    setEdges(previous.edges);
  }, [past, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast((prev) => [...prev, { nodes, edges }]);
    setFuture(newFuture);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [future, nodes, edges, setNodes, setEdges]);

  // --- Keyboard Shortcuts (Undo/Redo/Copy/Paste/Duplicate) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if user is typing in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      // Undo / Redo
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key === 'y' || e.key === 'Y') {
          // Windows Redo often uses Ctrl+Y
          e.preventDefault();
          redo();
        }
      }

      // Copy (Ctrl+C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selected = nodes.filter(n => n.selected);
        if (selected.length > 0) {
          setClipBoard(selected);
          toast({ description: `Copied ${selected.length} nodes to clipboard` });
        }
      }

      // Paste (Ctrl+V)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipBoard.length > 0) {
          recordHistory();
          const newNodes = clipBoard.map(n => ({
            ...n,
            id: getId(),
            position: { x: n.position.x + 50, y: n.position.y + 50 },
            selected: true,
            data: { ...n.data } // Deep copy data to avoid reference issues
          }));
          setNodes(nds => nds.map(node => ({...node, selected: false})).concat(newNodes));
        }
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const selected = nodes.filter(n => n.selected);
        if (selected.length > 0) {
          recordHistory();
          const newNodes = selected.map(n => ({
            ...n,
            id: getId(),
            position: { x: n.position.x + 20, y: n.position.y + 20 },
            selected: true,
            data: { ...n.data }
          }));
          setNodes(nds => nds.map(node => ({...node, selected: false})).concat(newNodes));
        }
      }

      // Delete (Backspace/Delete)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodes = nodes.filter(n => n.selected);
        const selectedEdges = edges.filter(e => e.selected);

        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          e.preventDefault();
          recordHistory();

          if (selectedNodes.length > 0) {
            const selectedIds = new Set(selectedNodes.map(n => n.id));
            setNodes((nds) => nds.filter((n) => !selectedIds.has(n.id)));
            setEdges((eds) => eds.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)));
            
            if (selectedNode && selectedIds.has(selectedNode.id)) {
              setSelectedNode(null);
            }
          }

          if (selectedEdges.length > 0) {
            setEdges((eds) => eds.filter((e) => !e.selected));
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, nodes, edges, clipBoard, recordHistory, setNodes, setEdges, selectedNode, setSelectedNode]);

  const onConnect = useCallback((params) => {
    recordHistory();
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges, recordHistory]);

  const onNodesChangeWithHistory = useCallback((changes) => {
    if (changes.some(c => c.type === 'remove')) {
      recordHistory();
    }
    onNodesChange(changes);
  }, [onNodesChange, recordHistory]);

  const onEdgesChangeWithHistory = useCallback((changes) => {
    if (changes.some(c => c.type === 'remove')) {
      recordHistory();
    }
    onEdgesChange(changes);
  }, [onEdgesChange, recordHistory]);

  const setNodesWithHistory = useCallback((update) => {
    recordHistory();
    setNodes(update);
  }, [recordHistory, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');
      const customType = event.dataTransfer.getData('application/customType');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const policy = NODE_POLICIES[customType] || { defaults: {} };
      recordHistory();
      const newNode = {
        id: getId(),
        type: 'workflowNode', // Force custom node type
        position,
        data: { label: `${label}`, type: customType, ...policy.defaults },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, recordHistory]
  );

  const onDragStart = (event, nodeType, label, customType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    if (customType) {
      event.dataTransfer.setData('application/customType', customType);
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  // --- Context Menu Handlers ---
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      type: 'node',
      nodeId: node.id
    });
  }, []);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      type: 'pane'
    });
  }, []);

  const handleCloseContextMenu = () => setContextMenu(null);

  const handleDuplicateNode = (id) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      recordHistory();
      const newNode = {
        ...node,
        id: getId(),
        position: { x: node.position.x + 20, y: node.position.y + 20 },
        selected: true,
        data: { ...node.data }
      };
      setNodes(nds => nds.map(n => ({...n, selected: false})).concat(newNode));
    }
    handleCloseContextMenu();
  };

  const handleDeleteNode = (id) => {
    recordHistory();
    setNodes(nds => nds.filter(n => n.id !== id));
    handleCloseContextMenu();
  };

  const addNodeAtLocation = (type, label, contextMenuEvent) => {
    const position = reactFlowInstance.screenToFlowPosition({
      x: contextMenuEvent.mouseX,
      y: contextMenuEvent.mouseY,
    });
    const policy = NODE_POLICIES[type] || { defaults: {} };
    recordHistory();
    const newNode = {
      id: getId(),
      type: 'workflowNode',
      position,
      data: { label, type, ...policy.defaults },
    };
    setNodes((nds) => nds.concat(newNode));
    handleCloseContextMenu();
  };

  const validateWorkflow = useCallback(() => {
    const errors = [];
    const invalidNodeIds = new Set();

    nodes.forEach((node) => {
      const { type } = node.data;
      if (!type || type === 'default') return;
      
      const policy = NODE_POLICIES[type];
      if (policy) {
        const missing = policy.required.filter(field => {
            const val = node.data[field];
            return val === undefined || val === null || val === '';
        });
        if (missing.length > 0) {
          invalidNodeIds.add(node.id);
          errors.push(`${node.data.label} (Missing: ${missing.join(', ')})`);
        }
      }
    });

    return { isValid: errors.length === 0, errors, invalidNodeIds };
  }, [nodes]);

  const runWorkflow = async () => {
    // 1. Validation Layer
    const { isValid, errors, invalidNodeIds } = validateWorkflow();

    if (!isValid) {
      toast({
        title: "Workflow Validation Failed",
        description: `Missing configuration in: ${errors.join(', ')}`,
        variant: "destructive",
      });

      setNodes((nds) => 
        nds.map((n) => ({
          ...n,
          data: { ...n.data, status: invalidNodeIds.has(n.id) ? 'error' : 'idle' }
        }))
      );
      return;
    }

    // Execution Layer: Real Engine
    try {
        // 1. Save current state so engine can load it
        await handleSave(true);

        // 2. Reset UI
        setNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, status: 'running' } })));
        setExecutionResults({});

        toast({ title: "Workflow Execution Started", description: "Running on local engine..." });

        // 3. Construct Payload
        const payload = {
            _meta: { timestamp: new Date().toISOString(), source: 'builder_run' }
        };

        // 4. Execute
        const resultContext = await workflowEngine.execute(workflowId, payload, {
            onLog: (entry) => {
                console.log(`[Engine] ${entry.message}`);
            }
        });

        // 5. Update UI with Results
        setExecutionResults(resultContext.results);
        setRunHistory(prev => [{
            id: Date.now(),
            timestamp: new Date(),
            status: resultContext.status,
            results: resultContext.results,
            nodeStatus: resultContext.nodeStatus
        }, ...prev]);

        setNodes(nds => nds.map(n => {
            const status = resultContext.nodeStatus[n.id];
            let uiStatus = 'idle';
            if (status === 'completed') uiStatus = 'success';
            if (status === 'failed') uiStatus = 'error';
            if (status === 'running') uiStatus = 'running';
            return {
                ...n,
                data: { ...n.data, status: uiStatus }
            };
        }));

        // Check for export outputs
        const exportNodes = nodes.filter(n => n.data.type === 'exportNode');
        let hasExport = false;
        exportNodes.forEach(node => {
            const result = resultContext.results[node.id];
            if (result && result.url) {
                hasExport = true;
                toast({
                    title: "File Ready",
                    description: `Output generated from ${node.data.label}`,
                    action: <Button size="sm" variant="outline" onClick={() => window.open(result.url, '_blank')} className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"><Download className="w-3 h-3 mr-1"/> Download</Button>,
                    duration: 8000,
                });
            }
        });

        if (!hasExport) {
            toast({ title: "Execution Complete", description: "Check Node Inspector for outputs." });
        }

    } catch (error) {
        console.error(error);
        toast({ title: "Execution Failed", description: error.message, variant: "destructive" });
        
        // Mark failed nodes
        setNodes(nds => nds.map(n => ({
            ...n,
            data: { ...n.data, status: n.data.status === 'running' ? 'error' : n.data.status }
        })));
    }
  };

  // --- Storage & Persistence Logic ---

  const loadWorkflowList = async () => {
    const list = await storageAdapter.listWorkflows();
    setSavedWorkflows(list);
  };

  const handleSave = async (isAutosave = false) => {
    // Determine new version: Increment on manual save, keep current on autosave
    const currentVersion = Number(workflowMeta.version) || 0;
    const newVersion = isAutosave ? currentVersion : currentVersion + 1;

    const workflowData = {
      id: workflowId,
      ...workflowMeta,
      version: newVersion,
      nodes,
      edges,
      viewport: reactFlowInstance?.getViewport()
    };

    try {
      const savedData = await storageAdapter.saveWorkflow(workflowId, workflowData);
      
      setWorkflowMeta(prev => ({ ...prev, version: newVersion }));
      setLastSaved(new Date());
      
      if (!isAutosave) {
        toast({ title: "Workflow Saved", description: `Version ${newVersion} stored locally.` });
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast({ title: "Save Failed", description: error.message, variant: "destructive" });
    }
  };

  // Autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isJustLoaded.current) {
        isJustLoaded.current = false;
        return;
      }
      if (nodes.length > 0) {
        handleSave(true);
      }
    }, 2000); // 2s debounce

    return () => clearTimeout(timer);
  }, [nodes, edges, workflowMeta.name]);

  const handleLoad = async (id) => {
    try {
      const data = await storageAdapter.loadWorkflow(id);
      setWorkflowId(data.id);
      setWorkflowMeta({ name: data.name, version: data.version, environment: data.environment || 'draft' });
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      if (data.viewport && reactFlowInstance) {
        reactFlowInstance.setViewport(data.viewport);
      }
      isJustLoaded.current = true;
      setIsLoadModalOpen(false);
      toast({ title: "Workflow Loaded", description: `Loaded "${data.name}" (v${data.version})` });
    } catch (error) {
      toast({ title: "Load Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await storageAdapter.deleteWorkflow(id);
    loadWorkflowList();
  };

  const handleClone = () => {
    const newId = 'wf_' + Math.random().toString(36).substr(2, 9);
    setWorkflowId(newId);
    setWorkflowMeta(prev => ({ ...prev, name: `${prev.name} (Copy)`, version: 0 }));
    toast({ title: "Workflow Cloned", description: "Created a new copy. Saving will create a new file." });
  };

  const handlePromote = async (targetEnv) => {
    await handleSave(true);
    try {
        const newWorkflow = await storageAdapter.promoteWorkflow(workflowId, targetEnv);
        setWorkflowId(newWorkflow.id);
        setWorkflowMeta({ 
            name: newWorkflow.name, 
            version: newWorkflow.version, 
            environment: newWorkflow.environment 
        });
        setNodes(newWorkflow.nodes || []);
        setEdges(newWorkflow.edges || []);
        toast({ title: "Environment Changed", description: `Moved to ${targetEnv}.` });
    } catch (error) {
        toast({ title: "Error", description: "Failed to change environment.", variant: "destructive" });
    }
  };

  const handleAIPlan = useCallback((newNodes, newEdges) => {
    recordHistory();
    setNodes(newNodes);
    setEdges(newEdges);
    setIsAIPlannerOpen(false);
    toast({ title: "AI Plan Applied", description: "Workflow generated successfully." });
  }, [recordHistory, setNodes, setEdges]);

  const handleExport = () => {
    const data = {
      id: workflowId,
      ...workflowMeta,
      nodes,
      edges
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowMeta.name.replace(/\s+/g, '_')}_v${workflowMeta.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Always generate new ID for imports to avoid overwriting existing files
        setWorkflowId('wf_' + Math.random().toString(36).substr(2, 9));
        setWorkflowMeta({ name: (data.name || 'Imported Workflow') + ' (Imported)', version: 1 });
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        if (data.viewport && reactFlowInstance) {
          reactFlowInstance.setViewport(data.viewport);
        }
        isJustLoaded.current = true;
        toast({ title: "Workflow Imported", description: "Workflow loaded from file." });
      } catch (error) {
        console.error("Import failed:", error);
        toast({ title: "Import Failed", description: "Invalid workflow file.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input to allow re-importing same file
  };

  const connectLocalFolder = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      storageAdapter.setFileSystem(handle);
      setStorageMode('filesystem');
      toast({ title: "Local Storage Connected", description: `Saving to: ${handle.name}` });
    } catch (err) {
      // User cancelled
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-white dark:bg-slate-900 z-10">
        <div className="flex items-center gap-4">
            <div className="font-semibold text-lg flex items-center gap-2">
                <span className="text-primary">Reasoning Engine</span> / 
                <input 
                  className="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 text-foreground"
                  value={workflowMeta.name}
                  onChange={(e) => setWorkflowMeta(prev => ({ ...prev, name: e.target.value }))}
                />
                <span className="text-xs text-muted-foreground font-normal">v{workflowMeta.version}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${
                    workflowMeta.environment === 'production' ? 'bg-green-100 text-green-700 border-green-200' :
                    workflowMeta.environment === 'test' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                    {workflowMeta.environment || 'DRAFT'}
                </span>
            </div>
            {lastSaved && <span className="text-xs text-muted-foreground">Saved {lastSaved.toLocaleTimeString()} ({storageMode})</span>}
        </div>
        <div className="flex items-center gap-2">
            {workflowMeta.environment === 'test' && (
                <Button size="sm" variant="outline" onClick={() => handlePromote('draft')} className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50">
                    <ArrowLeft className="w-4 h-4" /> Revert to Draft
                </Button>
            )}
            {workflowMeta.environment === 'production' && (
                <Button size="sm" variant="outline" onClick={() => handlePromote('test')} className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                    <ArrowLeft className="w-4 h-4" /> Revert to Test
                </Button>
            )}
            {(workflowMeta.environment === 'draft' || !workflowMeta.environment) && (
                <Button size="sm" variant="outline" onClick={() => handlePromote('test')} className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                    Promote to Test <ArrowRight className="w-4 h-4" />
                </Button>
            )}
            {workflowMeta.environment === 'test' && (
                <Button size="sm" variant="outline" onClick={() => handlePromote('production')} className="gap-2 text-green-600 border-green-200 hover:bg-green-50">
                    Promote to Prod <ArrowRight className="w-4 h-4" />
                </Button>
            )}
            <Button size="sm" variant="secondary" onClick={() => setIsAIPlannerOpen(true)} className="gap-2 text-purple-500 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20">
                <Wand2 className="w-4 h-4" /> AI Plan
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open(`/app?id=${workflowId}`, '_blank')} className="gap-2" title="Open User App">
                <ExternalLink className="w-4 h-4" /> Preview App
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setIsLoadModalOpen(true); loadWorkflowList(); }} className="gap-2">
                <FolderOpen className="w-4 h-4" /> Load
            </Button>
            <Button size="sm" variant={storageMode === 'filesystem' ? "secondary" : "outline"} onClick={connectLocalFolder} title="Connect Local Storage Folder" className={storageMode === 'filesystem' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}>
                <HardDrive className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={runWorkflow} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Play className="w-4 h-4" /> Run
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleSave(false)} className="gap-2">
                <Save className="w-4 h-4" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleExport} title="Export JSON">
                <Download className="w-4 h-4" />
            </Button>
            <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                <Upload className="w-4 h-4" />
                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
            <Button size="sm" variant="ghost" onClick={handleClone} title="Clone Workflow">
                <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => {
                setCodeViewContent(JSON.stringify({ id: workflowId, ...workflowMeta, nodes, edges }, null, 2));
                setIsCodeViewOpen(true);
            }} className="gap-2 text-muted-foreground hover:text-foreground">
                <FileCode className="w-4 h-4" /> Code
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsHistoryOpen(true)} className="gap-2 text-muted-foreground hover:text-foreground">
                <History className="w-4 h-4" /> History
            </Button>
            <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {/* Toolbox */}
        <div className={`border-r border-border bg-muted/30 flex flex-col transition-all duration-300 ${isToolboxCollapsed ? 'w-16' : 'w-64'}`}>
            <div className="p-2 flex justify-end border-b border-border/50">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsToolboxCollapsed(!isToolboxCollapsed)}>
                    {isToolboxCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>
            
            <div className="p-3 space-y-6 overflow-y-auto flex-grow">
                {/* Core Logic Group */}
                <div>
                    {!isToolboxCollapsed && <h3 className="font-semibold text-xs uppercase text-muted-foreground mb-3 px-1 tracking-wider">Core Logic</h3>}
                    <div className="space-y-2">
                        {[
                            { icon: Activity, label: 'Start Trigger', type: 'default', color: 'text-slate-500' },
                            { icon: GitBranch, label: 'Logic Gate', type: 'logicNode', color: 'text-cyan-500' },
                        ].map((item, i) => (
                            <div 
                                key={item.type}
                                className={`p-3 bg-white dark:bg-slate-800 rounded-lg border border-border cursor-grab shadow-sm hover:shadow-md transition-all flex items-center gap-3 ${isToolboxCollapsed ? 'justify-center px-0' : ''}`}
                                onDragStart={(event) => onDragStart(event, 'workflowNode', item.label, item.type)} 
                                draggable
                                title={isToolboxCollapsed ? item.label : ''}
                            >
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                {!isToolboxCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plugins Group */}
                <div>
                    {!isToolboxCollapsed && <h3 className="font-semibold text-xs uppercase text-muted-foreground mb-3 px-1 tracking-wider">System Plugins</h3>}
                    <div className="space-y-2">
                        {[
                            { icon: Brain, label: 'AI Model', type: 'aiNode', color: 'text-purple-500' },
                            { icon: AppWindow, label: 'User App', type: 'appNode', color: 'text-pink-500' },
                            { icon: Cloud, label: 'Google Drive', type: 'driveNode', color: 'text-blue-500' },
                            { icon: FileText, label: 'File System', type: 'fileNode', color: 'text-orange-500' },
                            { icon: FileJson, label: 'Data Store', type: 'dataNode', color: 'text-yellow-500' },
                            { icon: Webhook, label: 'External API', type: 'apiNode', color: 'text-blue-500' },
                            { icon: Code, label: 'Custom Function', type: 'customNode', color: 'text-indigo-500' },
                            { icon: FileCode, label: 'Python Script', type: 'pythonNode', color: 'text-yellow-500' },
                            { icon: Download, label: 'Save / Export', type: 'exportNode', color: 'text-emerald-500' },
                        ].map((item, i) => (
                            <div 
                                key={item.type}
                                className={`p-3 bg-white dark:bg-slate-800 rounded-lg border border-border cursor-grab shadow-sm hover:shadow-md transition-all flex items-center gap-3 ${isToolboxCollapsed ? 'justify-center px-0' : ''}`}
                                onDragStart={(event) => onDragStart(event, 'workflowNode', item.label, item.type)}
                                draggable
                                title={isToolboxCollapsed ? item.label : ''}
                            >
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                {!isToolboxCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Canvas */}
        <div className="flex-grow relative bg-slate-50 dark:bg-slate-900/50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChangeWithHistory}
              onEdgesChange={onEdgesChangeWithHistory}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={setReactFlowInstance}
              onNodeDragStart={recordHistory}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeContextMenu={onNodeContextMenu}
              onPaneContextMenu={onPaneContextMenu}
              minZoom={0.1}
              maxZoom={2}
              snapToGrid={true}
              snapGrid={[20, 20]}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={24} size={1.5} color="currentColor" className="text-muted-foreground/20" />
            </ReactFlow>

            {/* Inspector */}
            <div className={`absolute top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-20 transition-transform duration-300 ease-in-out transform ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
              {selectedNode && (
                <Inspector 
                  selectedNode={nodes.find(n => n.id === selectedNode.id) || selectedNode} 
                  setNodes={setNodesWithHistory} 
                  setSelectedNode={setSelectedNode} 
                    nodeResults={executionResults[selectedNode.id]}
                />
              )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
              <div 
                style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                className="fixed z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                {contextMenu.type === 'node' ? (
                  <>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2" onClick={() => handleDuplicateNode(contextMenu.nodeId)}>
                      <Copy className="w-4 h-4" /> Duplicate
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-2" onClick={() => handleDeleteNode(contextMenu.nodeId)}>
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">Add Node</div>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2" onClick={() => addNodeAtLocation('aiNode', 'AI Model', contextMenu)}>
                      <Brain className="w-4 h-4 text-purple-500" /> AI Model
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2" onClick={() => addNodeAtLocation('apiNode', 'External API', contextMenu)}>
                      <Webhook className="w-4 h-4 text-blue-500" /> External API
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2" onClick={() => addNodeAtLocation('logicNode', 'Logic Gate', contextMenu)}>
                      <GitBranch className="w-4 h-4 text-cyan-500" /> Logic Gate
                    </button>
                  </>
                )}
                {/* Close Overlay */}
                <div className="fixed inset-0 z-[-1]" onClick={handleCloseContextMenu} />
              </div>
            )}
        </div>
      </div>

      <AIWorkflowPlanner 
        open={isAIPlannerOpen} 
        onOpenChange={setIsAIPlannerOpen} 
        onPlanApplied={handleAIPlan} 
      />

      {/* Code View Modal */}
      {isCodeViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-400" />
                <div>
                    <h3 className="font-semibold text-slate-200">Workflow Source Code (Editable)</h3>
                    <p className="text-xs text-slate-500">Edit the JSON below to manually fix or update your workflow.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCodeViewOpen(false)} className="h-8 w-8 text-slate-400 hover:text-white"><X className="w-4 h-4" /></Button>
            </div>
            <div className="flex-grow overflow-hidden relative bg-slate-950 p-0 group">
                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="gap-2 shadow-lg" onClick={() => {
                        navigator.clipboard.writeText(codeViewContent);
                        toast({ title: "Copied to Clipboard", description: "Ready to paste into your AI assistant." });
                    }}>
                        <Copy className="w-4 h-4" /> Copy
                    </Button>
                    <Button size="sm" className="gap-2 shadow-lg bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                        try {
                            const data = JSON.parse(codeViewContent);
                            recordHistory();
                            if (data.id) setWorkflowId(data.id);
                            setWorkflowMeta({ 
                                name: data.name || workflowMeta.name, 
                                version: data.version || workflowMeta.version,
                                environment: data.environment || 'draft'
                            });
                            setNodes(data.nodes || []);
                            setEdges(data.edges || []);
                            if (data.viewport && reactFlowInstance) {
                                reactFlowInstance.setViewport(data.viewport);
                            }
                            setIsCodeViewOpen(false);
                            toast({ title: "Workflow Updated", description: "Code changes applied successfully." });
                        } catch (error) {
                            toast({ title: "Invalid JSON", description: error.message, variant: "destructive" });
                        }
                    }}>
                        <Check className="w-4 h-4" /> Apply
                    </Button>
                </div>
                <textarea 
                    className="w-full h-full p-4 bg-slate-950 text-xs font-mono text-blue-300/90 leading-relaxed selection:bg-blue-500/30 resize-none focus:outline-none border-none"
                    value={codeViewContent}
                    onChange={(e) => setCodeViewContent(e.target.value)}
                    spellCheck="false"
                />
            </div>
          </div>
        </div>
      )}

      {/* Load Workflow Modal */}
      {isLoadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="font-semibold text-slate-200">Saved Workflows</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsLoadModalOpen(false)}><ChevronRight className="w-4 h-4 rotate-90" /></Button>
            </div>
            <div className="p-2 overflow-y-auto space-y-1">
              {savedWorkflows.length === 0 && <div className="p-4 text-center text-slate-500 text-sm">No saved workflows found.</div>}
              {savedWorkflows.map(wf => (
                <div key={wf.id} onClick={() => handleLoad(wf.id)} className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer group flex items-center justify-between transition-colors">
                  <div>
                    <div className="font-medium text-slate-200 text-sm">{wf.name}</div>
                    <div className="text-xs text-slate-500">v{wf.version} • {new Date(wf.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDelete(wf.id, e)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Execution History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="font-semibold text-slate-200">Execution History</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2">
              {runHistory.length === 0 && <div className="text-center text-slate-500 py-8">No runs yet.</div>}
              {runHistory.map((run) => (
                <div key={run.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${run.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                            <div className="text-sm font-medium text-slate-200">
                                {run.status === 'completed' ? 'Success' : 'Failed'}
                            </div>
                            <div className="text-xs text-slate-500">
                                {run.timestamp.toLocaleTimeString()} • {Object.keys(run.results).length} nodes processed
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setExecutionResults(run.results); setIsHistoryOpen(false); toast({description: "Loaded past run results"}); }}>
                        Load Results
                    </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <WorkflowBuilder />
  </ReactFlowProvider>
);