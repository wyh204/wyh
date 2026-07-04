"use client";
import { motion } from "framer-motion";
const TASKS = [{ icon:"📖", label:"完成一次语文学习" },{ icon:"🧮", label:"解开一道数学题" },{ icon:"🔬", label:"做一个科学实验" }];
export default function GameSystemBar() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 pb-12">
      <motion.div className="flex items-center gap-4 mb-6" initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
        <span className="text-[14px] font-bold text-[#6B6B7B] shrink-0" style={{ fontFamily:"var(--font-cartoon), 'YouYuan', sans-serif" }}>🎮 冒险记录</span>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ y:-3 }} className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-[#FFF9EB]">⭐</div>
          <div><p className="text-[13px] font-bold text-[#3D3D4E]" style={{ fontFamily:"var(--font-cartoon), 'YouYuan', sans-serif" }}>星星积分</p><p className="text-[11px] text-[#8B8B9B]">学习获得奖励 ✨</p></div>
          <span className="ml-auto text-[22px] font-bold text-[#FFCC4D]">12</span>
        </motion.div>
        <motion.div whileHover={{ y:-3 }} className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-[#EBF4FF]">🏆</div>
          <div><p className="text-[13px] font-bold text-[#3D3D4E]" style={{ fontFamily:"var(--font-cartoon), 'YouYuan', sans-serif" }}>成就徽章</p><p className="text-[11px] text-[#8B8B9B]">学习等级成长 🚀</p></div>
          <span className="ml-auto text-[22px] font-bold text-[#5BA4E6]">Lv.3</span>
        </motion.div>
        <motion.div whileHover={{ y:-3 }} className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><span className="text-xl">🎯</span><span className="text-[13px] font-bold text-[#3D3D4E]" style={{ fontFamily:"var(--font-cartoon), 'YouYuan', sans-serif" }}>每日任务</span><span className="ml-auto text-[10px] text-[#B0A0C0]">0/3</span></div>
          <div className="space-y-1.5">{TASKS.map((t,i)=>(<div key={i} className="flex items-center gap-2 text-[11px] text-[#6B6B7B]"><span>{t.icon}</span><span>{t.label}</span><span className="ml-auto text-[#B0A0C0]">○</span></div>))}</div>
        </motion.div>
      </div>
    </div>
  );
}
