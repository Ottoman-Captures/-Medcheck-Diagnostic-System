import { created, handleApiError, ok, parseJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/security/csrf";
import { requireUser } from "@/lib/session";
import { reminderSchema } from "@/lib/validations/wellness";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const reminders = await prisma.reminder.findMany({
      where: { userId: user.id },
      orderBy: [{ isActive: "desc" }, { scheduledFor: "asc" }]
    });

    return ok(reminders);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const payload = await parseJson(request, reminderSchema);

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        ...payload
      }
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        channel: "BROWSER",
        title: reminder.title,
        body: reminder.description ?? "Medcheck Diagnostic System reminder is scheduled.",
        metadata: { reminderId: reminder.id }
      }
    });

    return created(reminder);
  } catch (error) {
    return handleApiError(error);
  }
}
