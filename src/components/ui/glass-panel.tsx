import { cn } from "@/lib/utils";

export function GlassPanel({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("glass-surface rounded-2xl p-5", className)}>{children}</section>;
}
