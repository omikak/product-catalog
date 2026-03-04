import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        sun: "#f59e0b",
        mint: "#22c55e"
      }
    }
  },
  plugins: []
};

export default config;
