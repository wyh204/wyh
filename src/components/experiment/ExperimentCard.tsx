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
        className="content-card p-6 cursor-pointer group h-full"
        whileHover={{ y: -2 }}
        style={{ ["--accent-color" as string]: color }}
      >
        <div className="flex items-start gap-5">
          <div
            className="p-3 rounded-[4px] flex-shrink-0"
            style={{ background: `${color}0D` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold mb-1.5 text-white/80 tracking-[0.03em]">
              {experiment.name}
            </h3>
            <p className="text-[12px] text-white/30 mb-3 leading-relaxed">
              {experiment.description}
            </p>
            <span
              className="text-[10px] tracking-[0.1em] font-bold"
              style={{ color }}
            >
              {experiment.scientist}
            </span>
          </div>
        </div>

        <div
          className="h-[3px] mt-5 transition-all duration-300 ease-out group-hover:w-full rounded-full"
          style={{ background: color, width: "0%" }}
        />
      </motion.div>
    </Link>
  );
}
