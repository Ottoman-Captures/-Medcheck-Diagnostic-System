import { Activity, Sparkles } from "lucide-react";

import { GoalRings } from "@/components/analytics/goal-rings";
import { WeeklyChart } from "@/components/analytics/weekly-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MobileTracker } from "@/components/dashboard/mobile-tracker";
import { RecommendationList } from "@/components/dashboard/recommendation-list";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { healthOverview } from "@/lib/demo-data";

export default function DashboardPage() {
  return (
    <div className="grid gap-5">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="emerald">Today</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Health overview</h1>
          <p className="mt-2 text-muted">Your daily wellness cockpit with AI-guided next moves.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-200">
          <Activity className="h-4 w-4 text-emerald-300" aria-hidden />
          Goal completion rate: 80%
        </div>
      </section>

      <FadeIn className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      </FadeIn>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="glass-surface rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-2 text-white">
            <Sparkles className="h-4 w-4 text-emerald-300" aria-hidden />
            <h2 className="font-display text-lg font-semibold">Weekly trends</h2>
          </div>
          <WeeklyChart />
        </div>
        <div className="glass-surface rounded-2xl p-5">
          <h2 className="mb-5 font-display text-lg font-semibold text-white">Goal progress</h2>
          <GoalRings />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold text-white">AI recommendations</h2>
          <RecommendationList />
        </div>
        <MobileTracker />
      </section>
    </div>
  );
}
