"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ExperimentCard from "@/components/experiment/ExperimentCard";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#f0a040";

export default function ChemistryPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 化 学</p>
        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">化 学</h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">Chemistry</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          交互式实验 · 化学家的故事。点击实验卡片，进入沉浸式学习体验。
        </p>
        <div className="grid md:grid-cols-2 gap-3">
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
