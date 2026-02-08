"use client";

import { LLMProviderType, LLM_MODELS } from "@/lib/types";

interface LLMSelectorProps {
  provider: LLMProviderType;
  model: string;
  onProviderChange: (provider: LLMProviderType) => void;
  onModelChange: (model: string) => void;
}

const PROVIDERS: { id: LLMProviderType; name: string; color: string }[] = [
  { id: "claude", name: "Anthropic Claude", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "openai", name: "OpenAI", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "gemini", name: "Google Gemini", color: "bg-blue-100 text-blue-700 border-blue-200" },
];

export default function LLMSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
}: LLMSelectorProps) {
  const models = LLM_MODELS[provider] || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LLM Provider
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onProviderChange(p.id);
                const firstModel = LLM_MODELS[p.id]?.[0];
                if (firstModel) onModelChange(firstModel.id);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                provider === p.id
                  ? `${p.color} ring-2 ring-offset-1 ring-current`
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
