"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
const RECS = [
  { emoji: "🔬", title: "光的折射实验", desc: "观察光线从空气进入水中的奇妙变化", link: "/physics/refraction", tag: "热门", color: "#FF7B5C" },
  { emoji: "📷", title: "拍照搜数学题", desc: "拍一拍就能看到详细的解题步骤", link: "/math", tag: "新功能", color: "#5BA4E6" },
  { emoji: "✍️", title: "作文开头怎么写", desc: "AI教你用Hook抓住阅卷老师的心", link: "/yuwen", tag: "推荐", color: "#6DBE6D" },
  { emoji: "🌍", title: "英语单词记忆法", desc: "拍照识别+趣味记忆，单词不再难", link: "/english", tag: "实用", color: "#B39DDB" },
  { emoji: "🧪", title: "制取氧气实验", desc: "动手组装装置，观察神奇的化学反应", link: "/chemistry/oxygen", tag: "实验", color: "#FFCC4D" },
];
export default function WeeklyRecommend() {
  const [current, setCurrent] = useState(0);
  useEffect(() => { const t = setInterval(() => setCurrent((c) => (c + 1) % RECS.length), 4000); return () => clearInterval(t); }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: "linear-gradient(135deg, #FFF0EB, #EBF4FF)" }}><span className="text-lg">🔥</span><h3 className="text-[14px] font-bold text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>本周推荐</h3><span className="ml-auto text-[10px] text-[#B0A0C0] font-medium">自动轮播</span></div>
      <div className="relative overflow-hidden" style={{ minHeight: 80 }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="px-5 py-4 flex items-center gap-4">
            <span className="text-3xl shrink-0">{RECS[current].emoji}</span>
            <div className="min-w-0 flex-1"><div className="flex items-center gap-2 mb-1"><span className="text-[13px] font-bold text-[#3D3D4E]">{RECS[current].title}</span><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: RECS[current].color }}>{RECS[current].tag}</span></div><p className="text-[11px] text-[#8B8B9B]">{RECS[current].desc}</p></div>
            <Link href={RECS[current].link} className="shrink-0 px-4 py-2 rounded-xl text-[11px] font-bold text-white transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${RECS[current].color}, ${RECS[current].color}99)` }}>去看看 →</Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">{RECS.map((_, i) => (<button key={i} type="button" onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-[#FF7B5C]" : "bg-[#DDD0E8]"}`} />))}</div>
    </motion.div>
  );
}
