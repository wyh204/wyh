"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentStep } from "@/types";

/* ===================================================
   各实验操作步骤指引
   =================================================== */
const GUIDES: Record<string, ExperimentStep[]> = {
  refraction: [
    { step: 1, title: "观察装置", instruction: "看看实验台上有什么？一个激光笔🔦、一杯水💧和一道光屏", icon: "👀" },
    { step: 2, title: "光线入射", instruction: "激光从空气射入水中，你看光线发生了什么变化？", icon: "🔦" },
    { step: 3, title: "折射现象", instruction: "光线进入水中后方向改变了！这就是「光的折射」现象～", icon: "↗️" },
    { step: 4, title: "观察光谱", instruction: "白光经过折射后会分解成彩虹色🌈，这就是光的色散", icon: "🌈" },
  ],
  "boiling-water": [
    { step: 1, title: "准备器材", instruction: "铁架台固定温度计🌡️，烧杯中加入适量清水💧，放上石棉网", icon: "🔧" },
    { step: 2, title: "点燃酒精灯", instruction: "点燃酒精灯🔥，给烧杯中的水加热，观察温度计示数变化", icon: "🔥" },
    { step: 3, title: "观察气泡", instruction: "随着温度升高，烧杯底部出现小气泡🫧，气泡上升过程中逐渐变小消失", icon: "👀" },
    { step: 4, title: "水沸腾了", instruction: "水温达到100°C时剧烈沸腾♨️！大量气泡从底部涌出，气泡在上升过程中变大！", icon: "♨️" },
  ],
  buoyancy: [
    { step: 1, title: "观察水槽", instruction: "看看实验装置：一个装满水的水槽🪣和一个方块🧊", icon: "👀" },
    { step: 2, title: "放入物体", instruction: "把方块放进水里，你看到了什么现象？", icon: "🧊" },
    { step: 3, title: "浮力出现", instruction: "水对方块产生向上的力——这就是「浮力」！", icon: "⬆️" },
    { step: 4, title: "排开水", instruction: "方块浸入水中会排开一些水💧，排开的水越多，浮力越大", icon: "💧" },
  ],
  "convex-lens": [
    { step: 1, title: "认识装置", instruction: "从左到右：蜡烛🕯️、凸透镜🔍、光屏📺", icon: "👀" },
    { step: 2, title: "调整距离", instruction: "移动蜡烛改变物距，观察光屏上的像有什么变化？", icon: "🕯️" },
    { step: 3, title: "观察成像", instruction: "物体在2倍焦距外→倒立缩小实像；在焦距内→正立放大虚像", icon: "🔍" },
    { step: 4, title: "找规律", instruction: "物距越近像越大，物距越远像越小；记住「物近像远像变大」", icon: "📐" },
  ],
};

const KID_HINTS: Record<string, string> = {
  refraction: "💡 试试上下旋转视角，从不同角度观察光线～",
  "boiling-water": "💡 仔细观察温度计的变化，水温到达100°C时会发生什么？",
  buoyancy: "💡 观察水面下方的方块，感受浮力的方向～",
  "convex-lens": "💡 从左到右看：蜡烛→凸透镜→光屏，像出现在光屏上～",
};

interface Props {
  experimentId: string;
  accentColor?: string;
}

export default function ExperimentGuide({ experimentId, accentColor = "#B39DDB" }: Props) {
  const steps = GUIDES[experimentId] || [];
  const hint = KID_HINTS[experimentId] || "💡 仔细观察实验装置，试着探索每个元件的作用～";

  return (
    <div className="space-y-3">
      {/* 步骤列表 */}
      <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3" style={{ background: `${accentColor}10` }}>
          <span className="text-lg">📋</span>
          <h3 className="text-[14px] font-bold tracking-[0.05em]" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
            操作步骤
          </h3>
          <span className="ml-auto text-[10px] text-[#B0A0C0] font-medium bg-white px-2 py-0.5 rounded-full">
            {steps.length} 步
          </span>
        </div>
        <div className="p-4 space-y-2">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[#FDF8FF]"
            >
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
              >
                {s.step}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#4D4D5E] flex items-center gap-1.5">
                  <span>{s.icon}</span> {s.title}
                </p>
                <p className="text-[12px] text-[#8B8B9B] mt-0.5 leading-relaxed">{s.instruction}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 小提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white border-2 border-dashed rounded-2xl p-4 text-center"
        style={{ borderColor: `${accentColor}40`, background: `${accentColor}05` }}
      >
        <p className="text-[12px] font-medium" style={{ color: accentColor }}>{hint}</p>
      </motion.div>
    </div>
  );
}

export { GUIDES, KID_HINTS };
