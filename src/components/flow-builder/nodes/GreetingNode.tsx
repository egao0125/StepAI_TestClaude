"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { MessageSquare } from "lucide-react";

function GreetingNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`bg-white rounded-xl border-2 shadow-sm min-w-[220px] ${
        selected ? "border-blue-500 shadow-blue-100" : "border-blue-200"
      }`}
    >
      <div className="bg-blue-50 px-4 py-2 rounded-t-[10px] flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-blue-700">{data.label || "Greeting"}</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-gray-600 line-clamp-3">
          {data.message || "Hello! How can I help you?"}
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(GreetingNode);
