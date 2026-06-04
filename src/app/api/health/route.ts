import { created, handleApiError, ok, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/security/csrf";
import { requireUser } from "@/lib/session";
import { healthMetricSchema } from "@/lib/validations/wellness";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const metrics = await prisma.healthMetric.findMany({
      where: { userId: user.id },
      orderBy: { measuredAt: "desc" },
      take: 30
    });

    return ok(metrics);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const payload = await parseJson(request, healthMetricSchema);

    const metric = await prisma.healthMetric.create({
      data: {
        userId: user.id,
        measuredAt: payload.measuredAt,
        steps: payload.steps,
        waterMl: payload.waterMl,
        sleepMinutes: payload.sleepMinutes,
        calories: payload.calories,
        distanceKm: payload.distanceKm,
        activeMinutes: payload.activeMinutes,
        moodScore: payload.moodScore,
        source: payload.source
      }
    });

    return created(metric);
  } catch (error) {
    return handleApiError(error);
  }
}
