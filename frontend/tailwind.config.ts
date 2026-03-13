import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#11212d",
        mist: "#f2f7f9",
        signal: "#2f7d7d",
        amber: "#d98e04"
      }
    }
  },
  plugins: []
} satisfies Config;
