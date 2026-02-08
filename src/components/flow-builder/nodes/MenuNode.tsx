"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { List } from "lucide-react";

function MenuNode({ data, selected }: NodeProps) {
  const options = data.options || [];

  return (
    <div
      className={`bg-white rounded-xl border-2 shadow-sm min-w-[220px] ${
        selected ? "border-purple-500 shadow-purple-100" : "border-purple-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="bg-purple-50 px-4 py-2 rounded-t-[10px] flex items-center gap-2">
        <List className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-semibold text-purple-700">{data.label || "Menu"}</span>
      </div>
      <div className="px-4 py-3 space-y-1">
        <p className="text-xs text-gray-500 mb-2">{data.message || "Choose an option:"}</p>
        {options.map((opt: { key: string; label: string }) => (
          <div key={opt.key} className="flex items-center gap-2 text-xs">
            <span className="w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center font-mono font-bold">
              {opt.key}
            </span>
            <span className="text-gray-700">{opt.label}</span>
          </div>
        ))}
      </div>
      {/* One handle per option */}
      {options.map((opt: { key: string; label: string }, i: number) => (
        <Handle
          key={opt.key}
          type="source"
          position={Position.Bottom}
          id={`option-${opt.key}`}
          className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
          style={{ left: `${((i + 1) / (options.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default memo(MenuNode);
