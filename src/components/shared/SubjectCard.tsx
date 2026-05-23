"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BookOpen, Calculator, Globe, Atom, FlaskConical, type LucideIcon } from "lucide-react";
import type { Subject } from "@/types";
import { cn } from "@/lib/utils";

const subjectMeta: Record<Subject, { name: string; color: string; Icon: LucideIcon; desc: string }> = {
  yuwen: { name: "语文", color: "#e85d3a", Icon: BookOpen, desc: "AI 文学鉴赏与作文辅导" },
  math: { name: "数学", color: "#4da6ff", Icon: Calculator, desc: "智能解题与数学家故事" },
  english: { name: "英语", color: "#3dd68c", Icon: Globe, desc: "语法精讲与写作指导" },
  physics: { name: "物理", color: "#a78bfa", Icon: Atom, desc: "交互式实验与物理学家故事" },
  chemistry: { name: "化学", color: "#f0a040", Icon: FlaskConical, desc: "交互式实验与化学家故事" },
};

export default function SubjectCard({ subject }: { subject: Subject }) {
  const meta = subjectMeta[subject];
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <Link href={`/${subject}`}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "glass-card p-6 cursor-pointer select-none relative overflow-hidden group",
          "hover:shadow-lg transition-shadow duration-300"
        )}
        whileHover={{ y: -4 }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${meta.color}15 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10">
          <meta.Icon className="w-10 h-10 mb-3" style={{ color: meta.color }} />
          <h3 className="text-xl font-bold mb-1" style={{ color: meta.color }}>
            {meta.name}
          </h3>
          <p className="text-sm text-text-secondary">{meta.desc}</p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }}
        />
      </motion.div>
    </Link>
  );
}

export { subjectMeta };
