import type { Config } from "tailwindcss";

/** Map a CSS custom property holding "R G B" to a Tailwind colour token. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        surface: {
          DEFAULT: token("surface"),
          sunken: token("surface-sunken"),
          raised: token("surface-raised"),
          overlay: token("surface-overlay"),
        },
        ink: {
          DEFAULT: token("ink"),
          soft: token("ink-soft"),
          faint: token("ink-faint"),
        },
        line: {
          DEFAULT: token("line"),
          strong: token("line-strong"),
        },
        accent: {
          DEFAULT: token("accent"),
          hover: token("accent-hover"),
          soft: token("accent-soft"),
          ink: token("accent-ink"),
        },
        success: { DEFAULT: token("success"), soft: token("success-soft") },
        warning: { DEFAULT: token("warning"), soft: token("warning-soft") },
        danger: { DEFAULT: token("danger"), soft: token("danger-soft") },
        info: { DEFAULT: token("info"), soft: token("info-soft") },
        ring: token("ring"),
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      /** One motion rhythm, referenced by name instead of magic numbers. */
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      zIndex: {
        sticky: "20",
        header: "40",
        overlay: "60",
        toast: "80",
      },
      maxWidth: {
        content: "46rem",
      },
      /** Fluid type for hero headings — no jump at the breakpoint. */
      fontSize: {
        display: [
          "clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em" },
        ],
        title: [
          "clamp(1.5rem, 1.3rem + 0.9vw, 2rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em" },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
