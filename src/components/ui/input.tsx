import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "aura-focus h-11 w-full rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm text-white placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
