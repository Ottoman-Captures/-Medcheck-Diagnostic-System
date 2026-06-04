import { describe, expect, it } from "vitest";

import { healthMetricSchema, mealPlanRequestSchema, profileSchema } from "@/lib/validations/wellness";

describe("wellness validators", () => {
  it("accepts a complete onboarding profile", () => {
    const result = profileSchema.safeParse({
      name: "Aura User",
      age: 21,
      gender: "PREFER_NOT_TO_SAY",
      heightCm: 170,
      weightKg: 68,
      activityLevel: "MODERATE",
      dietaryPreferences: ["Mediterranean"],
      allergies: [],
      healthGoals: ["HYDRATION"]
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsafe metric ranges", () => {
    const result = healthMetricSchema.safeParse({
      steps: -10
    });

    expect(result.success).toBe(false);
  });

  it("requires supported diet plans", () => {
    expect(
      mealPlanRequestSchema.safeParse({
        diet: "Mediterranean",
        restrictions: ["shellfish"]
      }).success
    ).toBe(true);

    expect(
      mealPlanRequestSchema.safeParse({
        diet: "Candy-only"
      }).success
    ).toBe(false);
  });
});
