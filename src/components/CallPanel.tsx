"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Phone, PhoneOff, Mic, MicOff, Loader2 } from "lucide-react";
import { Agent } from "@/lib/types";

interface CallPanelProps {
  agent: Agent;
}

type CallStatus = "idle" | "connecting" | "active" | "ended" | "error";

interface ConversationEntry {
  role: "agent" | "user";
  text: string;
  timestamp: string;
}

export default function CallPanel({ agent }: CallPanelProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startCall = useCallback(async () => {
    setCallStatus("connecting");
    setConversation([]);
    setDuration(0);
    setErrorMessage("");

    try {
      // Request Twilio token
      const tokenRes = await fetch("/api/twilio/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: `user-${Date.now()}` }),
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to get call token. Check Twilio configuration.");
      }

      // Simulate successful connection for demo
      setCallStatus("active");

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // Add initial agent greeting
      const greetingNode = agent.flow.nodes.find((n) => n.type === "greeting");
      if (greetingNode?.data.message) {
        setConversation([
          {
            role: "agent",
            text: greetingNode.data.message,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect call";
      setErrorMessage(msg);
      setCallStatus("error");
    }
  }, [agent]);

  const endCall = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCallStatus("ended");

    setConversation((prev) => [
      ...prev,
      {
        role: "agent",
        text: "Call ended. Thank you!",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const toggleMute = () => setIsMuted((m) => !m);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Call Header */}
      <div
        className={`px-6 py-4 ${
          callStatus === "active"
            ? "bg-green-600"
            : callStatus === "connecting"
              ? "bg-yellow-500"
              : callStatus === "error"
                ? "bg-red-600"
                : "bg-gray-800"
        } text-white`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm opacity-80">
              {callStatus === "idle" && "Ready to test"}
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "active" && `In call - ${formatDuration(duration)}`}
              {callStatus === "ended" && `Call ended - ${formatDuration(duration)}`}
              {callStatus === "error" && "Connection failed"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {callStatus === "active" && (
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full transition-colors ${
                  isMuted ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Log */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {conversation.length === 0 && callStatus === "idle" && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Click "Start Call" to test your agent</p>
          </div>
        )}
        {conversation.map((entry, i) => (
          <div
            key={i}
            className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                entry.role === "user"
                  ? "bg-primary-600 text-white rounded-br-md"
                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
              }`}
            >
              <p className="text-sm">{entry.text}</p>
            </div>
          </div>
        ))}
        <div ref={conversationEndRef} />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Call Controls */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-4">
        {(callStatus === "idle" || callStatus === "ended" || callStatus === "error") && (
          <button
            onClick={startCall}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Start Test Call
          </button>
        )}
        {callStatus === "connecting" && (
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-full font-medium"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </button>
        )}
        {callStatus === "active" && (
          <button
            onClick={endCall}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </button>
        )}
      </div>
    </div>
  );
}
