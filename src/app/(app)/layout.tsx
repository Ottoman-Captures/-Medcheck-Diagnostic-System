import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { getCurrentSession } from "@/lib/session";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
