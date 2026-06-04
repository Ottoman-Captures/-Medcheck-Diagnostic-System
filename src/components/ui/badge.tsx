import { cn } from "@/lib/utils";

type BadgeTone = "indigo" | "emerald" | "amber" | "cyan" | "slate" | "red";

const tones: Record<BadgeTone, string> = {
  indigo: "border-indigo-400/25 bg-indigo-400/10 text-indigo-200",
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  slate: "border-white/10 bg-white/[0.06] text-slate-200",
  red: "border-red-400/25 bg-red-400/10 text-red-200"
};

export function Badge({
  children,
  tone = "slate",
  className
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
