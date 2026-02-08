import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage, LLMProvider } from "./types";

export class GeminiProvider implements LLMProvider {
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

  constructor(model: string, apiKey?: string) {
    const genAI = new GoogleGenerativeAI(apiKey || process.env.GOOGLE_AI_API_KEY || "");
    this.model = genAI.getGenerativeModel({ model });
  }

  async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const history = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Extract the last user message for sendMessage
    const lastMessage = history.pop();
    if (!lastMessage) {
      return "I'm sorry, I couldn't generate a response.";
    }

    const chat = this.model.startChat({
      history,
      systemInstruction: { role: "user", parts: [{ text: systemPrompt }] },
    });

    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response;
    return response.text() || "I'm sorry, I couldn't generate a response.";
  }
}
