import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { GoalRings } from "@/components/analytics/goal-rings";
import { WeeklyChart } from "@/components/analytics/weekly-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecommendationList } from "@/components/dashboard/recommendation-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { healthOverview, productHighlights } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-aura-grid bg-[size:42px_42px]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="aura-focus flex items-center gap-3 rounded-lg">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-slate-950">
              <span className="font-display text-xl font-black">A</span>
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-wide text-white">Medcheck Diagnostic System</p>
              <p className="text-xs text-muted">AI-native wellness</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start</Link>
            </Button>
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-88px)] items-center gap-8 py-10 lg:grid-cols-[0.82fr_1.18fr]">
          <FadeIn>
            <Badge tone="emerald">Student Edition · Zero-cost stack</Badge>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-tight text-white sm:text-6xl">
              Medcheck Diagnostic System
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              A premium AI diagnostic and wellness companion for tracking nutrition, hydration, sleep, activity, reminders, and personal goals.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/onboarding">Personalize plan</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {productHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-slate-300">
                    <Icon className="h-4 w-4 text-emerald-300" aria-hidden />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn className="grid gap-4" delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {healthOverview.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  target={metric.target}
                  progress={metric.progress}
                  tone={metric.tone}
                />
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
              <section className="glass-surface rounded-2xl p-5">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4 text-emerald-300" aria-hidden />
                  <h2 className="font-display text-lg font-semibold">Weekly trends</h2>
                </div>
                <WeeklyChart />
              </section>
              <section className="glass-surface rounded-2xl p-5">
                <div className="mb-5 flex items-center gap-2 text-white">
                  <ShieldCheck className="h-4 w-4 text-amber-300" aria-hidden />
                  <h2 className="font-display text-lg font-semibold">Goals</h2>
                </div>
                <GoalRings />
              </section>
            </div>
            <RecommendationList />
          </FadeIn>
        </section>
      </div>
    </main>
  );
}
