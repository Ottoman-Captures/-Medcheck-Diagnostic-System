"use client";

import { motion } from "framer-motion";
import { goalProgress } from "@/lib/demo-data";

const ringColors = {
  Hydration: {
    gradient: "url(#grad-hydration)",
    trail: "rgba(34, 211, 238, 0.08)",
    glow: "rgba(34, 211, 238, 0.3)",
    text: "text-cyan-400"
  },
  Movement: {
    gradient: "url(#grad-movement)",
    trail: "rgba(52, 211, 153, 0.08)",
    glow: "rgba(52, 211, 153, 0.3)",
    text: "text-emerald-400"
  },
  Sleep: {
    gradient: "url(#grad-sleep)",
    trail: "rgba(129, 140, 248, 0.08)",
    glow: "rgba(129, 140, 248, 0.3)",
    text: "text-indigo-400"
  },
  Nutrition: {
    gradient: "url(#grad-nutrition)",
    trail: "rgba(251, 191, 36, 0.08)",
    glow: "rgba(251, 191, 36, 0.3)",
    text: "text-amber-400"
  }
};

export function GoalRings() {
  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 py-2">
      {/* SVG Gradients Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient id="grad-hydration" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="grad-movement" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="grad-sleep" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="grad-nutrition" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>

      {goalProgress.map((goal) => {
        const colorSet = ringColors[goal.label as keyof typeof ringColors] || ringColors.Movement;
        const normalizedValue = Math.max(0, Math.min(100, goal.value));
        const offset = circumference - (normalizedValue / 100) * circumference;

        return (
          <motion.div
            key={goal.label}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
          >
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                {/* Background Ring Track */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-current"
                  style={{ color: colorSet.trail }}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Glowing Highlight Shadow (underlay) */}
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke={colorSet.gradient}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    filter: `drop-shadow(0 0 4px ${colorSet.glow})`
                  }}
                />
              </svg>
              {/* Central Text percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-sm font-bold text-white leading-none">
                  {goal.value}%
                </span>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold tracking-wider text-muted uppercase">
              {goal.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

