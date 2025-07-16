import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useState} from "react";
import { toast } from 'sonner';

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "🎯 Lead Created" },
    position: { x: 100, y: 50 },
    style: { background: "#fef3c7", padding: 10, borderRadius: 12 },
  },
];

let id = 2;
const getId = () => `${id++}`;

const actionOptions = ["Send Email", "Update Status"];

export default function WorkflowDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedAction, setSelectedAction] = useState(actionOptions[0]);
  const [loading, setLoading] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const addActionNode = () => {
    if (nodes.length >= 4) {
      toast.error("Limit 3 nodes");
      return;
    }
    const action = selectedAction;
    setNodes((nds) => [
      ...nds,
      {
        id: getId(),
        data: { label: action },
        position: { x: 200, y: 100 + nds.length * 100 },
        style: {
          background: action === "Send Email" ? "#dbeafe" : "#dcfce7",
          padding: 10,
          borderRadius: 12,
        },
      },
    ]);
  };

  const executeFlow = async () => {
    setLoading(true);
    const actions = nodes.slice(1).map((n) => n.data.label);
    if (actions.length === 0) {
      setLoading(false);
      return toast.warning("No actions to run");
    }

    const res = await fetch("http://localhost:8000/leads");
    const leads = await res.json();
    const newLeads = leads.filter((l) => l.status === "New");

    const logEntries = [];

    for (const lead of newLeads) {
      for (const action of actions) {
        if (action === "Send Email") {
          try {
            await fetch("http://localhost:8000/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: lead.email,
                subject: "👋 Hello from Lead Dashboard!",
                message: `Hi ${lead.name},\n\nThank you for your interest in Piazza Consulting Group. We are excited to connect with you and discuss how our team can support your goals. Let us know if you have any questions!\n\nBest regards,\nPiazza Consulting Group`,
              }),
            });
            toast.success(`Email sent to ${lead.name}`);
            logEntries.push({
              leadEmail: lead.email,
              action: "Send Email",
              status: "success",
              time: new Date().toISOString(),
            });
          } catch (err) {
            toast.error(`Failed to email ${lead.name}`);
            logEntries.push({
              leadEmail: lead.email,
              action: "Send Email",
              status: "failed",
              time: new Date().toISOString(),
            });
          }
        }

        if (action === "Update Status") {
          try {
            await fetch("http://localhost:8000/update-lead", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: lead.email, status: "Contacted" }),
            });
            toast(`Status updated for ${lead.name}`);
            logEntries.push({
              leadEmail: lead.email,
              action: "Update Status",
              status: "success",
              time: new Date().toISOString(),
            });
          } catch (err) {
            toast.error(`Failed to update ${lead.name}`);
            logEntries.push({
              leadEmail: lead.email,
              action: "Update Status",
              status: "failed",
              time: new Date().toISOString(),
            });
          }
        }
      }
    }

    if (newLeads.length === 0) {
      toast.info("No 'New' leads to process.");
    }

    setExecutionLog((prev) => [...prev, ...logEntries]);
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">🧩 Workflow Designer</h2>
        <div className="space-x-2 flex items-center">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {actionOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <button
            onClick={addActionNode}
            className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Add Action
          </button>

          <button
            onClick={executeFlow}
            className={`bg-accent text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
            disabled={loading}
          >
            {loading && <span className="animate-spin">⏳</span>}
            Run
          </button>
        </div>
      </div>

      <div className="h-[400px] border rounded-md overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Execution Log Panel */}
      <div className="mt-6 bg-glass-gradient backdrop-blur-md border border-white/10 rounded-xl p-4 text-gray-800 dark:text-gray-100 shadow transition-all">
        <h3 className="text-lg font-semibold mb-2">Execution Log</h3>
        {executionLog.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No actions run yet.</p>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto">
            {[...executionLog].reverse().map((entry, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <span className="text-xs text-gray-400 dark:text-gray-500 w-28">{new Date(entry.time).toLocaleTimeString()}</span>
                <span className="font-mono w-40 truncate" title={entry.leadEmail}>{entry.leadEmail}</span>
                <span className="w-28">{entry.action}</span>
                <span className={
                  entry.status === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 px-2 py-0.5 rounded-full text-xs"
                    : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 px-2 py-0.5 rounded-full text-xs"
                }>
                  {entry.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
