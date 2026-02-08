import {
  getAllAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  getCallSession,
  createCallSession,
  updateCallSession,
  deleteCallSession,
} from "@/lib/store";
import { Agent, CallSession } from "@/lib/types";

describe("Agent Store", () => {
  const testAgent: Agent = {
    id: "test-agent-1",
    name: "Test Agent",
    description: "A test agent",
    llmProvider: "claude",
    llmModel: "claude-sonnet-4-5-20250929",
    systemPrompt: "You are a test agent.",
    voice: "Polly.Joanna",
    flow: {
      nodes: [
        {
          id: "greeting-1",
          type: "greeting",
          position: { x: 0, y: 0 },
          data: { label: "Hello", message: "Hi there!" },
        },
      ],
      edges: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  test("should have a seeded demo agent", () => {
    const agents = getAllAgents();
    expect(agents.length).toBeGreaterThanOrEqual(1);
    const demo = agents.find((a) => a.id === "demo-agent-1");
    expect(demo).toBeDefined();
    expect(demo?.name).toBe("Customer Support Agent");
  });

  test("should create an agent", () => {
    const created = createAgent(testAgent);
    expect(created.id).toBe("test-agent-1");
    expect(created.name).toBe("Test Agent");
  });

  test("should get an agent by id", () => {
    const agent = getAgent("test-agent-1");
    expect(agent).toBeDefined();
    expect(agent?.name).toBe("Test Agent");
  });

  test("should return undefined for non-existent agent", () => {
    const agent = getAgent("non-existent");
    expect(agent).toBeUndefined();
  });

  test("should update an agent", () => {
    const updated = updateAgent("test-agent-1", { name: "Updated Agent" });
    expect(updated).toBeDefined();
    expect(updated?.name).toBe("Updated Agent");
  });

  test("should return undefined when updating non-existent agent", () => {
    const updated = updateAgent("non-existent", { name: "Test" });
    expect(updated).toBeUndefined();
  });

  test("should list all agents sorted by updatedAt", () => {
    const agents = getAllAgents();
    expect(agents.length).toBeGreaterThanOrEqual(2);
    // Most recently updated should be first
    for (let i = 1; i < agents.length; i++) {
      expect(new Date(agents[i - 1].updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(agents[i].updatedAt).getTime()
      );
    }
  });

  test("should delete an agent", () => {
    const deleted = deleteAgent("test-agent-1");
    expect(deleted).toBe(true);
    expect(getAgent("test-agent-1")).toBeUndefined();
  });

  test("should return false when deleting non-existent agent", () => {
    const deleted = deleteAgent("non-existent");
    expect(deleted).toBe(false);
  });
});

describe("Call Session Store", () => {
  const testSession: CallSession = {
    callSid: "CA123456",
    agentId: "demo-agent-1",
    currentNodeId: "greeting-1",
    conversationHistory: [],
    startedAt: new Date().toISOString(),
    status: "active",
  };

  test("should create a call session", () => {
    const session = createCallSession(testSession);
    expect(session.callSid).toBe("CA123456");
    expect(session.status).toBe("active");
  });

  test("should get a call session", () => {
    const session = getCallSession("CA123456");
    expect(session).toBeDefined();
    expect(session?.agentId).toBe("demo-agent-1");
  });

  test("should update a call session", () => {
    const updated = updateCallSession("CA123456", {
      status: "completed",
      currentNodeId: "end-1",
    });
    expect(updated?.status).toBe("completed");
    expect(updated?.currentNodeId).toBe("end-1");
  });

  test("should return undefined for non-existent session", () => {
    const session = getCallSession("non-existent");
    expect(session).toBeUndefined();
  });

  test("should delete a call session", () => {
    const deleted = deleteCallSession("CA123456");
    expect(deleted).toBe(true);
    expect(getCallSession("CA123456")).toBeUndefined();
  });
});
