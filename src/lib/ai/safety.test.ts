import { describe, expect, it } from "vitest";

import { AI_HEALTH_DISCLAIMER, isMedicalRisk, medicalSafetyResponse } from "@/lib/ai/safety";

describe("AI safety", () => {
  it("detects medical-risk requests", () => {
    expect(isMedicalRisk("Can you diagnose this chest pain?")).toBe(true);
    expect(isMedicalRisk("Build me a hydration routine")).toBe(false);
  });

  it("returns the required disclaimer in safety responses", () => {
    expect(medicalSafetyResponse()).toContain(AI_HEALTH_DISCLAIMER);
    expect(medicalSafetyResponse()).toContain("cannot diagnose");
  });
});
