import { NextResponse } from "next/server";

import { handleApiError, ok, parseJson } from "@/lib/api";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/security/csrf";
import { requireUser } from "@/lib/session";
import { profileSchema } from "@/lib/validations/wellness";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id }
    });

    return ok({ user, profile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const payload = await parseJson(request, profileSchema);

    // Generate dynamic AI wellness plan summary
    let planSummaryText = "";
    try {
      if (env.geminiApiKey) {
        const prompt = `Generate a personalized daily wellness plan summary for a user with the following profile:
- Name: ${payload.name || user.name || "User"}
- Age: ${payload.age}
- Gender: ${payload.gender}
- Height: ${payload.heightCm} cm
- Weight: ${payload.weightKg} kg
- Activity Level: ${payload.activityLevel}
- Dietary Preferences: ${payload.dietaryPreferences?.join(", ") || "None"}
- Allergies: ${payload.allergies?.join(", ") || "None"}
- Health Goals: ${payload.healthGoals?.join(", ") || "None"}

Please output a cohesive, friendly 3-4 sentence paragraph summarizing their daily target for hydration (in Liters), movement/steps, sleep hygiene, and specific nutritional guidance matching their goals and dietary preferences. Avoid any medical diagnostics, prescriptions, or clinical statements. Do not include markdown formatting or headings, just a clean plain paragraph.`;

        if (env.geminiApiKey.startsWith("sk-or-v1-")) {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.geminiApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "Medcheck Diagnostic System"
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 250
            })
          });
          if (response.ok) {
            const data = await response.json();
            planSummaryText = data.choices?.[0]?.message?.content?.trim() || "";
          } else {
            console.error("OpenRouter request failed:", await response.text());
          }
        } else {
          const { GoogleGenerativeAI } = await import("@google/generative-ai");
          const genAI = new GoogleGenerativeAI(env.geminiApiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const result = await model.generateContent(prompt);
          planSummaryText = result.response.text().trim();
        }
      }
    } catch (err) {
      console.error("Failed to generate AI plan summary:", err);
    }

    if (!planSummaryText) {
      const hydration = (Number(payload.weightKg) * 0.035 || 2.5).toFixed(1);
      const steps = payload.activityLevel === "SEDENTARY" ? "6,000" : "10,000";
      planSummaryText = `Based on your profile, we recommend a daily hydration target of ${hydration}L/day and a movement target of ${steps} steps. Focus on dietary preferences: ${payload.dietaryPreferences?.join(", ") || "Mediterranean"} and health goals: ${payload.healthGoals?.join(", ") || "General health"}.`;
    }

    const planSummaryJson = {
      plan: planSummaryText,
      generatedAt: new Date().toISOString()
    };

    const [updatedUser, profile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: payload.name ? { name: payload.name } : {}
      }),
      prisma.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          age: payload.age,
          gender: payload.gender,
          heightCm: payload.heightCm,
          weightKg: payload.weightKg,
          activityLevel: payload.activityLevel,
          dietaryPreferences: payload.dietaryPreferences,
          allergies: payload.allergies,
          healthGoals: payload.healthGoals,
          onboardingCompleted: true,
          planSummary: planSummaryJson
        },
        update: {
          age: payload.age,
          gender: payload.gender,
          heightCm: payload.heightCm,
          weightKg: payload.weightKg,
          activityLevel: payload.activityLevel,
          dietaryPreferences: payload.dietaryPreferences,
          allergies: payload.allergies,
          healthGoals: payload.healthGoals,
          onboardingCompleted: true,
          planSummary: planSummaryJson
        }
      }),
      prisma.activityLog.create({
        data: {
          userId: user.id,
          type: "ONBOARDING_COMPLETED",
          metadata: { goals: payload.healthGoals }
        }
      })
    ]);

    return NextResponse.json({ data: { user: updatedUser, profile } });
  } catch (error) {
    return handleApiError(error);
  }
}
