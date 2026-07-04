"use client";
import { motion } from "framer-motion";
import ExperimentCard from "@/components/experiment/ExperimentCard";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";

const ACCENT = "#FFCC4D";

export default function ChemistryPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[11px] tracking-[0.12em] text-[#B0A0C0] mb-8 font-medium">🧪 课程 / 化 学</p>
        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>化 学</h2>
          <p className="text-[16px] font-medium tracking-[0.02em] text-[#B0A0C0] mt-1">Chemistry</p>
        </div>
        <p className="text-[15px] text-[#6B6B7B] tracking-[0.03em] mb-10 max-w-[400px] font-medium">
          交互式实验 · 化学家的故事。点击实验卡片，进入沉浸式学习体验。
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {CHEMISTRY_EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ExperimentCard experiment={exp} color={ACCENT} href={`/chemistry/${exp.id}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
