"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ExperimentCard from "@/components/experiment/ExperimentCard";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function ChemistryPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#f0a040" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-chemistry mb-2">化学实验</h2>
          <p className="text-text-secondary text-sm">交互式化学实验 · 化学家的故事</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {CHEMISTRY_EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ExperimentCard experiment={exp} color="#f0a040" href={`/chemistry/${exp.id}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
