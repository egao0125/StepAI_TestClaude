export type LLMProviderType = "claude" | "openai" | "gemini";

export interface Agent {
  id: string;
  name: string;
  description: string;
  llmProvider: LLMProviderType;
  llmModel: string;
  systemPrompt: string;
  voice: string;
  flow: ConversationFlow;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface FlowNode {
  id: string;
  type: "greeting" | "menu" | "llm-response" | "transfer" | "end";
  position: { x: number; y: number };
  data: FlowNodeData;
}

export interface FlowNodeData {
  label: string;
  message?: string;
  options?: MenuOption[];
  transferTo?: string;
  department?: string;
}

export interface MenuOption {
  key: string;
  label: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface CallSession {
  callSid: string;
  agentId: string;
  currentNodeId: string;
  conversationHistory: ChatMessage[];
  startedAt: string;
  status: "active" | "completed" | "failed";
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const LLM_MODELS: Record<LLMProviderType, { id: string; name: string }[]> = {
  claude: [
    { id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5" },
    { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5" },
  ],
  openai: [
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  ],
  gemini: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  ],
};

export const VOICE_OPTIONS = [
  { id: "alice", name: "Alice (Female)" },
  { id: "man", name: "Man (Male)" },
  { id: "woman", name: "Woman (Female)" },
  { id: "Polly.Joanna", name: "Joanna (Female, Neural)" },
  { id: "Polly.Matthew", name: "Matthew (Male, Neural)" },
  { id: "Polly.Amy", name: "Amy (Female, British)" },
];
