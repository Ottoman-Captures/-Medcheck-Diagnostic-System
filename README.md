# Aura Health

Aura Health is a production-minded, student-friendly AI wellness platform built with Next.js 15, React 19, Prisma, Neon PostgreSQL, Better Auth, Gemini, Recharts, PostHog, Sentry, Cloudinary, and PeerJS.

The implementation is intentionally zero-cost first: all external services have free tiers, and missing optional keys fall back gracefully during local development.

## What Is Included

- Dark-mode premium SaaS interface for dashboard, onboarding, AI coach, meal planning, reminders, analytics, and admin.
- Better Auth route integration with Prisma-backed users, sessions, accounts, verification, and JWT/JWKS support through `/api/auth/token` and `/api/auth/jwks`.
- Production-oriented Prisma schema using UUID primary keys for users, profiles, health metrics, goals, meals, AI conversations, reminders, notifications, activity logs, and avoidance lists.
- Gemini AI coach service with medical-safety boundaries, structured validation, and development fallback.
- API route handlers for `/api/auth/*`, `/api/users/me`, `/api/health`, `/api/meals`, `/api/reminders`, `/api/ai/chat`, `/api/analytics`, `/api/admin`, `/api/notifications`, and `/api/activity`.
- Browser notification and PeerJS-ready mobile tracker UI.
- Vitest unit tests, Playwright smoke test, and GitHub Actions CI.

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Open `http://localhost:3000`.

## Free Deployment Stack

- App: Vercel Hobby
- Database: Neon Free Postgres
- AI: Gemini API free tier
- Images: Cloudinary free tier
- Analytics: PostHog free tier
- Monitoring: Sentry developer/free tier
- Realtime mobile sync: PeerJS public broker for prototype, self-host later if needed

## Environment Variables

Use `.env.example` as the source of truth. Required for a real deployment:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `GEMINI_API_KEY`

Optional but recommended:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `CLOUDINARY_*`
- `SMTP_*`

## Safety Disclaimer

Aura Health always displays and injects the disclaimer:

> AI-generated information is for educational purposes only and is not medical advice.

The AI coach is designed to avoid diagnosis, prescriptions, medication changes, and emergency triage. Users are directed to qualified clinicians for medical concerns.
