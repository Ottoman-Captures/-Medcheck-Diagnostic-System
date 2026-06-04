"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Soup,
  UserRoundCheck,
  X
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "Onboarding", icon: UserRoundCheck },
  { href: "/coach", label: "AI Coach", icon: Bot },
  { href: "/meals", label: "Meals", icon: Soup },
  { href: "/reminders", label: "Reminders", icon: CalendarClock },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Settings }
];

import { motion, AnimatePresence } from "framer-motion";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-aura-grid bg-[size:42px_42px]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/78 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="aura-focus flex items-center gap-3 rounded-lg">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400 text-slate-950">
              <span className="font-display text-lg font-black">A</span>
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-wide text-white">Medcheck Diagnostic System</p>
              <p className="text-xs text-muted">Student Edition</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "aura-focus relative inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                    active ? "bg-white/[0.09] text-white" : "text-muted hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="ghost"
              size="icon"
              title="Sign out"
              onClick={() => void signOut()}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.nav 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-t border-white/10 px-4 py-3 lg:hidden overflow-hidden bg-slate-950/95"
            >
              <div className="grid gap-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "aura-focus flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                        active ? "bg-white/[0.09] text-white" : "text-muted hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
