import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0a0a1a", light: "#0f0f2a", card: "rgba(15,15,42,0.6)" },
        yuwen: "#e85d3a",
        math: "#4da6ff",
        english: "#3dd68c",
        physics: "#a78bfa",
        chemistry: "#f0a040",
        text: { primary: "#e8e8f0", secondary: "#8888a0" },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px var(--glow-color)" },
          "50%": { boxShadow: "0 0 20px var(--glow-color)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
