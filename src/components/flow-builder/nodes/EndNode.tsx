"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { PhoneOff } from "lucide-react";

function EndNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`bg-white rounded-xl border-2 shadow-sm min-w-[220px] ${
        selected ? "border-red-500 shadow-red-100" : "border-red-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-red-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="bg-red-50 px-4 py-2 rounded-t-[10px] flex items-center gap-2">
        <PhoneOff className="w-4 h-4 text-red-600" />
        <span className="text-sm font-semibold text-red-700">{data.label || "End Call"}</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-gray-600 line-clamp-2">
          {data.message || "Thank you for calling. Goodbye!"}
        </p>
      </div>
    </div>
  );
}

export default memo(EndNode);
