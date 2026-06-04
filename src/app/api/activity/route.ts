import { created, handleApiError, ok, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/security/csrf";
import { requireUser } from "@/lib/session";
import { activitySchema } from "@/lib/validations/wellness";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const activity = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 25
    });

    return ok(activity);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const payload = await parseJson(request, activitySchema);

    const result = await prisma.$transaction(async (tx) => {
      const metric = await tx.healthMetric.create({
        data: {
          userId: user.id,
          measuredAt: payload.measuredAt,
          steps: payload.steps,
          distanceKm: payload.distanceKm,
          activeMinutes: payload.activeMinutes,
          source: "MOBILE_TRACKER"
        }
      });

      const log = await tx.activityLog.create({
        data: {
          userId: user.id,
          type: "STEPS_SYNCED",
          metadata: {
            steps: payload.steps,
            distanceKm: payload.distanceKm,
            activeMinutes: payload.activeMinutes
          }
        }
      });

      return { metric, log };
    });

    return created(result);
  } catch (error) {
    return handleApiError(error);
  }
}
