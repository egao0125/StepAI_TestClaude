"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Phone, Settings, Loader2 } from "lucide-react";
import FlowBuilder from "@/components/flow-builder/FlowBuilder";
import LLMSelector from "@/components/LLMSelector";
import { Agent, ConversationFlow, LLMProviderType, VOICE_OPTIONS } from "@/lib/types";

export default function AgentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    fetch(`/api/agents/${agentId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setAgent(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/agents");
      });
  }, [agentId, router]);

  const handleFlowChange = useCallback((flow: ConversationFlow) => {
    setAgent((prev) => (prev ? { ...prev, flow } : null));
  }, []);

  const handleSave = async () => {
    if (!agent) return;
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agent),
      });

      if (res.ok) {
        const updated = await res.json();
        setAgent(updated);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !agent) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/agents" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{agent.name}</h1>
            <p className="text-xs text-gray-500">{agent.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="text-sm text-green-600 font-medium">Saved!</span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-red-600 font-medium">Save failed</span>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showSettings
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          <Link
            href={`/agents/${agentId}/test`}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Test Call
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <FlowBuilder initialFlow={agent.flow} onFlowChange={handleFlowChange} />
        </div>

        {showSettings && (
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Agent Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={agent.name}
                    onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={agent.description}
                    onChange={(e) => setAgent({ ...agent, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Model</h3>
              <LLMSelector
                provider={agent.llmProvider}
                model={agent.llmModel}
                onProviderChange={(p: LLMProviderType) => setAgent({ ...agent, llmProvider: p })}
                onModelChange={(m: string) => setAgent({ ...agent, llmModel: m })}
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Voice</h3>
              <select
                value={agent.voice}
                onChange={(e) => setAgent({ ...agent, voice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">System Prompt</h3>
              <textarea
                value={agent.systemPrompt}
                onChange={(e) => setAgent({ ...agent, systemPrompt: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
