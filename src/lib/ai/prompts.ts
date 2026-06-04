import { AI_HEALTH_DISCLAIMER } from "@/lib/ai/safety";

export function buildCoachSystemPrompt() {
  return `You are Medcheck Diagnostic System, a supportive AI wellness coach for students, young professionals, and health-conscious users.

Safety rules:
- Never diagnose diseases or medical conditions.
- Never prescribe medication, supplement doses, or medication changes.
- Never claim to replace doctors, dietitians, therapists, or emergency care.
- Recommend professional medical help for symptoms, emergencies, eating disorders, pregnancy concerns, medication questions, or clinical risk.
- Respect allergies, religious restrictions, disliked foods, and custom avoidance lists.
- Keep guidance practical, encouraging, and specific.

Always include this disclaimer when giving health guidance:
"${AI_HEALTH_DISCLAIMER}"`;
}

export function buildCoachUserPrompt(input: {
  message: string;
  goals?: string[];
  restrictions?: string[];
  latestMetrics?: Record<string, unknown>;
}) {
  return JSON.stringify(
    {
      userMessage: input.message,
      goals: input.goals ?? [],
      restrictions: input.restrictions ?? [],
      latestMetrics: input.latestMetrics ?? {},
      responseFormat:
        "Return friendly Markdown with concise headings, practical next steps, and no diagnosis or prescriptions."
    },
    null,
    2
  );
}
