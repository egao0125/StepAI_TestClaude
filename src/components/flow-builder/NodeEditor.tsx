"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { FlowNode, MenuOption } from "@/lib/types";

interface NodeEditorProps {
  node: FlowNode;
  onChange: (nodeId: string, data: Partial<FlowNode["data"]>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export default function NodeEditor({ node, onChange, onDelete, onClose }: NodeEditorProps) {
  const updateData = (updates: Partial<FlowNode["data"]>) => {
    onChange(node.id, updates);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Edit Node</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            type="text"
            value={node.data.label || ""}
            onChange={(e) => updateData({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Message */}
        {(node.type === "greeting" ||
          node.type === "menu" ||
          node.type === "llm-response" ||
          node.type === "transfer" ||
          node.type === "end") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={node.data.message || ""}
              onChange={(e) => updateData({ message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>
        )}

        {/* Menu Options */}
        {node.type === "menu" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Options
            </label>
            <div className="space-y-2">
              {(node.data.options || []).map((opt: MenuOption, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt.key}
                    onChange={(e) => {
                      const newOptions = [...(node.data.options || [])];
                      newOptions[i] = { ...newOptions[i], key: e.target.value };
                      updateData({ options: newOptions });
                    }}
                    className="w-12 px-2 py-1.5 border border-gray-300 rounded text-sm text-center"
                    placeholder="#"
                  />
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => {
                      const newOptions = [...(node.data.options || [])];
                      newOptions[i] = { ...newOptions[i], label: e.target.value };
                      updateData({ options: newOptions });
                    }}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                    placeholder="Option label"
                  />
                  <button
                    onClick={() => {
                      const newOptions = (node.data.options || []).filter(
                        (_: MenuOption, idx: number) => idx !== i
                      );
                      updateData({ options: newOptions });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const currentOptions = node.data.options || [];
                  const nextKey = String(currentOptions.length + 1);
                  updateData({
                    options: [...currentOptions, { key: nextKey, label: "" }],
                  });
                }}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Option
              </button>
            </div>
          </div>
        )}

        {/* Transfer fields */}
        {node.type === "transfer" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={node.data.department || ""}
                onChange={(e) => updateData({ department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Sales, Support"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer To (Phone)
              </label>
              <input
                type="text"
                value={node.data.transferTo || ""}
                onChange={(e) => updateData({ transferTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+1234567890"
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => onDelete(node.id)}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Node
        </button>
      </div>
    </div>
  );
}
