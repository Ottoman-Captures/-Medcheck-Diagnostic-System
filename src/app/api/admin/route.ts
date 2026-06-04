import { handleApiError, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const [userCount, activeUsers, aiUsage, errors] = await Promise.all([
      prisma.user.count(),
      prisma.activityLog.groupBy({
        by: ["userId"],
        where: { createdAt: { gte: since } }
      }),
      prisma.aiUsage.count({ where: { createdAt: { gte: since } } }),
      prisma.systemHealthCheck.findMany({
        orderBy: { createdAt: "desc" },
        take: 10
      })
    ]);

    return ok({
      userCount,
      activeUsers: activeUsers.length,
      aiUsage,
      systemHealth: errors
    });
  } catch (error) {
    return handleApiError(error);
  }
}
