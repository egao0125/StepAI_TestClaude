"use client";

import Link from "next/link";
import { Bot, Pencil, Phone, Trash2 } from "lucide-react";
import { Agent, LLM_MODELS } from "@/lib/types";

interface AgentCardProps {
  agent: Agent;
  onDelete?: (id: string) => void;
}

export default function AgentCard({ agent, onDelete }: AgentCardProps) {
  const modelName =
    LLM_MODELS[agent.llmProvider]?.find((m) => m.id === agent.llmModel)?.name ||
    agent.llmModel;

  const providerLabel =
    agent.llmProvider === "claude"
      ? "Anthropic"
      : agent.llmProvider === "openai"
        ? "OpenAI"
        : "Google";

  const nodeCount = agent.flow.nodes.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">{agent.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          {providerLabel} &middot; {modelName}
        </span>
        <span>{nodeCount} nodes</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/agents/${agent.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Flow
        </Link>
        <Link
          href={`/agents/${agent.id}/test`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Test
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(agent.id)}
            className="flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete agent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
