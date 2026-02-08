import { LLM_MODELS, VOICE_OPTIONS } from "@/lib/types";

describe("Type Constants", () => {
  test("LLM_MODELS should have entries for all providers", () => {
    expect(LLM_MODELS.claude).toBeDefined();
    expect(LLM_MODELS.openai).toBeDefined();
    expect(LLM_MODELS.gemini).toBeDefined();
  });

  test("each LLM provider should have at least one model", () => {
    expect(LLM_MODELS.claude.length).toBeGreaterThan(0);
    expect(LLM_MODELS.openai.length).toBeGreaterThan(0);
    expect(LLM_MODELS.gemini.length).toBeGreaterThan(0);
  });

  test("each model should have id and name", () => {
    for (const provider of Object.values(LLM_MODELS)) {
      for (const model of provider) {
        expect(model.id).toBeDefined();
        expect(model.name).toBeDefined();
        expect(typeof model.id).toBe("string");
        expect(typeof model.name).toBe("string");
      }
    }
  });

  test("VOICE_OPTIONS should have entries", () => {
    expect(VOICE_OPTIONS.length).toBeGreaterThan(0);
  });

  test("each voice option should have id and name", () => {
    for (const voice of VOICE_OPTIONS) {
      expect(voice.id).toBeDefined();
      expect(voice.name).toBeDefined();
    }
  });
});
