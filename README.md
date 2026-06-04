# 🏥 Medcheck Diagnostic System

Medcheck Diagnostic System is a production-grade, AI-native diagnostic and wellness companion designed to deliver intelligent wellness tracking, nutrition advice, health analysis, and real-time support. Built with a modern, high-performance tech stack, it provides a premium dark-mode SaaS interface tailored for wellness coaching and interactive analytics.

---

## 🚀 Key Features

*   **Intelligent Onboarding**: Tailored health profile generation based on user input, goals, and conditions.
*   **Gemini AI Coach**: Real-time AI consultation featuring strict medical-safety boundaries, structured parsing, and conversational memory.
*   **Analytics Dashboard**: Premium interactive data visualization for steps, hydration, sleep, active calories, and weekly wellness trends.
*   **Meal & Goal Planner**: Real-time dietary suggestion engine, avoidance lists tracking, and goal-ring indicators.
*   **Secure Authentication**: Fully integrated password/session management powered by Better Auth, including custom JWT token distribution and JWKS endpoint verification.
*   **Real-time Reminders & Logs**: Push notifications, active reminders board, activity logging, and live synchronization.
*   **Cross-Device Synchronization**: Integrated mobile tracker UI leveraging PeerJS for wireless diagnostics.

---

## 🛠️ Architecture & Technology Stack

The application is built with a zero-cost-first philosophy—utilizing free tiers of industry-standard tools while falling back gracefully when keys are omitted locally.

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions) & [React 19](https://react.dev/)
*   **Database**: [Prisma ORM](https://www.prisma.io/) with SQLite for development and Postgres compatibility for production
*   **Security & Auth**: [Better Auth](https://www.better-auth.com/) with JWKS key rotation
*   **Artificial Intelligence**: [Gemini Pro API](https://ai.google.dev/) via the Google Gen AI SDK
*   **UI & Styling**: Vanilla CSS, [TailwindCSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) components, and [Lucide Icons](https://lucide.dev/)
*   **Analytics**: [Recharts](https://recharts.org/) and [PostHog](https://posthog.com/) integration
*   **Monitoring**: [Sentry](https://sentry.io/) error tracking
*   **Testing**: [Vitest](https://vitest.dev/) for unit tests and [Playwright](https://playwright.dev/) for E2E validation

---

## 📁 Repository Structure

```text
├── .github/workflows/   # CI/CD pipelines
├── prisma/              # Prisma schema definition
├── scripts/             # Database initialization and key rotation scripts
├── src/
│   ├── app/             # Page layouts, actions, and API route handlers
│   ├── components/      # UI, dashboard, onboarding, and coach modules
│   └── lib/             # API services, AI configuration, security, and utils
└── tests/               # E2E test suites
```

---

## ⚙️ Local Setup

1.  **Clone and install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    Create a `.env` file by copying the example file:
    ```bash
    cp .env.example .env
    ```

3.  **Database Initialization**:
    Run the migrations/push command to set up your local database:
    ```bash
    npx prisma db push
    ```

4.  **Run Development Server**:
    Start the Next.js development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

---

## 🔒 Security & Safety Disclaimers

Medcheck is built with robust safety systems for AI wellness applications:

*   **Security Defaults**: Production builds generate clean JWKS keys dynamically on build time to ensure secure token verification. Environment secrets are strictly kept out of version control.
*   **Clinical Safety Boundaries**: The AI Coach operates under a system prompt designed to prevent medical diagnoses, prescriptions, medication adjustments, and emergency triage.
*   **Persistent Medical Disclaimer**: The application persistently displays and includes this notice on all AI interfaces:
    > "AI-generated information is for educational purposes only and is not medical advice. Always consult a qualified physician for clinical concerns."
