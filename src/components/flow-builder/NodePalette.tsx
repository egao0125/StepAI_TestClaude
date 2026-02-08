"use client";

import { MessageSquare, List, Brain, ArrowRightLeft, PhoneOff } from "lucide-react";

const NODE_TYPES = [
  {
    type: "greeting",
    label: "Greeting",
    description: "Start with a welcome message",
    icon: MessageSquare,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    type: "menu",
    label: "Menu",
    description: "Present options to the caller",
    icon: List,
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    type: "llm-response",
    label: "AI Response",
    description: "LLM-powered conversation",
    icon: Brain,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    type: "transfer",
    label: "Transfer",
    description: "Transfer to a human agent",
    icon: ArrowRightLeft,
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    type: "end",
    label: "End Call",
    description: "End the conversation",
    icon: PhoneOff,
    color: "bg-red-50 border-red-200 text-red-700",
  },
];

interface NodePaletteProps {
  onAddNode: (type: string) => void;
}

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1">
        Add Nodes
      </h3>
      {NODE_TYPES.map((node) => (
        <button
          key={node.type}
          onClick={() => onAddNode(node.type)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left text-sm transition-all hover:shadow-sm ${node.color}`}
        >
          <node.icon className="w-4 h-4 flex-shrink-0" />
          <div>
            <div className="font-medium">{node.label}</div>
            <div className="text-xs opacity-70">{node.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
