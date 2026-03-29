import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // APEX GTM Design System
        apex: {
          black: "#080B12",
          dark: "#0D1117",
          surface: "#111827",
          card: "#161D2F",
          border: "#1E2D40",
          "border-bright": "#2A3F5C",
          // Electric blue — primary action
          blue: "#3B82F6",
          "blue-bright": "#60A5FA",
          "blue-glow": "#1D4ED8",
          "blue-dim": "#1E3A5F",
          // Neon purple — AI/agent
          purple: "#8B5CF6",
          "purple-bright": "#A78BFA",
          "purple-glow": "#6D28D9",
          "purple-dim": "#2D1B69",
          // Electric green — success/active
          green: "#10B981",
          "green-bright": "#34D399",
          "green-dim": "#064E3B",
          // Amber — warning/pending
          amber: "#F59E0B",
          "amber-bright": "#FCD34D",
          // Red — error/lost
          red: "#EF4444",
          "red-bright": "#F87171",
          // Text hierarchy
          "text-primary": "#F1F5F9",
          "text-secondary": "#94A3B8",
          "text-muted": "#475569",
          "text-disabled": "#334155",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-apex":
          "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #10B981 100%)",
        "gradient-dark":
          "linear-gradient(180deg, #080B12 0%, #0D1117 100%)",
        "glow-blue":
          "radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)",
        "glow-purple":
          "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(22,29,47,0.8) 0%, rgba(13,17,23,0.9) 100%)",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59,130,246,0.3), 0 0 60px rgba(59,130,246,0.1)",
        "glow-purple": "0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)",
        "glow-green": "0 0 20px rgba(16,185,129,0.3)",
        "card": "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "typing": "typing 1.5s steps(3) infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59,130,246,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.3)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        typing: {
          "0%, 100%": { content: "''" },
          "33%": { content: "'.'" },
          "66%": { content: "'..'" },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
