import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { AppProviders } from "@/components/app/providers";

export const metadata: Metadata = {
  title: {
    default: "Medcheck Diagnostic System",
    template: "%s | Medcheck Diagnostic System"
  },
  description: "AI-powered wellness coaching, tracking, meal planning, and analytics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  colorScheme: "dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}
