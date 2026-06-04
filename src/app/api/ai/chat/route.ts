import { created, handleApiError, parseJson } from "@/lib/api";
import { generateCoachReply } from "@/lib/ai/gemini";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/security/csrf";
import { enforceRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { requireUser } from "@/lib/session";
import { coachMessageSchema } from "@/lib/validations/wellness";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    enforceRateLimit({
      key: `ai:${user.id}:${getClientIp(request)}`,
      limit: 12,
      windowMs: 60_000
    });

    const payload = await parseJson(request, coachMessageSchema);
    const aiResponse = await generateCoachReply({
      message: payload.message,
      goals: payload.context?.goals,
      restrictions: payload.context?.restrictions,
      latestMetrics: payload.context?.latestMetrics,
      attachment: payload.attachment
    });

    const conversation = payload.conversationId
      ? await prisma.aiConversation.findFirst({
          where: { id: payload.conversationId, userId: user.id }
        })
      : await prisma.aiConversation.create({
          data: {
            userId: user.id,
            title: payload.message.slice(0, 80)
          }
        });

    if (conversation) {
      await prisma.aiMessage.createMany({
        data: [
          {
            conversationId: conversation.id,
            role: "USER",
            content: payload.message
          },
          {
            conversationId: conversation.id,
            role: "ASSISTANT",
            content: aiResponse.content,
            safetyFlags: aiResponse.safetyFlags
          }
        ]
      });
    }

    await prisma.$transaction([
      prisma.aiUsage.create({
        data: {
          userId: user.id,
          feature: "coach",
          model: aiResponse.model,
          latencyMs: aiResponse.latencyMs
        }
      }),
      prisma.activityLog.create({
        data: {
          userId: user.id,
          type: "AI_MESSAGE_SENT",
          metadata: { model: aiResponse.model, safetyFlags: aiResponse.safetyFlags }
        }
      })
    ]);

    return created({
      conversationId: conversation?.id,
      content: aiResponse.content,
      safetyFlags: aiResponse.safetyFlags,
      model: aiResponse.model
    });
  } catch (error) {
    return handleApiError(error);
  }
}
