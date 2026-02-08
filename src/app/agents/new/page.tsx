"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import LLMSelector from "@/components/LLMSelector";
import { LLMProviderType, VOICE_OPTIONS } from "@/lib/types";

export default function NewAgentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    llmProvider: "claude" as LLMProviderType,
    llmModel: "claude-sonnet-4-5-20250929",
    systemPrompt:
      "You are a friendly and helpful customer support agent. Keep responses concise and conversational, suitable for a phone call. Help the customer with their inquiry efficiently.",
    voice: "Polly.Joanna",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const agent = await res.json();
        router.push(`/agents/${agent.id}`);
      }
    } catch {
      // Handle error silently
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/agents"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Agent</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Customer Support Agent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="Brief description of what this agent does"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">AI Model</h2>
          <LLMSelector
            provider={form.llmProvider}
            model={form.llmModel}
            onProviderChange={(p) => setForm({ ...form, llmProvider: p })}
            onModelChange={(m) => setForm({ ...form, llmModel: m })}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Voice Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
            <select
              value={form.voice}
              onChange={(e) => setForm({ ...form, voice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">System Prompt</h2>
          <p className="text-sm text-gray-500">
            This is the base instruction for the AI. It defines the agent&apos;s personality and behavior.
          </p>
          <textarea
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder="You are a helpful customer support agent..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/agents"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !form.name}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Creating..." : "Create Agent"}
          </button>
        </div>
      </form>
    </div>
  );
}
