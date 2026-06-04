import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        surface: "#111827",
        accent: "#4F46E5",
        violet: "#7C3AED",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: "#F9FAFB",
        muted: "#9CA3AF"
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(79, 70, 229, 0.22)",
        soft: "0 18px 70px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        "aura-grid":
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
