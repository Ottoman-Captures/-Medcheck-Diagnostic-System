import { GoogleGenerativeAI } from "@google/generative-ai";

import { buildCoachSystemPrompt, buildCoachUserPrompt } from "@/lib/ai/prompts";
import { isMedicalRisk, medicalSafetyResponse, AI_HEALTH_DISCLAIMER } from "@/lib/ai/safety";
import { env } from "@/lib/env";

type CoachInput = {
  message: string;
  goals?: string[];
  restrictions?: string[];
  latestMetrics?: Record<string, unknown>;
  attachment?: {
    filename: string;
    fileType: string;
    fileData: string;
  };
};

const modelName = "gemini-1.5-flash";

export async function generateCoachReply(input: CoachInput) {
  if (isMedicalRisk(input.message)) {
    return {
      content: medicalSafetyResponse(),
      model: "safety-rule",
      safetyFlags: ["medical-risk"]
    };
  }

  if (!env.geminiApiKey) {
    return {
      content: [
        AI_HEALTH_DISCLAIMER,
        "Here is a starter plan while the Gemini API key is not configured:",
        "- Drink a glass of water now and log it.",
        "- Take a 7-minute walk or stretch break.",
        "- Choose a protein-forward meal with a vegetable and a slow carb.",
        "- Set one small sleep cue for tonight, such as dimming screens 30 minutes before bed."
      ].join("\n\n"),
      model: "local-fallback",
      safetyFlags: ["missing-gemini-key"]
    };
  }

  const startedAt = Date.now();
  let content = "";
  let modelUsed = modelName;

  // Extract text from document attachments if present
  let promptMessage = input.message;
  let hasImageAttachment = false;
  let imageBase64Data = "";
  let imageMimeType = "";

  if (input.attachment) {
    const isImage = input.attachment.fileType.startsWith("image/");
    if (isImage) {
      hasImageAttachment = true;
      const parts = input.attachment.fileData.split(";base64,");
      imageBase64Data = parts.length > 1 ? parts[1] : parts[0];
      imageMimeType = input.attachment.fileType;
    } else {
      // Parse document attachment to text
      try {
        const { parseAttachmentToText } = await import("@/lib/ai/parser");
        const parsed = await parseAttachmentToText(
          input.attachment.filename,
          input.attachment.fileType,
          input.attachment.fileData
        );
        if (parsed.textContent) {
          promptMessage = `${promptMessage}\n\n--- UPLOADED FILE CONTENT (${parsed.filename}) ---\n${parsed.textContent}\n--- END OF FILE CONTENT ---`;
        }
      } catch (err) {
        console.error("Failed to parse attachment, continuing with original message:", err);
      }
    }
  }

  // Build the user prompt object/string using the updated promptMessage
  const inputForPrompt = {
    ...input,
    message: promptMessage
  };
  const userPromptText = buildCoachUserPrompt(inputForPrompt);

  if (env.geminiApiKey.startsWith("sk-or-v1-")) {
    modelUsed = "google/gemini-2.5-flash";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userContent: any = userPromptText;

    if (hasImageAttachment) {
      userContent = [
        {
          type: "text",
          text: userPromptText
        },
        {
          type: "image_url",
          image_url: {
            url: input.attachment!.fileData
          }
        }
      ];
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.geminiApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Medcheck Diagnostic System"
      },
      body: JSON.stringify({
        model: modelUsed,
        messages: [
          {
            role: "system",
            content: buildCoachSystemPrompt()
          },
          {
            role: "user",
            content: userContent
          }
        ],
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${errorText}`);
    }

    const data = await response.json();
    content = data.choices?.[0]?.message?.content || "";
  } else {
    const genAI = new GoogleGenerativeAI(env.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: buildCoachSystemPrompt()
    });

    let result;
    if (hasImageAttachment) {
      result = await model.generateContent([
        userPromptText,
        {
          inlineData: {
            data: imageBase64Data,
            mimeType: imageMimeType
          }
        }
      ]);
    } else {
      result = await model.generateContent(userPromptText);
    }
    content = result.response.text();
  }

  return {
    content: content.includes(AI_HEALTH_DISCLAIMER)
      ? content
      : `${AI_HEALTH_DISCLAIMER}\n\n${content}`,
    model: modelUsed,
    safetyFlags: [],
    latencyMs: Date.now() - startedAt
  };
}

