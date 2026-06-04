import {
  Activity,
  Apple,
  BedDouble,
  Brain,
  Droplets,
  Flame,
  Footprints,
  Moon,
  Salad,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

export const healthOverview = [
  {
    label: "Daily Steps",
    value: "8,240",
    target: "10,000",
    progress: 82,
    tone: "emerald",
    icon: Footprints
  },
  {
    label: "Water Intake",
    value: "1.9L",
    target: "2.7L",
    progress: 70,
    tone: "cyan",
    icon: Droplets
  },
  {
    label: "Sleep",
    value: "7h 12m",
    target: "8h",
    progress: 90,
    tone: "indigo",
    icon: BedDouble
  },
  {
    label: "Calories",
    value: "1,850",
    target: "2,200",
    progress: 84,
    tone: "amber",
    icon: Flame
  }
] as const;

export const weeklyTrends = [
  { day: "Mon", steps: 6200, water: 1800, sleep: 6.4, calories: 2140 },
  { day: "Tue", steps: 7400, water: 2100, sleep: 7.1, calories: 2010 },
  { day: "Wed", steps: 8800, water: 1900, sleep: 7.4, calories: 1950 },
  { day: "Thu", steps: 9200, water: 2400, sleep: 6.8, calories: 2210 },
  { day: "Fri", steps: 8240, water: 1900, sleep: 7.2, calories: 1850 },
  { day: "Sat", steps: 10600, water: 2600, sleep: 8.1, calories: 2320 },
  { day: "Sun", steps: 6800, water: 2200, sleep: 7.8, calories: 2050 }
];

export const recommendations = [
  {
    title: "Hydration pacing",
    body: "Add two 300ml water breaks before 5 PM to stay inside today’s target without overloading late.",
    icon: Droplets,
    tone: "cyan"
  },
  {
    title: "Sleep cue",
    body: "Your best recovery days followed a steady wind-down. Start a 25-minute low-light block tonight.",
    icon: Moon,
    tone: "indigo"
  },
  {
    title: "Protein anchor",
    body: "Choose one protein-forward meal at lunch to support satiety and training recovery.",
    icon: Salad,
    tone: "emerald"
  }
];

export const goalProgress = [
  { label: "Hydration", value: 70 },
  { label: "Movement", value: 82 },
  { label: "Sleep", value: 90 },
  { label: "Nutrition", value: 78 }
];

export const mealPlan = [
  {
    type: "Breakfast",
    title: "Greek yogurt bowl",
    macro: "410 cal · 34g protein",
    notes: "Berries, chia, oats, cinnamon"
  },
  {
    type: "Lunch",
    title: "Mediterranean chickpea plate",
    macro: "620 cal · 29g protein",
    notes: "Quinoa, cucumber, greens, tahini lemon"
  },
  {
    type: "Dinner",
    title: "High-protein tofu stir fry",
    macro: "680 cal · 42g protein",
    notes: "Brown rice, broccoli, peppers, ginger"
  },
  {
    type: "Snack",
    title: "Apple with peanut butter",
    macro: "220 cal · 8g protein",
    notes: "Pre-workout friendly"
  }
];

export const reminders = [
  { title: "Water check", time: "10:30", type: "Water", active: true },
  { title: "Walk outside", time: "13:00", type: "Exercise", active: true },
  { title: "Dinner prep", time: "18:30", type: "Meal", active: true },
  { title: "Sleep wind-down", time: "22:15", type: "Sleep", active: false }
];

export const adminStats = [
  { label: "Users", value: "1,284", icon: Users, tone: "indigo" },
  { label: "Active Today", value: "418", icon: Activity, tone: "emerald" },
  { label: "AI Requests", value: "6,902", icon: Brain, tone: "cyan" },
  { label: "System Health", value: "99.98%", icon: ShieldCheck, tone: "amber" }
];

export const productHighlights = [
  { label: "AI Coach", icon: Sparkles },
  { label: "Meal Planner", icon: Apple },
  { label: "Habit Loops", icon: Target },
  { label: "Analytics", icon: TrendingUp },
  { label: "Mobile Sync", icon: Zap },
  { label: "Reminders", icon: Timer }
];
