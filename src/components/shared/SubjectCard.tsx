"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Globe, Atom, FlaskConical, type LucideIcon } from "lucide-react";
import type { Subject } from "@/types";

const subjectMeta: Record<Subject, { name: string; color: string; Icon: LucideIcon; desc: string; enName: string }> = {
  yuwen: { name: "语 文", color: "#a78bfa", Icon: BookOpen, desc: "现代文学鉴赏 · 古文精读 · 作文辅导", enName: "Chinese" },
  math: { name: "数 学", color: "#60a5fa", Icon: Calculator, desc: "智能解题 · 数学史故事 · 考点分析", enName: "Math" },
  english: { name: "英 语", color: "#34d399", Icon: Globe, desc: "语法精讲 · 作文指导 · 满分大纲", enName: "English" },
  physics: { name: "物 理", color: "#c084fc", Icon: Atom, desc: "交互式实验 · 物理学家故事", enName: "Physics" },
  chemistry: { name: "化 学", color: "#f0a040", Icon: FlaskConical, desc: "交互式实验 · 化学家故事", enName: "Chemistry" },
};

export default function SubjectCard({ subject }: { subject: Subject }) {
  const meta = subjectMeta[subject];

  return (
    <Link href={`/${subject}`}>
      <motion.div
        className="content-card p-6 cursor-pointer group relative overflow-hidden h-full"
        whileHover={{ y: -2 }}
        style={{ ["--accent-color" as string]: meta.color }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${meta.color}0D, transparent)` }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div
            className="text-[10px] tracking-[0.2em] font-bold mb-4"
            style={{ color: meta.color }}
          >
            {meta.name}
          </div>

          <p className="text-[13px] leading-relaxed text-white/40 mb-6 flex-1">
            {meta.desc}
          </p>

          <p className="text-[10px] tracking-[0.1em] text-white/10 font-light italic">
            {meta.enName}
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[3px] transition-all duration-300 ease-out group-hover:w-full"
          style={{ background: meta.color, width: "0%" }}
        />
      </motion.div>
    </Link>
  );
}

export { subjectMeta };
