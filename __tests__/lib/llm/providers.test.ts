import { createLLMProvider } from "@/lib/llm";

describe("LLM Provider Factory", () => {
  test("should create a Claude provider", () => {
    const provider = createLLMProvider({
      provider: "claude",
      model: "claude-sonnet-4-5-20250929",
      apiKey: "test-key",
    });
    expect(provider).toBeDefined();
    expect(typeof provider.chat).toBe("function");
  });

  test("should create an OpenAI provider", () => {
    const provider = createLLMProvider({
      provider: "openai",
      model: "gpt-4o",
      apiKey: "test-key",
    });
    expect(provider).toBeDefined();
    expect(typeof provider.chat).toBe("function");
  });

  test("should create a Gemini provider", () => {
    const provider = createLLMProvider({
      provider: "gemini",
      model: "gemini-1.5-pro",
      apiKey: "test-key",
    });
    expect(provider).toBeDefined();
    expect(typeof provider.chat).toBe("function");
  });

  test("should throw for unsupported provider", () => {
    expect(() =>
      createLLMProvider({
        provider: "unsupported" as any,
        model: "test",
      })
    ).toThrow("Unsupported LLM provider: unsupported");
  });
});
