"use client";

import posthog from "posthog-js";

import { publicEnv } from "@/lib/public-env";

export function initPostHog() {
  const client = posthog as unknown as { __loaded?: boolean };
  if (!publicEnv.posthogKey || typeof window === "undefined" || client.__loaded) {
    return;
  }

  posthog.init(publicEnv.posthogKey, {
    api_host: publicEnv.posthogHost,
    capture_pageview: true,
    person_profiles: "identified_only"
  });
}

export { posthog };
