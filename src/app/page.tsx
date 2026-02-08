"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bot, Phone, Brain, ArrowRight } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import { Agent } from "@/lib/types";

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/agents/${id}`, { method: "DELETE" });
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Build AI Voice Agents
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Design conversation flows visually, connect any LLM (Claude, GPT,
              Gemini), and deploy voice agents powered by Twilio. No coding
              required.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/agents/new"
                className="flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Agent
              </Link>
              <Link
                href="/agents"
                className="flex items-center gap-2 px-6 py-3 bg-primary-500/30 text-white rounded-lg font-semibold hover:bg-primary-500/40 transition-colors border border-primary-400/30"
              >
                View All Agents
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Visual Flow Builder
            </h3>
            <p className="text-gray-600">
              Drag-and-drop nodes to design conversation flows. Add greetings,
              menus, AI responses, transfers, and more.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multi-LLM Support
            </h3>
            <p className="text-gray-600">
              Choose from Anthropic Claude, OpenAI GPT, or Google Gemini. Switch
              models per agent to find the best fit.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Twilio Voice Integration
            </h3>
            <p className="text-gray-600">
              Connect to Twilio for real phone calls. Test agents from your
              browser or assign them a phone number.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Agents</h2>
            <Link
              href="/agents/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Agent
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-48 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-40 bg-gray-200 rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-9 flex-1 bg-gray-200 rounded-lg" />
                    <div className="h-9 w-16 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : agents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No agents yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first AI voice agent to get started.
              </p>
              <Link
                href="/agents/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Agent
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
