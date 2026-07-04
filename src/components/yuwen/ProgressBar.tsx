"use client";
import { motion } from "framer-motion";

interface Props {
  totalSections: number;
  completedSections: number;
  stars: number;
  accentColor?: string;
  textTitle?: string;
}

export default function ProgressBar({
  totalSections = 5,
  completedSections = 0,
  stars = 0,
  accentColor = "#FF7B5C",
  textTitle,
}: Props) {
  const progress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold text-[#6B6B7B] flex items-center gap-1">
          📊 学习进度
          {textTitle && <span className="text-[#B0A0C0] font-normal">· {textTitle}</span>}
        </span>
        <span className="text-[12px] font-bold" style={{ color: accentColor }}>
          {completedSections}/{totalSections} 完成
        </span>
      </div>

      {/* 进度条 */}
      <div className="h-2.5 bg-[#F5F0FA] rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* 星星奖励 */}
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-[#B0A0C0] font-medium mr-1">奖励:</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="text-xl"
            initial={{ scale: 0, rotate: -30 }}
            animate={{
              scale: i < stars ? 1 : 0.6,
              rotate: i < stars ? 0 : -15,
            }}
            transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
            style={{ opacity: i < stars ? 1 : 0.3 }}
          >
            {i < stars ? "🌟" : "⭐"}
          </motion.span>
        ))}
        <span className="text-[11px] text-[#B0A0C0] font-medium ml-2">
          {stars > 0 ? `已获得 ${stars} 颗星星！` : "继续学习获取星星吧~"}
        </span>
      </div>
    </div>
  );
}
