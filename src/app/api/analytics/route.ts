import { handleApiError, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [metrics, goals, aiUsage] = await Promise.all([
      prisma.healthMetric.findMany({
        where: { userId: user.id, measuredAt: { gte: since } },
        orderBy: { measuredAt: "asc" }
      }),
      prisma.goal.findMany({
        where: { userId: user.id, status: "ACTIVE" }
      }),
      prisma.aiUsage.count({
        where: { userId: user.id, createdAt: { gte: since } }
      })
    ]);

    const totals = metrics.reduce(
      (sum, metric) => ({
        steps: sum.steps + metric.steps,
        waterMl: sum.waterMl + metric.waterMl,
        activeMinutes: sum.activeMinutes + metric.activeMinutes,
        calories: sum.calories + metric.calories
      }),
      { steps: 0, waterMl: 0, activeMinutes: 0, calories: 0 }
    );

    return ok({
      range: "30d",
      totals,
      goalCompletionRate: goals.length
        ? Math.round(
            goals.reduce((sum, goal) => sum + Number(goal.currentValue) / Number(goal.targetValue), 0) /
              goals.length *
              100
          )
        : 0,
      aiUsage,
      metrics
    });
  } catch (error) {
    return handleApiError(error);
  }
}
