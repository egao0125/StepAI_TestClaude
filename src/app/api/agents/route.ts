import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAllAgents, createAgent } from "@/lib/store";
import { Agent } from "@/lib/types";

export async function GET() {
  const agents = getAllAgents();
  return NextResponse.json(agents);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const agent: Agent = {
      id: uuidv4(),
      name: body.name || "Untitled Agent",
      description: body.description || "",
      llmProvider: body.llmProvider || "claude",
      llmModel: body.llmModel || "claude-sonnet-4-5-20250929",
      systemPrompt:
        body.systemPrompt ||
        "You are a helpful customer support agent. Keep responses concise and conversational.",
      voice: body.voice || "Polly.Joanna",
      flow: body.flow || {
        nodes: [
          {
            id: "greeting-1",
            type: "greeting",
            position: { x: 250, y: 0 },
            data: {
              label: "Welcome",
              message: "Hello! How can I help you today?",
            },
          },
        ],
        edges: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = createAgent(agent);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
