"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { profileSchema, reminderSchema } from "@/lib/validations/wellness";

export async function saveOnboardingProfileAction(input: unknown) {
  const user = await requireUser();
  const payload = profileSchema.parse(input);

  const profile = await prisma.userProfile.upsert({
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
      planSummary: { generatedAt: new Date().toISOString(), focus: payload.healthGoals }
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
      planSummary: { generatedAt: new Date().toISOString(), focus: payload.healthGoals }
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");

  return { profile };
}

export async function createReminderAction(input: unknown) {
  const user = await requireUser();
  const payload = reminderSchema.parse(input);

  const reminder = await prisma.reminder.create({
    data: {
      userId: user.id,
      ...payload
    }
  });

  revalidatePath("/reminders");

  return { reminder };
}
