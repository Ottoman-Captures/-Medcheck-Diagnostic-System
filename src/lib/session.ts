import { headers } from "next/headers";

import { ApiError } from "@/lib/api";
import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers()
  });
}

export async function requireUser() {
  const session = await getCurrentSession();
  if (!session?.user) {
    throw new ApiError(401, "You must be signed in to use this endpoint.");
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const role = "role" in user ? user.role : "USER";
  if (role !== "ADMIN") {
    throw new ApiError(403, "Admin access is required.");
  }

  return user;
}
