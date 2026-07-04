"use client";
import { motion } from "framer-motion";
const REVIEWS = [
  { name: "小明", grade: "初一", avatar: "👦", stars: 5, text: "这个学习平台太棒了！我最喜欢做物理实验，光的折射让我真正理解了彩虹的原理🌈", color: "#FF7B5C" },
  { name: "小红", grade: "初二", avatar: "👧", stars: 5, text: "数学拍照搜题超级方便！遇到不会的几何题，拍个照片就能看到详细的解题步骤📷", color: "#5BA4E6" },
  { name: "小刚", grade: "初三", avatar: "🧒", stars: 4, text: "英语语法讲解很透彻，AI 老师分析得很细致，我的阅读完形进步了好多！🌟", color: "#6DBE6D" },
  { name: "小花", grade: "初一", avatar: "👧", stars: 5, text: "我最爱语文的古文精读，AI老师逐句翻译特别清晰，文言文再也不头疼啦✍️", color: "#B39DDB" },
];
export default function UserReviews() {
  return (
    <section className="relative pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div className="flex items-center gap-4 mb-10" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
          <span className="text-[16px] md:text-[18px] font-bold text-[#6B6B7B] shrink-0 px-3 py-1" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>💬 同学们说</span>
          <span className="text-[10px] tracking-[0.12em] text-[#B0A0C0] font-medium shrink-0">REVIEWS</span>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12 }} whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-5 group hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3"><div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl" style={{ background: `${r.color}15` }}>{r.avatar}</div>
              <div><p className="text-[13px] font-bold text-[#3D3D4E]">{r.name}</p><p className="text-[10px] text-[#B0A0C0]">{r.grade}</p></div></div>
              <div className="flex gap-0.5 mb-2">{Array.from({ length: 5 }).map((_, s) => (<span key={s} className="text-sm">{s < r.stars ? "⭐" : "☆"}</span>))}</div>
              <p className="text-[12px] text-[#6B6B7B] leading-relaxed font-medium">{r.text}</p>
              <div className="h-1 mt-3 rounded-full transition-all duration-300 group-hover:w-full" style={{ background: r.color, width: "30%", opacity: 0.5 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
