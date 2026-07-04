"use client";
import { motion } from "framer-motion";
import type { ExperimentStep } from "@/types";

const GUIDES: Record<string, ExperimentStep[]> = {
  "solution-prep": [
    { step: 1, title: "计算用量", instruction: "根据需要的溶液浓度和体积，计算所需溶质的质量和溶剂水的体积🧮", icon: "🧮" },
    { step: 2, title: "称量固体", instruction: "用托盘天平称取计算好的固体药品（如 NaCl）⚖️，放入烧杯中", icon: "⚖️" },
    { step: 3, title: "量取溶剂", instruction: "用量筒量取所需体积的蒸馏水💧，读数时视线要与凹液面最低处平齐", icon: "🥛" },
    { step: 4, title: "溶解配制", instruction: "将水倒入烧杯，用玻璃棒搅拌至固体完全溶解🥄，溶液配制完成！", icon: "✅" },
  ],
  oxygen: [
    { step: 1, title: "组装装置", instruction: "连接好锥形瓶、分液漏斗和导管，检查装置气密性🔧", icon: "🔧" },
    { step: 2, title: "加入药品", instruction: "锥形瓶中加入少量二氧化锰⚫，分液漏斗中加入过氧化氢溶液🧪", icon: "🧪" },
    { step: 3, title: "收集氧气", instruction: "打开分液漏斗活塞，用排水法在集气瓶中收集氧气🫧，瓶口有气泡冒出即收集满", icon: "🫧" },
    { step: 4, title: "验满验证", instruction: "将带火星的木条伸入集气瓶口，木条复燃🔥证明氧气已收集满！", icon: "🔥" },
  ],
  "ph-test": [
    { step: 1, title: "准备溶液", instruction: "取几种待测溶液：稀盐酸、食醋、食盐水、肥皂水、石灰水等🧪", icon: "🧪" },
    { step: 2, title: "撕取试纸", instruction: "撕取一小片pH试纸📄，放在洁净干燥的表面皿上", icon: "📄" },
    { step: 3, title: "滴加溶液", instruction: "用玻璃棒蘸取待测溶液，滴在pH试纸上💧，等待片刻", icon: "💧" },
    { step: 4, title: "比对读数", instruction: "将试纸变色后的颜色与标准比色卡对比🎨，读出溶液的pH值！", icon: "🎨" },
  ],
  titration: [
    { step: 1, title: "准备溶液", instruction: "锥形瓶中装入碱液+酚酞指示剂(粉红色💗)，滴定管装入酸液", icon: "🧪" },
    { step: 2, title: "逐滴加入", instruction: "慢慢旋转滴定管活塞，让酸液一滴一滴加入碱液中💧", icon: "💧" },
    { step: 3, title: "观察变色", instruction: "随着酸液加入，溶液颜色从粉红变浅→恰好变为无色🎯", icon: "🎨" },
    { step: 4, title: "滴定终点", instruction: "溶液刚好变为无色时停止！这就是中和反应的滴定终点✅", icon: "🎯" },
  ],
};

const HINTS: Record<string, string> = {
  "solution-prep": "💡 计算是关键！溶质质量 = 溶液质量 × 溶质质量分数～",
  oxygen: "💡 催化剂MnO₂只改变反应速率，反应前后质量和化学性质不变哦～",
  "ph-test": "💡 注意区分酸性和碱性溶液的pH范围：酸性 pH<7，碱性 pH>7～",
  titration: "💡 快到滴定终点时要放慢速度，半滴半滴地加～",
};

interface Props { experimentId: string; accentColor?: string; }

export default function ExperimentGuide({ experimentId, accentColor = "#FFCC4D" }: Props) {
  const steps = GUIDES[experimentId] || [];
  return (
    <div className="space-y-3">
      <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3" style={{ background: `${accentColor}10` }}>
          <span className="text-lg">📋</span>
          <h3 className="text-[14px] font-bold" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>操作步骤</h3>
          <span className="ml-auto text-[10px] text-[#B0A0C0] font-medium bg-white px-2 py-0.5 rounded-full">{steps.length} 步</span>
        </div>
        <div className="p-4 space-y-2">
          {steps.map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FFFDF9]">
              <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>{s.step}</span>
              <div><p className="text-[13px] font-bold text-[#4D4D5E] flex items-center gap-1.5"><span>{s.icon}</span>{s.title}</p><p className="text-[12px] text-[#8B8B9B] mt-0.5">{s.instruction}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="bg-white border-2 border-dashed rounded-2xl p-4 text-center" style={{ borderColor: `${accentColor}40`, background: `${accentColor}05` }}>
        <p className="text-[12px] font-medium" style={{ color: accentColor }}>{HINTS[experimentId] || "💡 仔细观察实验装置，试着操作每一步～"}</p>
      </motion.div>
    </div>
  );
}
