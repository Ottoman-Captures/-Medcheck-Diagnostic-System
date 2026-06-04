import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";

import { sendTransactionalEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  secret: env.betterAuthSecret,
  baseURL: env.betterAuthUrl,
  database: prismaAdapter(prisma, {
    provider: "sqlite"
  }),
  trustedOrigins: [env.appUrl],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendTransactionalEmail({
        to: user.email,
        subject: "Reset your Medcheck Diagnostic System password",
        html: `<p>Reset your Medcheck Diagnostic System password by opening this secure link:</p><p><a href="${url}">${url}</a></p>`,
        text: `Reset your Medcheck Diagnostic System password: ${url}`
      });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendTransactionalEmail({
        to: user.email,
        subject: "Verify your Medcheck Diagnostic System email",
        html: `<p>Welcome to Medcheck Diagnostic System. Verify your email here:</p><p><a href="${url}">${url}</a></p>`,
        text: `Verify your Medcheck Diagnostic System email: ${url}`
      });
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  plugins: [
    jwt({
      jwks: {
        disablePrivateKeyEncryption: true
      },
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: "role" in user ? user.role : "USER"
        })
      }
    }),
    nextCookies()
  ],
  advanced: {
    cookiePrefix: "aura",
    database: {
      generateId: "uuid"
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false
      }
    }
  }
});
