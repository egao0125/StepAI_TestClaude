"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Brain } from "lucide-react";

function LLMResponseNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`bg-white rounded-xl border-2 shadow-sm min-w-[220px] ${
        selected ? "border-emerald-500 shadow-emerald-100" : "border-emerald-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="bg-emerald-50 px-4 py-2 rounded-t-[10px] flex items-center gap-2">
        <Brain className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-semibold text-emerald-700">
          {data.label || "AI Response"}
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-gray-600 line-clamp-3">
          {data.message || "AI will respond based on the conversation context"}
        </p>
        <div className="mt-2 flex items-center gap-1">
          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded-full">
            LLM Powered
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(LLMResponseNode);
