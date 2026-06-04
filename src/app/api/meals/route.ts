import { addDays } from "@/lib/date";
import { created, handleApiError, ok, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/security/csrf";
import { requireUser } from "@/lib/session";
import { mealPlanRequestSchema } from "@/lib/validations/wellness";

export const runtime = "nodejs";

const defaultMeals = [
  {
    type: "BREAKFAST",
    title: "Protein oats with berries",
    calories: 430,
    proteinG: 32,
    carbsG: 54,
    fatG: 11,
    notes: "Oats, Greek yogurt or soy yogurt, berries, chia."
  },
  {
    type: "LUNCH",
    title: "Balanced grain bowl",
    calories: 640,
    proteinG: 38,
    carbsG: 70,
    fatG: 22,
    notes: "Whole grain base, legumes or lean protein, vegetables, lemon dressing."
  },
  {
    type: "DINNER",
    title: "Vegetable stir fry with protein",
    calories: 690,
    proteinG: 44,
    carbsG: 68,
    fatG: 24,
    notes: "Tofu, chicken, or beans with vegetables and rice."
  },
  {
    type: "SNACK",
    title: "Fruit and nut snack",
    calories: 220,
    proteinG: 8,
    carbsG: 26,
    fatG: 10,
    notes: "Portable option for study or work blocks."
  }
] as const;

export async function GET() {
  try {
    const user = await requireUser();
    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: user.id },
      include: { meals: true },
      orderBy: { startsOn: "desc" },
      take: 10
    });

    return ok(mealPlans);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const payload = await parseJson(request, mealPlanRequestSchema);
    const restrictions = payload.restrictions.map((item) => item.toLowerCase());

    const meals = defaultMeals.map((meal) => ({
      ...meal,
      notes: `${meal.notes} Avoids: ${restrictions.length ? payload.restrictions.join(", ") : "none listed"}.`
    }));

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        type: payload.type,
        diet: payload.diet,
        title: `${payload.diet} ${payload.type.toLowerCase()} plan`,
        targetCalories: payload.targetCalories,
        restrictions: payload.restrictions,
        startsOn: payload.startsOn,
        endsOn: payload.type === "WEEKLY" ? addDays(payload.startsOn, 6) : payload.startsOn,
        nutritionalBreakdown: {
          calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
          proteinG: meals.reduce((sum, meal) => sum + meal.proteinG, 0),
          carbsG: meals.reduce((sum, meal) => sum + meal.carbsG, 0),
          fatG: meals.reduce((sum, meal) => sum + meal.fatG, 0)
        },
        meals: {
          create: meals
        }
      },
      include: { meals: true }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "MEAL_GENERATED",
        metadata: {
          diet: payload.diet,
          restrictions: payload.restrictions
        }
      }
    });

    return created(mealPlan);
  } catch (error) {
    return handleApiError(error);
  }
}
