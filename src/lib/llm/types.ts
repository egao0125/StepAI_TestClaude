export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMProvider {
  chat(messages: ChatMessage[], systemPrompt: string): Promise<string>;
}

export interface LLMConfig {
  provider: "claude" | "openai" | "gemini";
  model: string;
  apiKey?: string;
}
