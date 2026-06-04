"use client";

import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supportedDiets } from "@/lib/validations/wellness";

const steps = ["Personal", "Health", "Diet", "Goals", "Plan"];
const goals = ["WEIGHT_LOSS", "MUSCLE_GAIN", "BETTER_SLEEP", "HYDRATION", "STRESS_REDUCTION", "ENDURANCE"];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["HYDRATION", "BETTER_SLEEP"]);
  const [form, setForm] = useState({
    name: "Alex Rivera",
    age: "22",
    gender: "PREFER_NOT_TO_SAY",
    heightCm: "172",
    weightKg: "68",
    activityLevel: "MODERATE",
    dietaryPreferences: "Mediterranean",
    allergies: "",
    restrictions: "No shellfish",
    planSummary: ""
  });

  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  const isStepValid = useMemo(() => {
    if (step === 0) {
      const ageNum = Number(form.age);
      return (
        form.name.trim().length >= 2 &&
        !isNaN(ageNum) &&
        Number.isInteger(ageNum) &&
        ageNum >= 13 &&
        ageNum <= 120
      );
    }
    if (step === 1) {
      const heightNum = Number(form.heightCm);
      const weightNum = Number(form.weightKg);
      return (
        !isNaN(heightNum) &&
        heightNum >= 90 &&
        heightNum <= 260 &&
        !isNaN(weightNum) &&
        weightNum >= 25 &&
        weightNum <= 350
      );
    }
    if (step === 3) {
      return selectedGoals.length >= 1 && selectedGoals.length <= 5;
    }
    return true;
  }, [step, form.name, form.age, form.heightCm, form.weightKg, selectedGoals]);

  async function complete() {
    const payload = {
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      activityLevel: form.activityLevel,
      dietaryPreferences: [form.dietaryPreferences].filter(Boolean),
      allergies: form.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      healthGoals: selectedGoals
    };

    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      toast.error("Could not save onboarding yet. Demo plan generated locally.");
      setForm((value) => ({
        ...value,
        planSummary:
          "Hydration target: 2.7L/day. Movement target: 8,000-10,000 steps. Sleep plan: steady wind-down and 7.5h target. Nutrition: Mediterranean, protein-forward meals that avoid listed restrictions."
      }));
    } else {
      const resData = await response.json();
      const profile = resData.data?.profile;
      const summary = profile?.planSummary;
      const planText = typeof summary === "string" ? summary : (summary?.plan || "Your personalized wellness plan has been generated!");

      setForm((value) => ({
        ...value,
        planSummary: planText
      }));

      toast.success("Personalized AI plan saved. Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 4000);
    }
  }

  return (
    <GlassPanel className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge tone="emerald">Step {step + 1} of 5</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Personalize Medcheck</h1>
        </div>
        <div className="w-full max-w-xs">
          <div className="mb-2 flex justify-between text-xs text-muted">
            <span>{steps[step]}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.08]">
            <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        {step === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Input
                aria-label="Name"
                placeholder="Name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              {form.name.trim().length < 2 && (
                <p className="mt-1 text-xs text-rose-400">Name must be at least 2 characters.</p>
              )}
            </div>
            <div>
              <Input
                aria-label="Age"
                placeholder="Age"
                value={form.age}
                onChange={(event) => setForm({ ...form, age: event.target.value })}
              />
              {(isNaN(Number(form.age)) || Number(form.age) < 13 || Number(form.age) > 120) && (
                <p className="mt-1 text-xs text-rose-400">Age must be a number between 13 and 120.</p>
              )}
            </div>
            <Select
              aria-label="Gender"
              value={form.gender}
              onChange={(event) => setForm({ ...form, gender: event.target.value })}
              className="sm:col-span-2"
            >
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
              <option value="NON_BINARY">Non-binary</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Input
                aria-label="Height in centimeters"
                placeholder="Height (cm)"
                value={form.heightCm}
                onChange={(event) => setForm({ ...form, heightCm: event.target.value })}
              />
              {(isNaN(Number(form.heightCm)) || Number(form.heightCm) < 90 || Number(form.heightCm) > 260) && (
                <p className="mt-1 text-xs text-rose-400">Height: 90 - 260 cm.</p>
              )}
            </div>
            <div>
              <Input
                aria-label="Weight in kilograms"
                placeholder="Weight (kg)"
                value={form.weightKg}
                onChange={(event) => setForm({ ...form, weightKg: event.target.value })}
              />
              {(isNaN(Number(form.weightKg)) || Number(form.weightKg) < 25 || Number(form.weightKg) > 350) && (
                <p className="mt-1 text-xs text-rose-400">Weight: 25 - 350 kg.</p>
              )}
            </div>
            <Select
              aria-label="Activity level"
              value={form.activityLevel}
              onChange={(event) => setForm({ ...form, activityLevel: event.target.value })}
            >
              <option value="SEDENTARY">Sedentary</option>
              <option value="LIGHT">Light</option>
              <option value="MODERATE">Moderate</option>
              <option value="ACTIVE">Active</option>
              <option value="ATHLETE">Athlete</option>
            </Select>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4">
            <Select
              aria-label="Diet preference"
              value={form.dietaryPreferences}
              onChange={(event) => setForm({ ...form, dietaryPreferences: event.target.value })}
            >
              {supportedDiets.map((diet) => (
                <option key={diet}>{diet}</option>
              ))}
            </Select>
            <Input
              aria-label="Allergies"
              placeholder="Allergies, comma separated"
              value={form.allergies}
              onChange={(event) => setForm({ ...form, allergies: event.target.value })}
            />
            <Textarea
              aria-label="Food restrictions and dislikes"
              value={form.restrictions}
              onChange={(event) => setForm({ ...form, restrictions: event.target.value })}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {goals.map((goal) => {
                const active = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() =>
                      setSelectedGoals((items) =>
                        active ? items.filter((item) => item !== goal) : [...items, goal]
                      )
                    }
                    className="aura-focus flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] p-4 text-left text-sm text-white"
                  >
                    <span>{goal.replaceAll("_", " ")}</span>
                    {active ? <Check className="h-4 w-4 text-emerald-300" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
            {selectedGoals.length === 0 && (
              <p className="mt-3 text-sm text-rose-400">Please select at least one health goal to continue.</p>
            )}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
            <div className="mb-3 flex items-center gap-2 text-emerald-100">
              <Sparkles className="h-5 w-5" aria-hidden />
              <h2 className="font-display text-lg font-semibold">Personalized plan</h2>
            </div>
            <p className="leading-7 text-slate-200">
              {form.planSummary ||
                "Generate your plan to turn your profile, preferences, restrictions, and goals into a daily wellness system."}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
          Back
        </Button>
        {step < 4 ? (
          <Button disabled={!isStepValid} onClick={() => setStep((value) => value + 1)}>Continue</Button>
        ) : (
          <Button disabled={!isStepValid} onClick={() => void complete()}>Generate plan</Button>
        )}
      </div>
    </GlassPanel>
  );
}
