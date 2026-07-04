"use client";
import { motion } from "framer-motion";

const SUMMARIES: Record<string, { phenomenon: string; knowledge: string; life: string; fun: string }> = {
  "solution-prep": {
    phenomenon: "用天平称取所需质量的NaCl固体⚖️，用量筒量取所需体积的水💧，将固体倒入烧杯，加水后用玻璃棒搅拌，固体逐渐溶解消失，得到均匀透明的溶液！",
    knowledge: "溶质质量分数 = 溶质质量 ÷ 溶液质量 × 100%。配制步骤：①计算 ②称量（天平）③量取（量筒）④溶解（烧杯+玻璃棒）。溶液是均一、稳定的混合物。",
    life: "医院输液用的生理盐水是0.9%的NaCl溶液💉、农药需要按比例稀释🌾、做菜放盐就是配制溶液🧂、饮料的甜度取决于含糖浓度🥤",
    fun: "🌊 死海的盐浓度高达约30%，是普通海水的10倍！人在死海里可以轻松浮起来，就是因为溶液密度太大了～"
  },
  oxygen: {
    phenomenon: "向过氧化氢溶液中加入少量二氧化锰⚫，立即产生大量气泡💨。用排水法收集气体，将带火星的木条伸入集气瓶，木条复燃🔥！证明收集到的就是氧气！",
    knowledge: "2H₂O₂ —(MnO₂)→ 2H₂O + O₂↑。二氧化锰是催化剂，在反应前后质量和化学性质不变。氧气不易溶于水，可用排水法收集；氧气密度比空气大，也可用向上排空气法收集。",
    life: "医院用氧气瓶给病人供氧🏥、潜水员背着氧气瓶探索海洋🤿、火箭燃烧需要液氧作为助燃剂🚀、植物的光合作用释放氧气🌿",
    fun: "🕯️ 1774年，普里斯特利加热氧化汞首次制得氧气，他还发现老鼠在氧气中活得更久！后来拉瓦锡正式命名这种气体为「Oxygen」～"
  },
  "ph-test": {
    phenomenon: "pH试纸遇到不同溶液显示不同颜色🎨：稀盐酸变红（pH≈1-2），食盐水不变（pH≈7），肥皂水变蓝紫（pH≈10-11）。对比标准比色卡就能确定每种溶液的pH值！",
    knowledge: "pH的范围通常在0~14之间。pH<7为酸性，pH=7为中性，pH>7为碱性。pH越小酸性越强，pH越大碱性越强。pH试纸中含有多种酸碱指示剂的混合物。",
    life: "胃液pH≈1.5-2.0帮助消化🍽️、雨水pH<5.6叫酸雨会腐蚀建筑🏛️、洗发水弱酸性保护头发💇、土壤pH影响农作物生长🌾",
    fun: "🐝 蜜蜂蛰了涂肥皂水（碱性中和蚁酸），黄蜂蛰了涂食醋（酸性中和蜂毒）！不同蜂的毒液酸碱性不同，处理方式也不一样哦～"
  },
  titration: {
    phenomenon: "逐滴加入酸液，溶液颜色从粉红色💗→浅粉色→恰好无色。继续加酸则变为酸性，加入碱液又变回粉红。",
    knowledge: "酸 + 碱 → 盐 + 水（中和反应）。酚酞在碱性溶液中呈粉红色，中性/酸性中无色。滴定终点即酸碱恰好完全反应。",
    life: "胃酸过多吃胃药(含碱)💊、被蚊虫叮咬涂肥皂水🧼、酸性土壤撒石灰改良🌱、洗发水酸碱平衡",
    fun: "🍋 柠檬很酸是因为含柠檬酸，但进入身体后反而呈碱性！这就是为什么柠檬水对身体好～"
  },
};

interface Props { experimentId: string; accentColor?: string; }

export default function ExperimentSummary({ experimentId, accentColor = "#FFCC4D" }: Props) {
  const s = SUMMARIES[experimentId];
  if (!s) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm mt-6">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: `${accentColor}10` }}><span className="text-xl">📊</span><h3 className="text-[16px] font-bold" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>实验小结</h3></div>
      <div className="p-5 space-y-4">
        {[{ icon: "🔬", title: "观察到的现象", content: s.phenomenon, bg: `${accentColor}08` },
          { icon: "📝", title: "知识点提炼", content: s.knowledge, bg: "#F5F0FA" }].map((box, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: box.bg }}>
            <p className="text-[12px] font-bold mb-1.5 flex items-center gap-1.5" style={{ color: accentColor }}><span>{box.icon}</span>{box.title}</p>
            <p className="text-[13px] text-[#4D4D5E] leading-relaxed">{box.content}</p>
          </div>
        ))}
        <p className="text-[12px] font-bold text-[#6B6B7B] flex items-center gap-1.5"><span>🏠</span>生活中的应用</p>
        <p className="text-[12px] text-[#6B6B7B] bg-white border border-[#E8E0F0] rounded-xl p-3">{s.life}</p>
        <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #FFF9EB, #FFF0EB)" }}>
          <p className="text-[12px] font-bold mb-1.5 flex items-center gap-1.5 text-[#FF9A85]"><span>🎪</span>趣味小知识</p>
          <p className="text-[12px] text-[#4D4D5E] leading-relaxed">{s.fun}</p>
        </div>
      </div>
    </motion.div>
  );
}
