import { z } from "zod";

export const activityLevels = ["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "ATHLETE"] as const;
export const healthGoalTypes = [
  "WEIGHT_LOSS",
  "MUSCLE_GAIN",
  "BETTER_SLEEP",
  "HYDRATION",
  "STRESS_REDUCTION",
  "MAINTENANCE",
  "ENDURANCE"
] as const;

export const supportedDiets = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "High Protein",
  "Low Carb",
  "Mediterranean"
] as const;

export const profileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  age: z.number().int().min(13).max(120).optional(),
  gender: z.enum(["FEMALE", "MALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"]).optional(),
  heightCm: z.number().min(90).max(260).optional(),
  weightKg: z.number().min(25).max(350).optional(),
  activityLevel: z.enum(activityLevels).default("MODERATE"),
  dietaryPreferences: z.array(z.string().min(2).max(60)).max(12).default([]),
  allergies: z.array(z.string().min(2).max(60)).max(20).default([]),
  healthGoals: z.array(z.enum(healthGoalTypes)).min(1).max(5)
});

export const healthMetricSchema = z.object({
  measuredAt: z.coerce.date().optional(),
  steps: z.number().int().min(0).max(100000).default(0),
  waterMl: z.number().int().min(0).max(15000).default(0),
  sleepMinutes: z.number().int().min(0).max(1440).default(0),
  calories: z.number().int().min(0).max(15000).default(0),
  distanceKm: z.number().min(0).max(300).default(0),
  activeMinutes: z.number().int().min(0).max(1440).default(0),
  moodScore: z.number().int().min(1).max(10).optional(),
  source: z.enum(["MANUAL", "MOBILE_TRACKER", "IMPORT"]).default("MANUAL")
});

export const mealPlanRequestSchema = z.object({
  type: z.enum(["DAILY", "WEEKLY"]).default("DAILY"),
  diet: z.enum(supportedDiets),
  targetCalories: z.number().int().min(1000).max(6000).optional(),
  restrictions: z.array(z.string().min(2).max(80)).max(30).default([]),
  startsOn: z.coerce.date().default(() => new Date())
});

export const reminderSchema = z.object({
  type: z.enum(["WATER", "MEDICATION", "EXERCISE", "MEAL", "SLEEP"]),
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  cadence: z.enum(["ONCE", "DAILY", "WEEKLY", "CUSTOM"]).default("DAILY"),
  scheduledFor: z.coerce.date(),
  timezone: z.string().min(2).max(80).default("UTC"),
  isActive: z.boolean().default(true)
});

export const coachMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(2).max(1200),
  attachment: z
    .object({
      filename: z.string(),
      fileType: z.string(),
      fileData: z.string()
    })
    .optional(),
  context: z
    .object({
      goals: z.array(z.string()).max(8).optional(),
      restrictions: z.array(z.string()).max(30).optional(),
      latestMetrics: z.record(z.unknown()).optional()
    })
    .optional()
});

export const activitySchema = z.object({
  steps: z.number().int().min(0).max(100000),
  distanceKm: z.number().min(0).max(300).default(0),
  activeMinutes: z.number().int().min(0).max(1440).default(0),
  measuredAt: z.coerce.date().optional()
});
