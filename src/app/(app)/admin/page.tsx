import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/ui/glass-panel";
import { adminStats } from "@/lib/demo-data";

export default function AdminPage() {
  return (
    <div className="grid gap-5">
      <section>
        <Badge tone="amber">Admin</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">System command center</h1>
        <p className="mt-2 text-muted">Usage, reliability, AI traffic, and platform health.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassPanel key={stat.label}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.06] text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
            </GlassPanel>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <GlassPanel>
          <div className="mb-5 flex items-center gap-2 text-white">
            <Activity className="h-5 w-5 text-emerald-300" aria-hidden />
            <h2 className="font-display text-xl font-semibold">AI usage statistics</h2>
          </div>
          <div className="grid gap-3">
            {["Coach messages", "Meal generations", "Safety redirects", "Fallback responses"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] p-4">
                <span className="text-sm text-slate-300">{item}</span>
                <span className="font-mono text-sm text-white">{[3824, 1906, 72, 18][index]}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel>
          <div className="mb-5 flex items-center gap-2 text-white">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden />
            <h2 className="font-display text-xl font-semibold">System health</h2>
          </div>
          <div className="grid gap-3 text-sm">
            <p className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
              API latency p95: 184ms
            </p>
            <p className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
              Dashboard load: 1.4s
            </p>
            <p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-100">
              AI latency p95: 3.8s
            </p>
            <p className="flex gap-2 rounded-xl border border-white/10 bg-white/[0.045] p-3 text-muted">
              <AlertTriangle className="h-4 w-4 flex-none text-amber-300" aria-hidden />
              Sentry and PostHog activate after environment keys are set.
            </p>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
