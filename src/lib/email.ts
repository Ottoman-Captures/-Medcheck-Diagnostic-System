import { env } from "@/lib/env";

type EmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendTransactionalEmail(input: EmailInput) {
  if (!env.resendApiKey) {
    console.info("[email:dev]", {
      to: input.to,
      subject: input.subject,
      preview: input.text ?? input.html.replace(/<[^>]*>/g, " ").slice(0, 180)
    });
    return { id: "dev-email" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text
    })
  });

  if (!response.ok) {
    throw new Error(`Email provider failed with ${response.status}`);
  }

  return response.json() as Promise<{ id: string }>;
}
