import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function ResetPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <GlassPanel className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-white">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-muted">A secure reset link is sent through the configured email provider.</p>
        <div className="mt-7">
          <Suspense>
            <AuthForm mode="reset" />
          </Suspense>
        </div>
      </GlassPanel>
    </main>
  );
}
