import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "aura-focus min-h-28 w-full resize-y rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 text-sm text-white placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
