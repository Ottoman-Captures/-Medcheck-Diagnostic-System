"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { recommendations } from "@/lib/demo-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const toneBorderColors = {
  cyan: "hover:border-cyan-500/30",
  indigo: "hover:border-indigo-500/30",
  emerald: "hover:border-emerald-500/30"
};

export function RecommendationList() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-3"
    >
      {recommendations.map((item) => {
        const Icon = item.icon;
        const toneKey = item.tone as "cyan" | "indigo" | "emerald";
        const borderHover = toneBorderColors[toneKey] || "hover:border-white/20";
        
        return (
          <motion.article 
            key={item.title} 
            variants={itemVariants}
            whileHover={{ scale: 1.01, x: 2 }}
            className={`rounded-xl border border-white/10 bg-white/[0.045] p-4 transition-colors duration-300 ${borderHover}`}
          >
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-white/[0.06] text-white">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-sm font-semibold text-white">{item.title}</h3>
                  <Badge tone={toneKey}>AI</Badge>
                </div>
                <p className="text-sm leading-6 text-muted">{item.body}</p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}

