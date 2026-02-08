import { NextRequest, NextResponse } from "next/server";
import { createLLMProvider } from "@/lib/llm";
import { ChatMessage } from "@/lib/llm/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      provider,
      model,
      messages,
      systemPrompt,
    }: {
      provider: string;
      model: string;
      messages: ChatMessage[];
      systemPrompt: string;
    } = body;

    if (!provider || !model || !messages || !systemPrompt) {
      return NextResponse.json(
        { error: "Missing required fields: provider, model, messages, systemPrompt" },
        { status: 400 }
      );
    }

    const llm = createLLMProvider({
      provider: provider as "claude" | "openai" | "gemini",
      model,
    });

    const response = await llm.chat(messages, systemPrompt);
    return NextResponse.json({ response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "LLM request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
