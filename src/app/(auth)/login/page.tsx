import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <GlassPanel className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Continue building your wellness rhythm with Medcheck Diagnostic System.</p>
        <div className="mt-7">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>
      </GlassPanel>
    </main>
  );
}
