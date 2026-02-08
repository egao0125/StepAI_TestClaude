"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ArrowRightLeft } from "lucide-react";

function TransferNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`bg-white rounded-xl border-2 shadow-sm min-w-[220px] ${
        selected ? "border-orange-500 shadow-orange-100" : "border-orange-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-orange-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="bg-orange-50 px-4 py-2 rounded-t-[10px] flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-semibold text-orange-700">
          {data.label || "Transfer"}
        </span>
      </div>
      <div className="px-4 py-3 space-y-1">
        <p className="text-xs text-gray-600">{data.message || "Transferring call..."}</p>
        {data.department && (
          <p className="text-xs text-orange-600 font-medium">Dept: {data.department}</p>
        )}
        {data.transferTo && (
          <p className="text-xs text-gray-500 font-mono">{data.transferTo}</p>
        )}
      </div>
    </div>
  );
}

export default memo(TransferNode);
