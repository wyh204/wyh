"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Zap, Waves, Camera, Flame, Beaker, TestTube, Droplet, type LucideIcon } from "lucide-react";
import type { Experiment } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  sun: Sun, zap: Zap, waves: Waves, camera: Camera,
  flame: Flame, beaker: Beaker, "test-tube": TestTube, droplet: Droplet,
};

interface Props {
  experiment: Experiment;
  color: string;
  href: string;
}

export default function ExperimentCard({ experiment, color, href }: Props) {
  const Icon = iconMap[experiment.icon] || Beaker;

  return (
    <Link href={href}>
      <motion.div
        className="glass-card p-6 cursor-pointer group hover:border-white/15 transition-all h-full"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${color}15` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">{experiment.name}</h3>
            <p className="text-sm text-text-secondary mb-2">{experiment.description}</p>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
              {experiment.scientist}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
