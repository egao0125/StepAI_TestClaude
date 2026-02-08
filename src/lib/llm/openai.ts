import OpenAI from "openai";
import { ChatMessage, LLMProvider } from "./types";

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(model: string, apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    this.model = model;
  }

  async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const allMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    ];

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: allMessages,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
  }
}
