import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/debug": ["./prisma/dev.db"],
    "/api/auth/[...all]": ["./prisma/dev.db"],
    "/api/ai/chat": ["./prisma/dev.db"],
    "/api/meals": ["./prisma/dev.db"],
    "/api/reminders": ["./prisma/dev.db"],
    "/api/users/me": ["./prisma/dev.db"],
    "/api/activity": ["./prisma/dev.db"],
    "/api/health": ["./prisma/dev.db"],
    "/onboarding": ["./prisma/dev.db"],
    "/dashboard": ["./prisma/dev.db"],
    "/meals": ["./prisma/dev.db"],
    "/reminders": ["./prisma/dev.db"],
    "/analytics": ["./prisma/dev.db"],
    "/admin": ["./prisma/dev.db"],
    "/login": ["./prisma/dev.db"],
    "/signup": ["./prisma/dev.db"],
    "/": ["./prisma/dev.db"]
  }
};

export default nextConfig;
