"use client";

import { motion } from "framer-motion";
import { Footprints, Droplets, BedDouble, Flame } from "lucide-react";

import { cn } from "@/lib/utils";

const toneClasses = {
  emerald: "bg-emerald-400/12 text-emerald-200 ring-emerald-400/20",
  cyan: "bg-cyan-400/12 text-cyan-200 ring-cyan-400/20",
  indigo: "bg-indigo-400/12 text-indigo-200 ring-indigo-400/20",
  amber: "bg-amber-400/12 text-amber-200 ring-amber-400/20"
};

const iconMap = {
  emerald: Footprints,
  cyan: Droplets,
  indigo: BedDouble,
  amber: Flame
};

const barClasses = {
  emerald: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]",
  cyan: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]",
  indigo: "bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.4)]",
  amber: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
};

const shadowColors = {
  emerald: "rgba(52,211,153,0.15)",
  cyan: "rgba(34,211,238,0.15)",
  indigo: "rgba(129,140,248,0.15)",
  amber: "rgba(251,191,36,0.15)"
};

export function MetricCard({
  label,
  value,
  target,
  progress,
  tone
}: {
  label: string;
  value: string;
  target: string;
  progress: number;
  tone: keyof typeof toneClasses;
}) {
  const Icon = iconMap[tone] || Footprints;
  const normalized = Math.max(0, Math.min(100, progress));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        boxShadow: `0 20px 40px -15px ${shadowColors[tone]}`,
        borderColor: "rgba(255, 255, 255, 0.2)"
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-surface cursor-pointer rounded-2xl p-5 border border-white/10 transition-colors duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-white tracking-tight">{value}</p>
        </div>
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={cn("grid h-10 w-10 place-items-center rounded-lg ring-1", toneClasses[tone])}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </motion.div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span className="font-medium text-white/70">{progress}% complete</span>
          <span>Target {target}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.08] relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${normalized}%` }}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.1 }}
            className={cn("h-full rounded-full", barClasses[tone])}
          />
        </div>
      </div>
    </motion.div>
  );
}

