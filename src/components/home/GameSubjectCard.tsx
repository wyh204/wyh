"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Subject } from "@/types";

const WORLD: Record<Subject, { world: string; emoji: string; color: string; light: string; desc: string; border: string }> = {
  math:     { world:"🏰 数学王国",     emoji:"🏰", color:"#5BA4E6", light:"#EBF4FF", desc:"数字和图形的魔法世界",       border:"#A0C8F0" },
  english:  { world:"🌳 英语森林",     emoji:"🌳", color:"#6DBE6D", light:"#EDF8ED", desc:"和字母精灵一起冒险",         border:"#B8E0B8" },
  yuwen:    { world:"📖 语文故事岛",   emoji:"📖", color:"#FF7B5C", light:"#FFF0EB", desc:"走进故事的奇妙大陆",         border:"#FFB09C" },
  physics:  { world:"🔬 科学实验星球", emoji:"🔬", color:"#B39DDB", light:"#F5F0FA", desc:"动手探索科学的奥秘",         border:"#D0C0F0" },
  chemistry:{ world:"🧪 化学魔法屋",   emoji:"🧪", color:"#FFCC4D", light:"#FFF9EB", desc:"神奇的化学变化等你发现",     border:"#FFE8A0" },
};

interface Props { subject: Subject }

export default function GameSubjectCard({ subject }: Props) {
  const m = WORLD[subject];
  return (
    <Link href={`/${subject}`}>
      <motion.div whileHover={{ y:-6, scale:1.05 }} whileTap={{ scale:0.95 }}
        transition={{ type:"spring", stiffness:300, damping:20 }}
        className="relative bg-white border-2 rounded-3xl p-5 cursor-pointer overflow-hidden group"
        style={{ borderColor:"#E8E0F0" }}>
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ boxShadow:`0 0 0 3px ${m.color}40, 0 8px 32px ${m.color}20` }} />
        <div className="absolute top-0 left-4 right-4 h-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ background:`linear-gradient(90deg, ${m.color}, ${m.border})` }} />
        <motion.div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-[32px] mb-3 mt-2 relative"
          style={{ background:m.light }} whileHover={{ scale:1.12, rotate:[0,-4,4,0] }} transition={{ duration:0.3 }}>
          {m.emoji}
        </motion.div>
        <h3 className="text-[15px] font-bold text-center mb-1" style={{ color:m.color, fontFamily:"var(--font-cartoon), 'YouYuan', sans-serif" }}>{m.world}</h3>
        <p className="text-[11px] text-[#8B8B9B] text-center mb-4">{m.desc}</p>
        <div className="w-full py-2.5 rounded-2xl text-[13px] font-bold text-white text-center" style={{ background:`linear-gradient(135deg, ${m.color}, ${m.border})`, boxShadow:`0 3px 12px ${m.color}25` }}>
          🎮 进入关卡
        </div>
        <div className="flex justify-center gap-1.5 mt-3 opacity-30 group-hover:opacity-60 transition-opacity">
          {[m.color,m.border,m.color].map((c,i)=>(<span key={i} className="w-1.5 h-1.5 rounded-full" style={{background:c}}/>))}
        </div>
      </motion.div>
    </Link>
  );
}
