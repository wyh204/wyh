import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 马卡龙色系 — 学科专属主题色
        yuwen: "#FF7B5C",       // 暖橙 — 语文
        math: "#5BA4E6",        // 天蓝 — 数学
        english: "#6DBE6D",     // 草绿 — 英语
        physics: "#B39DDB",     // 浅紫 — 物理
        chemistry: "#FFCC4D",   // 鹅黄 — 化学
        // 全局色
        bg: { DEFAULT: "#FFF8F0", light: "#FFFDF9", card: "#FFFFFF" },
        text: { primary: "#3D3D4E", secondary: "#6B6B7B", muted: "#9999AA" },
      },
      fontFamily: {
        sans: ['"YouYuan"', '"幼圆"', '"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
        body: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "bounce-slow": "bounceSlow 3s ease-in-out infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "cloud-drift": "cloudDrift 20s linear infinite",
        "pop-in": "popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px var(--glow-color)" },
          "50%": { boxShadow: "0 0 20px var(--glow-color)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        cloudDrift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(110%)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
