"use client";

import { ChefHat, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mealPlan } from "@/lib/demo-data";
import { supportedDiets } from "@/lib/validations/wellness";

export function MealPlanner() {
  const [diet, setDiet] = useState("Mediterranean");
  const [restrictions, setRestrictions] = useState("No shellfish, no pork");
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    setLoading(true);
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "DAILY",
          diet,
          targetCalories: 2200,
          restrictions: restrictions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: { message: string } };
        throw new Error(payload.error?.message ?? "Could not generate meal plan.");
      }

      toast.success("Meal plan generated and restrictions applied.");
    } catch (error) {
      toast.info(error instanceof Error ? error.message : "Showing demo meal plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <aside className="glass-surface rounded-2xl p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/15 text-emerald-100">
            <ChefHat className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Smart Meal Planner</h1>
            <p className="text-sm text-muted">Restriction-aware nutrition planning.</p>
          </div>
        </div>
        <div className="grid gap-4">
          <Select aria-label="Diet" value={diet} onChange={(event) => setDiet(event.target.value)}>
            {supportedDiets.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Input
            aria-label="Restrictions"
            value={restrictions}
            onChange={(event) => setRestrictions(event.target.value)}
          />
          <Button onClick={() => void generatePlan()} disabled={loading}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </aside>

      <section className="grid gap-4 sm:grid-cols-2">
        {mealPlan.map((meal) => (
          <article key={meal.type} className="glass-surface rounded-2xl p-5">
            <Badge tone="emerald">{meal.type}</Badge>
            <h2 className="mt-4 font-display text-xl font-semibold text-white">{meal.title}</h2>
            <p className="mt-2 font-mono text-sm text-emerald-200">{meal.macro}</p>
            <p className="mt-4 text-sm leading-6 text-muted">{meal.notes}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
