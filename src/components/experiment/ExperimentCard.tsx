"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Zap, Waves, Camera, Flame, Beaker, TestTube, Droplet, Scale, ExternalLink } from "lucide-react";
import type { Experiment } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  sun: Sun, zap: Zap, waves: Waves, camera: Camera, flame: Flame,
  beaker: Beaker, "test-tube": TestTube, droplet: Droplet, scale: Scale,
};
const diffColors: Record<string, string> = { "入门级": "#6DBE6D", "进阶级": "#FF7B5C", "挑战级": "#B39DDB" };

interface Props { experiment: Experiment; color: string; href: string; }

export default function ExperimentCard({ experiment, color, href }: Props) {
  const Icon = iconMap[experiment.icon] || Beaker;

  return (
    <Link href={href}>
      <motion.div
        className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6 cursor-pointer group h-full transition-all duration-300 hover:shadow-lg hover:border-[#D0C0F0]"
        whileHover={{ y: -3, scale: 1.02 }}
        style={{ ["--accent-color" as string]: color }}
      >
        <div className="flex items-start gap-5">
          {/* 图标 */}
          <div
            className="p-3 rounded-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${color}18` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[16px] font-bold text-[#3D3D4E] tracking-[0.03em]">
                {experiment.name}
              </h3>
              {experiment.difficulty && (
                <span
                  className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: diffColors[experiment.difficulty] || "#B0A0C0",
                    background: `${diffColors[experiment.difficulty] || "#B0A0C0"}15`,
                  }}
                >
                  {experiment.difficulty}
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#8B8B9B] mb-3 leading-relaxed font-medium">
              {experiment.description}
            </p>

            {/* 网址展示 */}
            {experiment.url && (
              <div
                className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-md text-[10px] font-medium"
                style={{ color: `${color}99` }}
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" style={{ color }} />
                <span className="truncate opacity-70">{experiment.url.replace(/^https?:\/\//, "")}</span>
              </div>
            )}

            <span className="text-[11px] tracking-[0.08em] font-bold" style={{ color }}>
              👨‍🔬 {experiment.scientist}
            </span>
          </div>
        </div>

        {/* 底部进度条 */}
        <div
          className="h-[4px] mt-5 transition-all duration-300 ease-out group-hover:w-full rounded-full"
          style={{ background: color, width: "0%" }}
        />
      </motion.div>
    </Link>
  );
}
