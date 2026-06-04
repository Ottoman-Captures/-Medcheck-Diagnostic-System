"use client";

import { Bell, BellRing, CalendarClock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reminders as initialReminders } from "@/lib/demo-data";

export function ReminderBoard() {
  const [title, setTitle] = useState("Afternoon hydration");
  const [time, setTime] = useState("15:30");
  const [reminders, setReminders] = useState(initialReminders);

  async function enableNotifications() {
    if (!("Notification" in window)) {
      toast.error("Browser notifications are not supported here.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Browser notifications enabled.");
      new Notification("Medcheck Diagnostic System", { body: "Reminders are ready." });
    } else {
      toast.info("Notifications remain disabled.");
    }
  }

  async function addReminder() {
    const next = { title, time, type: "Water", active: true };
    setReminders((items) => [next, ...items]);

    await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "WATER",
        title,
        cadence: "DAILY",
        scheduledFor: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
    }).catch(() => undefined);

    toast.success("Reminder added.");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <aside className="glass-surface rounded-2xl p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/15 text-amber-100">
            <BellRing className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Reminders</h1>
            <p className="text-sm text-muted">Water, meals, movement, medication, sleep.</p>
          </div>
        </div>
        <div className="grid gap-3">
          <Input aria-label="Reminder title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input aria-label="Reminder time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          <Button onClick={() => void addReminder()}>Add reminder</Button>
          <Button variant="secondary" onClick={() => void enableNotifications()}>
            <Bell className="h-4 w-4" aria-hidden />
            Enable notifications
          </Button>
        </div>
      </aside>

      <section className="grid gap-3">
        {reminders.map((item) => (
          <article key={`${item.title}-${item.time}`} className="glass-surface flex items-center justify-between gap-4 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/[0.06] text-white">
                <CalendarClock className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">{item.title}</h2>
                <p className="text-sm text-muted">{item.time} · {item.type}</p>
              </div>
            </div>
            <Badge tone={item.active ? "emerald" : "slate"}>{item.active ? "Active" : "Paused"}</Badge>
          </article>
        ))}
      </section>
    </div>
  );
}
