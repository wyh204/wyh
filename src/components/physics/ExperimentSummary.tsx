"use client";
import { motion } from "framer-motion";

/* ===================================================
   实验小结 — 现象总结 + 知识点 + 生活例子
   =================================================== */
const SUMMARIES: Record<string, { phenomenon: string; knowledge: string; examples: string[]; funFact: string }> = {
  refraction: {
    phenomenon: "光线从空气斜射入水中时，传播方向发生了偏折。我们看到水中的吸管好像「折断」了，这就是光的折射现象！",
    knowledge: "光从一种介质斜射入另一种介质时，传播方向发生改变。入射角、折射角和法线在同一平面内。光从空气进入水中时，折射角小于入射角。",
    examples: ["游泳池里的水看起来比实际浅 👀", "捕鱼时要瞄准鱼的下方 🎣", "海市蜃楼也是折射造成的 🌊", "眼镜片利用折射矫正视力 👓"],
    funFact: "🌈 白光经过三棱镜折射后，会分解成红橙黄绿蓝靛紫七种颜色，这就是彩虹形成的原理！",
  },
  "boiling-water": {
    phenomenon: "加热后，烧杯底部先出现小气泡，气泡上升时逐渐变小消失。随着温度继续升高，气泡越来越多。当水温达到100°C时，水剧烈沸腾，大量气泡从底部涌出，气泡在上升过程中不断变大，到达水面后破裂释放水蒸气♨️！",
    knowledge: "沸腾是液体内部和表面同时发生的剧烈汽化现象。沸腾的条件：①温度达到沸点；②继续吸热。在标准大气压下，水的沸点是100°C。沸腾过程中虽然持续加热，但水温保持不变。沸点随气压变化：气压越高，沸点越高；气压越低，沸点越低。",
    examples: ["高压锅利用高压提高水的沸点，食物熟得更快 🍲", "高原地区气压低，水的沸点低于100°C，煮饭不容易熟 🏔️", "煮饺子时水开了加冷水，就是为了让水温回到沸点以下防止溢出 🥟", "蒸馒头利用水沸腾产生的水蒸气来加热 🥟"],
    funFact: "🏔️ 在珠穆朗玛峰顶（海拔8848米），水的沸点只有约70°C！用普通锅根本煮不熟饭，必须用高压锅才能吃上热腾腾的饭菜～",
  },
  buoyancy: {
    phenomenon: "物体浸入水中会受到向上的浮力。浸入水中的体积越大，排开的水越多，浮力就越大。当浮力大于重力时，物体就浮起来了！",
    knowledge: "阿基米德原理：浸在液体中的物体受到向上的浮力，浮力的大小等于物体排开液体的重力。F浮 = ρ液 × g × V排",
    examples: ["轮船虽然是铁做的，但因为空心体积大所以能浮在水上 🚢", "游泳时身体浸入水中会感觉变轻 🏊", "潜水艇通过改变自身重量来控制上浮和下潜 🤿", "热气球利用空气浮力升空 🎈"],
    funFact: "🐋 鲸鱼能在深海中自由沉浮，就是利用了浮力原理！它们的骨骼和脂肪密度刚好让它们悬浮在水中。",
  },
  "convex-lens": {
    phenomenon: "蜡烛通过凸透镜在光屏上形成了倒立的像！移动蜡烛改变物距，像的大小和位置也改变了。物距大于2倍焦距时成倒立缩小实像，在焦距和2倍焦距之间成倒立放大实像。",
    knowledge: "凸透镜成像规律：① u>2f → 倒立缩小实像 ② u=2f → 倒立等大实像 ③ f<u<2f → 倒立放大实像 ④ u=f → 不成像 ⑤ u<f → 正立放大虚像",
    examples: ["放大镜就是利用凸透镜成正立放大虚像的原理 🔍", "照相机镜头是凸透镜，在底片上成倒立缩小实像 📷", "投影仪利用凸透镜成倒立放大实像 🎥", "近视眼镜是凹透镜，远视眼镜（老花镜）是凸透镜 👓"],
    funFact: "👁️ 你的眼睛就是一个天然的凸透镜成像系统！晶状体相当于凸透镜，视网膜相当于光屏。看近处时晶状体变厚，看远处时变薄～",
  },
};

interface Props {
  experimentId: string;
  accentColor?: string;
}

export default function ExperimentSummary({ experimentId, accentColor = "#B39DDB" }: Props) {
  const summary = SUMMARIES[experimentId];
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm mt-6"
    >
      {/* 标题 */}
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: `${accentColor}10` }}>
        <span className="text-xl">📊</span>
        <h3 className="text-[16px] font-bold tracking-[0.05em]" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
          实验小结
        </h3>
      </div>

      <div className="p-5 space-y-4">
        {/* 现象总结 */}
        <div className="rounded-xl p-4" style={{ background: `${accentColor}08` }}>
          <p className="text-[12px] font-bold mb-1.5 flex items-center gap-1.5" style={{ color: accentColor }}>
            <span>🔬</span> 观察到的现象
          </p>
          <p className="text-[13px] text-[#4D4D5E] leading-relaxed">{summary.phenomenon}</p>
        </div>

        {/* 知识点提炼 */}
        <div className="rounded-xl p-4 bg-[#F5F0FA]">
          <p className="text-[12px] font-bold mb-1.5 flex items-center gap-1.5 text-[#8B6BAE]">
            <span>📝</span> 知识点提炼
          </p>
          <p className="text-[13px] text-[#4D4D5E] leading-relaxed">{summary.knowledge}</p>
        </div>

        {/* 生活例子 */}
        <div>
          <p className="text-[12px] font-bold mb-2 flex items-center gap-1.5 text-[#6B6B7B]">
            <span>🏠</span> 生活中的例子
          </p>
          <div className="grid gap-1.5">
            {summary.examples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-[12px] text-[#6B6B7B] bg-white border border-[#E8E0F0] rounded-xl px-3 py-2"
              >
                {ex}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 趣味拓展 */}
        <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #FFF9EB, #FFF0EB)" }}>
          <p className="text-[12px] font-bold mb-1.5 flex items-center gap-1.5 text-[#FF9A85]">
            <span>🎪</span> 趣味小知识
          </p>
          <p className="text-[12px] text-[#4D4D5E] leading-relaxed">{summary.funFact}</p>
        </div>
      </div>
    </motion.div>
  );
}
