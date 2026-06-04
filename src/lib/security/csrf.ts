import { ApiError } from "@/lib/api";
import { env } from "@/lib/env";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export function assertSameOrigin(request: Request) {
  if (safeMethods.has(request.method)) {
    return;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const targetHost = forwardedHost || host;

  if (!origin && process.env.NODE_ENV !== "production") {
    return;
  }

  if (!origin) {
    throw new ApiError(403, "Cross-site request rejected.", "CSRF_REJECTED");
  }

  const originHost = new URL(origin).host;

  let expectedHost = targetHost;
  try {
    const expectedUrl = new URL(env.appUrl);
    if (expectedUrl.host && env.appUrl !== "http://localhost:3000") {
      expectedHost = expectedUrl.host;
    }
  } catch {
    // Ignore invalid URL
  }

  if (originHost !== targetHost && originHost !== expectedHost) {
    throw new ApiError(403, "Cross-site request rejected.", "CSRF_REJECTED");
  }
}
