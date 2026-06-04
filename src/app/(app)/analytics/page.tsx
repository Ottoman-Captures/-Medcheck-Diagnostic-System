import { BarChart3, CalendarDays, TrendingUp } from "lucide-react";

import { GoalRings } from "@/components/analytics/goal-rings";
import { WeeklyChart } from "@/components/analytics/weekly-chart";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function AnalyticsPage() {
  return (
    <div className="grid gap-5">
      <section>
        <Badge tone="cyan">Reports</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">Wellness analytics</h1>
        <p className="mt-2 text-muted">Weekly and monthly patterns across movement, hydration, sleep, and nutrition.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <GlassPanel>
          <div className="mb-3 flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-cyan-300" aria-hidden />
            <h2 className="font-display text-xl font-semibold">Weekly performance</h2>
          </div>
          <WeeklyChart />
        </GlassPanel>
        <GlassPanel>
          <div className="mb-6 flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-emerald-300" aria-hidden />
            <h2 className="font-display text-xl font-semibold">Goal completion</h2>
          </div>
          <GoalRings />
        </GlassPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Weekly report", "80% completion", "Your strongest streak was movement."],
          ["Monthly trend", "+12% recovery", "Sleep consistency improved over 30 days."],
          ["Retention signal", "5-day streak", "Hydration and reminders drive return visits."]
        ].map(([title, value, body]) => (
          <GlassPanel key={title}>
            <CalendarDays className="h-5 w-5 text-amber-300" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 font-mono text-sm text-emerald-200">{value}</p>
            <p className="mt-4 text-sm leading-6 text-muted">{body}</p>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
