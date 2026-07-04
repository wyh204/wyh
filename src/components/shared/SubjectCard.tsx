"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Subject } from "@/types";

/* ===================================================
   学科元数据 — 马卡龙配色 + 卡通 Emoji
   =================================================== */
const subjectMeta: Record<
  Subject,
  {
    name: string;
    color: string;
    colorLight: string;
    colorBg: string;
    emoji: string;
    desc: string;
    enName: string;
  }
> = {
  yuwen: {
    name: "语 文",
    color: "#FF7B5C",
    colorLight: "#FFB09C",
    colorBg: "#FFF0EB",
    emoji: "📚",
    desc: "现代文学鉴赏 · 古文精读 · 作文辅导",
    enName: "Chinese",
  },
  math: {
    name: "数 学",
    color: "#5BA4E6",
    colorLight: "#A0C8F0",
    colorBg: "#EBF4FF",
    emoji: "🧮",
    desc: "智能解题 · 数学史故事 · 考点分析",
    enName: "Math",
  },
  english: {
    name: "英 语",
    color: "#6DBE6D",
    colorLight: "#B8E0B8",
    colorBg: "#EDF8ED",
    emoji: "🌍",
    desc: "语法精讲 · 作文指导 · 满分大纲",
    enName: "English",
  },
  physics: {
    name: "物 理",
    color: "#B39DDB",
    colorLight: "#D0C0F0",
    colorBg: "#F5F0FA",
    emoji: "⚛️",
    desc: "交互式实验 · 物理学家故事",
    enName: "Physics",
  },
  chemistry: {
    name: "化 学",
    color: "#FFCC4D",
    colorLight: "#FFE8A0",
    colorBg: "#FFF9EB",
    emoji: "🧪",
    desc: "交互式实验 · 化学家故事",
    enName: "Chemistry",
  },
};

export default function SubjectCard({ subject }: { subject: Subject }) {
  const meta = subjectMeta[subject];

  return (
    <Link href={`/${subject}`} className="block h-full">
      <motion.div
        className="subject-card group relative flex flex-col h-full p-6 cursor-pointer select-none"
        style={{
          ["--accent-color" as string]: meta.color,
          ["--accent-color-light" as string]: meta.colorLight,
        }}
        whileHover={{ y: -6, scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* 顶部彩色渐变条 */}
        <div
          className="absolute top-0 left-4 right-4 h-[4px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, ${meta.color}, ${meta.colorLight})`,
          }}
        />

        {/* 悬停时的柔和背景色 */}
        <div
          className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: meta.colorBg }}
        />

        {/* ---- 内容 ---- */}
        <div className="relative z-10 flex flex-col h-full pt-2">

          {/* 卡通图标 — 大号 Emoji */}
          <motion.div
            className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-5 relative mx-auto sm:mx-0"
            style={{
              background: meta.colorBg,
              border: `3px solid ${meta.color}30`,
              boxShadow: `0 4px 16px ${meta.color}20`,
            }}
            whileHover={{ scale: 1.12, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="text-[38px] leading-none relative z-10 transition-transform duration-300 group-hover:scale-110">
              {meta.emoji}
            </span>
          </motion.div>

          {/* 学科标签 */}
          <div
            className="text-[15px] tracking-[0.1em] font-bold mb-2 text-center sm:text-left"
            style={{
              color: meta.color,
              fontFamily: "var(--font-cartoon), 'ZCOOL KuaiLe', sans-serif",
            }}
          >
            {meta.name}
          </div>

          {/* 描述 */}
          <p className="text-[14px] leading-relaxed text-[#6B6B7B] mb-5 flex-1 text-center sm:text-left font-medium">
            {meta.desc}
          </p>

          {/* 底部装饰：英文名 + 箭头 */}
          <div className="flex items-center justify-between mt-auto">
            <span
              className="text-[11px] tracking-[0.08em] font-medium italic px-2 py-0.5 rounded-full"
              style={{
                color: meta.color,
                background: meta.colorBg,
              }}
            >
              {meta.enName}
            </span>
            <motion.span
              style={{ color: meta.color }}
              animate={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.25 }}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </motion.span>
          </div>
        </div>

        {/* 卡通小装饰 — 底部彩色圆点 */}
        <div className="absolute bottom-4 left-[35%] right-[35%] flex justify-center gap-1.5 opacity-40 group-hover:opacity-70 transition-opacity duration-300">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.colorLight }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
        </div>
      </motion.div>
    </Link>
  );
}

export { subjectMeta };
