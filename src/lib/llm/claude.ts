import Anthropic from "@anthropic-ai/sdk";
import { ChatMessage, LLMProvider } from "./types";

export class ClaudeProvider implements LLMProvider {
  private client: Anthropic;
  private model: string;

  constructor(model: string, apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.model = model;
  }

  async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const filteredMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 300,
      system: systemPrompt,
      messages: filteredMessages,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "I'm sorry, I couldn't generate a response.";
  }
}
