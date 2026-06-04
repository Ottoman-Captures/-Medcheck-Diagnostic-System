import { ShieldAlert } from "lucide-react";

import { AI_HEALTH_DISCLAIMER } from "@/lib/ai/safety";

export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
      <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
      <p>{AI_HEALTH_DISCLAIMER}</p>
    </div>
  );
}
