"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Loader2 } from "lucide-react";
import CallPanel from "@/components/CallPanel";
import { Agent, LLM_MODELS } from "@/lib/types";

export default function TestCallPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !agent) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const modelName =
    LLM_MODELS[agent.llmProvider]?.find((m) => m.id === agent.llmModel)?.name ||
    agent.llmModel;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/agents/${agentId}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Editor
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</dt>
                <dd className="text-sm text-gray-900 mt-1">{agent.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">LLM</dt>
                <dd className="text-sm text-gray-900 mt-1">{modelName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Flow Nodes</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {agent.flow.nodes.length} nodes, {agent.flow.edges.length} connections
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Voice</dt>
                <dd className="text-sm text-gray-900 mt-1">{agent.voice}</dd>
              </div>
            </dl>
          </div>

          <Link
            href={`/agents/${agentId}`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Flow
          </Link>

          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">Setup Required</h3>
            <p className="text-xs text-amber-700 mb-2">
              To make live calls, configure your Twilio credentials in the{" "}
              <code className="bg-amber-100 px-1 rounded">.env</code> file:
            </p>
            <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
              <li>TWILIO_ACCOUNT_SID</li>
              <li>TWILIO_AUTH_TOKEN</li>
              <li>TWILIO_API_KEY &amp; TWILIO_API_SECRET</li>
              <li>TWILIO_TWIML_APP_SID</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Call</h2>
          <CallPanel agent={agent} />
        </div>
      </div>
    </div>
  );
}
