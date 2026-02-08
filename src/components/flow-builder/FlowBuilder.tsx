"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

import { v4 as uuidv4 } from "uuid";
import { ConversationFlow, FlowNode } from "@/lib/types";
import GreetingNode from "./nodes/GreetingNode";
import MenuNode from "./nodes/MenuNode";
import LLMResponseNode from "./nodes/LLMResponseNode";
import TransferNode from "./nodes/TransferNode";
import EndNode from "./nodes/EndNode";
import NodePalette from "./NodePalette";
import NodeEditor from "./NodeEditor";

interface FlowBuilderProps {
  initialFlow: ConversationFlow;
  onFlowChange: (flow: ConversationFlow) => void;
}

const NODE_DEFAULTS: Record<string, Partial<FlowNode["data"]>> = {
  greeting: { label: "Greeting", message: "Hello! How can I help you today?" },
  menu: {
    label: "Menu",
    message: "Please choose from the following options:",
    options: [
      { key: "1", label: "Option 1" },
      { key: "2", label: "Option 2" },
    ],
  },
  "llm-response": {
    label: "AI Response",
    message: "I'll help you with that. What would you like to know?",
  },
  transfer: {
    label: "Transfer",
    message: "Let me transfer you to the right department.",
    department: "",
    transferTo: "",
  },
  end: {
    label: "End Call",
    message: "Thank you for calling! Have a great day.",
  },
};

export default function FlowBuilder({ initialFlow, onFlowChange }: FlowBuilderProps) {
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      greeting: GreetingNode,
      menu: MenuNode,
      "llm-response": LLMResponseNode,
      transfer: TransferNode,
      end: EndNode,
    }),
    []
  );

  const initialNodes: Node[] = initialFlow.nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data,
  }));

  const initialEdges: Edge[] = initialFlow.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    label: e.label,
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  const syncFlow = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      onFlowChange({
        nodes: newNodes.map((n) => ({
          id: n.id,
          type: n.type as FlowNode["type"],
          position: n.position,
          data: n.data,
        })),
        edges: newEdges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle || undefined,
          targetHandle: e.targetHandle || undefined,
          label: e.label as string | undefined,
        })),
      });
    },
    [onFlowChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          eds
        );
        syncFlow(nodes, newEdges);
        return newEdges;
      });
    },
    [setEdges, nodes, syncFlow]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const flowNode: FlowNode = {
        id: node.id,
        type: node.type as FlowNode["type"],
        position: node.position,
        data: node.data,
      };
      setSelectedNode(flowNode);
    },
    []
  );

  const handleAddNode = useCallback(
    (type: string) => {
      const id = `${type}-${uuidv4().slice(0, 8)}`;
      const defaults = NODE_DEFAULTS[type] || { label: type };
      // Place new node in the center area with some randomness
      const position = {
        x: 200 + Math.random() * 200,
        y: 100 + nodes.length * 120,
      };

      const newNode: Node = {
        id,
        type,
        position,
        data: { ...defaults },
      };

      setNodes((nds) => {
        const updated = [...nds, newNode];
        syncFlow(updated, edges);
        return updated;
      });
    },
    [nodes.length, edges, setNodes, syncFlow]
  );

  const handleNodeDataChange = useCallback(
    (nodeId: string, dataUpdates: Partial<FlowNode["data"]>) => {
      setNodes((nds) => {
        const updated = nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...dataUpdates } } : n
        );
        syncFlow(updated, edges);
        return updated;
      });
      setSelectedNode((prev) =>
        prev && prev.id === nodeId
          ? { ...prev, data: { ...prev.data, ...dataUpdates } }
          : prev
      );
    },
    [edges, setNodes, syncFlow]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const updated = nds.filter((n) => n.id !== nodeId);
        const updatedEdges = edges.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );
        setEdges(updatedEdges);
        syncFlow(updated, updatedEdges);
        return updated;
      });
      setSelectedNode(null);
    },
    [edges, setNodes, setEdges, syncFlow]
  );

  const handleNodesChangeWrapper = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
      // Sync after position changes
      setTimeout(() => {
        setNodes((nds) => {
          syncFlow(nds, edges);
          return nds;
        });
      }, 0);
    },
    [onNodesChange, edges, setNodes, syncFlow]
  );

  return (
    <div className="flex h-full">
      {/* Palette Sidebar */}
      <div className="w-56 border-r border-gray-200 p-4 bg-gray-50 overflow-y-auto">
        <NodePalette onAddNode={handleAddNode} />
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChangeWrapper}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-gray-50"
        >
          <Controls className="!bg-white !border-gray-200 !shadow-md" />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
        </ReactFlow>
      </div>

      {/* Node Editor Panel */}
      {selectedNode && (
        <div className="absolute right-4 top-4 z-10">
          <NodeEditor
            node={selectedNode}
            onChange={handleNodeDataChange}
            onDelete={handleDeleteNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
    </div>
  );
}
