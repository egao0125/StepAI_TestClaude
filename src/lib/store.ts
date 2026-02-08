import { Agent, CallSession } from "./types";

/**
 * In-memory store for agents and call sessions.
 * In production, replace with a database (PostgreSQL, MongoDB, etc.).
 */

const agents: Map<string, Agent> = new Map();
const callSessions: Map<string, CallSession> = new Map();

// Seed a demo agent
const demoAgent: Agent = {
  id: "demo-agent-1",
  name: "Customer Support Agent",
  description: "A friendly customer support agent that helps with common inquiries",
  llmProvider: "claude",
  llmModel: "claude-sonnet-4-5-20250929",
  systemPrompt:
    "You are a friendly and helpful customer support agent. Keep responses concise and conversational, suitable for a phone call. Help the customer with their inquiry efficiently.",
  voice: "Polly.Joanna",
  flow: {
    nodes: [
      {
        id: "greeting-1",
        type: "greeting",
        position: { x: 250, y: 0 },
        data: {
          label: "Welcome",
          message:
            "Hello! Thank you for calling. How can I help you today?",
        },
      },
      {
        id: "menu-1",
        type: "menu",
        position: { x: 250, y: 150 },
        data: {
          label: "Main Menu",
          message: "Please choose from the following options:",
          options: [
            { key: "1", label: "Billing inquiry" },
            { key: "2", label: "Technical support" },
            { key: "3", label: "General question" },
          ],
        },
      },
      {
        id: "llm-1",
        type: "llm-response",
        position: { x: 50, y: 350 },
        data: {
          label: "Billing Help",
          message: "I can help with billing. What's your question?",
        },
      },
      {
        id: "llm-2",
        type: "llm-response",
        position: { x: 250, y: 350 },
        data: {
          label: "Tech Support",
          message:
            "I'll help with your technical issue. Please describe the problem.",
        },
      },
      {
        id: "llm-3",
        type: "llm-response",
        position: { x: 450, y: 350 },
        data: {
          label: "General Q&A",
          message: "Sure, what would you like to know?",
        },
      },
      {
        id: "transfer-1",
        type: "transfer",
        position: { x: 50, y: 550 },
        data: {
          label: "Transfer to Billing",
          message: "Let me transfer you to our billing department.",
          department: "billing",
          transferTo: "+15551234567",
        },
      },
      {
        id: "end-1",
        type: "end",
        position: { x: 350, y: 550 },
        data: {
          label: "End Call",
          message: "Thank you for calling! Have a great day. Goodbye!",
        },
      },
    ],
    edges: [
      {
        id: "e-greeting-menu",
        source: "greeting-1",
        target: "menu-1",
      },
      {
        id: "e-menu-billing",
        source: "menu-1",
        target: "llm-1",
        sourceHandle: "option-1",
        label: "Billing",
      },
      {
        id: "e-menu-tech",
        source: "menu-1",
        target: "llm-2",
        sourceHandle: "option-2",
        label: "Tech Support",
      },
      {
        id: "e-menu-general",
        source: "menu-1",
        target: "llm-3",
        sourceHandle: "option-3",
        label: "General",
      },
      {
        id: "e-billing-transfer",
        source: "llm-1",
        target: "transfer-1",
      },
      {
        id: "e-tech-end",
        source: "llm-2",
        target: "end-1",
      },
      {
        id: "e-general-end",
        source: "llm-3",
        target: "end-1",
      },
    ],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

agents.set(demoAgent.id, demoAgent);

// Agent CRUD operations
export function getAllAgents(): Agent[] {
  return Array.from(agents.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getAgent(id: string): Agent | undefined {
  return agents.get(id);
}

export function createAgent(agent: Agent): Agent {
  agents.set(agent.id, agent);
  return agent;
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
  const existing = agents.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  agents.set(id, updated);
  return updated;
}

export function deleteAgent(id: string): boolean {
  return agents.delete(id);
}

// Call session operations
export function getCallSession(callSid: string): CallSession | undefined {
  return callSessions.get(callSid);
}

export function createCallSession(session: CallSession): CallSession {
  callSessions.set(session.callSid, session);
  return session;
}

export function updateCallSession(
  callSid: string,
  updates: Partial<CallSession>
): CallSession | undefined {
  const existing = callSessions.get(callSid);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  callSessions.set(callSid, updated);
  return updated;
}

export function deleteCallSession(callSid: string): boolean {
  return callSessions.delete(callSid);
}
