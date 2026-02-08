import { LLMConfig, LLMProvider } from "./types";
import { ClaudeProvider } from "./claude";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";

export function createLLMProvider(config: LLMConfig): LLMProvider {
  switch (config.provider) {
    case "claude":
      return new ClaudeProvider(config.model, config.apiKey);
    case "openai":
      return new OpenAIProvider(config.model, config.apiKey);
    case "gemini":
      return new GeminiProvider(config.model, config.apiKey);
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
}

export type { LLMProvider, LLMConfig, ChatMessage } from "./types";
