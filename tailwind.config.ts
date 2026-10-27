import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        green: {
          DEFAULT: "var(--green)",
          dark: "var(--green-dark)",
          deep: "var(--green-deep)",
          soft: "var(--green-soft)",
          softer: "var(--green-softer)",
        },
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        amber: "var(--amber)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        s: "var(--radius-s)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
        lift: "var(--shadow-lift)",
      },
      fontFamily: {
        sans: ["var(--font)", "sans-serif"],
        mono: ["var(--mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
