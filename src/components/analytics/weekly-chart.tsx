"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { weeklyTrends } from "@/lib/demo-data";

export function WeeklyChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 w-full flex flex-col justify-between animate-pulse py-2">
        <div className="flex-1 bg-white/[0.03] rounded-lg mb-4" />
        <div className="flex justify-between px-4">
          <div className="h-3 w-8 bg-white/[0.08] rounded" />
          <div className="h-3 w-8 bg-white/[0.08] rounded" />
          <div className="h-3 w-8 bg-white/[0.08] rounded" />
          <div className="h-3 w-8 bg-white/[0.08] rounded" />
          <div className="h-3 w-8 bg-white/[0.08] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={weeklyTrends} margin={{ left: -18, right: 8, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="steps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.42} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="day" stroke="#9CA3AF" tickLine={false} axisLine={false} />
          <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.16)" }}
            contentStyle={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              color: "#F9FAFB"
            }}
          />
          <Area 
            type="monotone" 
            dataKey="steps" 
            stroke="#10B981" 
            strokeWidth={2.5} 
            fill="url(#steps)" 
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Area 
            type="monotone" 
            dataKey="water" 
            stroke="#22D3EE" 
            strokeWidth={2.5} 
            fill="url(#water)" 
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

