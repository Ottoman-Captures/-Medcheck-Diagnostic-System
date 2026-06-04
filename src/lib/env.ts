export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  betterAuthUrl: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  betterAuthSecret:
    process.env.BETTER_AUTH_SECRET ?? "development-only-change-before-production-32-chars",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "Medcheck Diagnostic System <hello@medcheck.system>"
};

export function requireEnv(name: keyof NodeJS.ProcessEnv) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
