"use client";
import { motion } from "framer-motion";
const FEATURES = [
  { icon: "🤖", title: "AI 智能答疑", desc: "遇到不会的题目？AI老师24小时在线，用大白话给你讲明白～", color: "#FF7B5C", bg: "#FFF0EB" },
  { icon: "🔬", title: "互动实验", desc: "光的折射、电路连接……动手做实验，科学真好玩！", color: "#5BA4E6", bg: "#EBF4FF" },
  { icon: "📊", title: "进度追踪", desc: "每完成一个学习任务就能获得星星🌟，看看你积累了多少颗吧～", color: "#6DBE6D", bg: "#EDF8ED" },
  { icon: "🎯", title: "个性化学习", desc: "根据你的学习情况，智能推荐适合的练习内容，越学越厉害！", color: "#B39DDB", bg: "#F5F0FA" },
];
export default function PlatformFeatures() {
  return (
    <section className="relative pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div className="flex items-center gap-4 mb-10" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
          <span className="text-[16px] md:text-[18px] font-bold text-[#6B6B7B] shrink-0 px-3 py-1" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>✨ 平台特色</span>
          <span className="text-[10px] tracking-[0.12em] text-[#B0A0C0] font-medium shrink-0">WHY US</span>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ y: -6, scale: 1.03 }}
              className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6 text-center group cursor-default transition-shadow duration-300 hover:shadow-xl">
              <motion.div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 text-3xl" style={{ background: f.bg }}
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }} transition={{ duration: 0.4 }}>{f.icon}</motion.div>
              <h3 className="text-[15px] font-bold text-[#3D3D4E] mb-2" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>{f.title}</h3>
              <p className="text-[12px] text-[#8B8B9B] leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
