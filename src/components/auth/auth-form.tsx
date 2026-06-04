"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient, signIn, signUp } from "@/lib/auth-client";

type AuthMode = "login" | "signup" | "reset";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: ""
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await signUp.email({
          name: form.name,
          email: form.email,
          password: form.password,
          callbackURL: "/onboarding"
        });

        if (result.error) throw new Error(result.error.message ?? "Could not create account.");
        toast.success("Account created. Check your email to verify your account.");
        router.push("/onboarding");
        return;
      }

      if (mode === "login") {
        const result = await signIn.email({
          email: form.email,
          password: form.password,
          callbackURL: "/dashboard"
        });

        if (result.error) throw new Error(result.error.message ?? "Could not sign in.");
        router.push("/dashboard");
        return;
      }

      if (resetToken) {
        const result = await authClient.resetPassword({
          token: resetToken,
          newPassword: form.newPassword
        });

        if (result.error) throw new Error(result.error.message ?? "Could not reset password.");
        toast.success("Password updated.");
        router.push("/login");
        return;
      }

      const result = await authClient.requestPasswordReset({
        email: form.email,
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (result.error) throw new Error(result.error.message ?? "Could not send reset link.");
      toast.success("Password reset link sent if the account exists.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {mode === "signup" ? (
        <label className="grid gap-2 text-sm text-slate-300">
          Name
          <Input
            autoComplete="name"
            required
            value={form.name}
            onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm text-slate-300">
        Email
        <Input
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
        />
      </label>

      {mode !== "reset" ? (
        <label className="grid gap-2 text-sm text-slate-300">
          Password
          <Input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={8}
            required
            value={form.password}
            onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
          />
        </label>
      ) : resetToken ? (
        <label className="grid gap-2 text-sm text-slate-300">
          New password
          <Input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={form.newPassword}
            onChange={(event) => setForm((value) => ({ ...value, newPassword: event.target.value }))}
          />
        </label>
      ) : null}

      <Button disabled={loading} size="lg" type="submit">
        {loading
          ? "Working..."
          : mode === "signup"
            ? "Create account"
            : mode === "login"
              ? "Sign in"
              : resetToken
                ? "Update password"
                : "Send reset link"}
      </Button>

      <div className="flex flex-wrap justify-between gap-3 text-sm text-muted">
        {mode !== "login" ? <Link href="/login">Sign in</Link> : <Link href="/signup">Create account</Link>}
        {mode !== "reset" ? <Link href="/reset-password">Reset password</Link> : null}
      </div>
    </form>
  );
}
