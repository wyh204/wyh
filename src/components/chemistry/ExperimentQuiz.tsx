"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/types";

const QUIZZES: Record<string, QuizQuestion[]> = {
  "solution-prep": [
    { question: "配制50g质量分数为6%的NaCl溶液，需要NaCl多少克？", options: ["A. 2g", "B. 3g", "C. 6g", "D. 12g"], answer: 1, explanation: "溶质质量 = 溶液质量 × 质量分数 = 50g × 6% = 3g，需要称取3克食盐🧂" },
    { question: "量取水时，视线应该看量筒的什么位置？", options: ["A. 随便看", "B. 凹液面最低处", "C. 凹液面最高处", "D. 量筒口"], answer: 1, explanation: "读数时视线要与量筒内液体凹液面的最低处保持水平👀，这样读数才准确！" },
  ],
  oxygen: [
    { question: "实验室用过氧化氢制取氧气时，二氧化锰的作用是什么？", options: ["A. 反应物", "B. 催化剂", "C. 生成物", "D. 干燥剂"], answer: 1, explanation: "二氧化锰在反应中起催化作用⚡，加快过氧化氢分解速率，但自身的质量和化学性质在反应前后不变！" },
    { question: "收集氧气时可以用排水法，这是因为氧气具有什么性质？", options: ["A. 易溶于水", "B. 与水反应", "C. 不易溶于水", "D. 密度比水大"], answer: 2, explanation: "氧气不易溶于水💧，因此可以用排水法收集。此外氧气密度比空气大，也可以用向上排空气法收集～" },
  ],
  "ph-test": [
    { question: "pH=7的溶液是什么性？", options: ["A. 酸性", "B. 碱性", "C. 中性", "D. 不知道"], answer: 2, explanation: "pH<7为酸性，pH=7为中性，pH>7为碱性。纯水的pH约等于7💧" },
    { question: "下列哪种溶液的pH值最小（酸性最强）？", options: ["A. 食盐水", "B. 肥皂水", "C. 稀盐酸", "D. 石灰水"], answer: 2, explanation: "稀盐酸是强酸，pH值最小（约1-2）。食盐水pH≈7，肥皂水和石灰水pH>7呈碱性🧪" },
  ],
  titration: [
    { question: "酸碱中和反应的产物是什么？", options: ["A. 酸+碱", "B. 盐+氢气", "C. 盐+水", "D. 酸+氧气"], answer: 2, explanation: "酸 + 碱 → 盐 + 水，这是中和反应的通式🧪" },
    { question: "酚酞在碱性溶液中是什么颜色？", options: ["A. 无色", "B. 粉红色", "C. 蓝色", "D. 黄色"], answer: 1, explanation: "酚酞遇碱变粉红💗，中性或酸性时为无色！" },
  ],
};

interface Props { experimentId: string; accentColor?: string; onStarEarned?: () => void; }

export default function ExperimentQuiz({ experimentId, accentColor = "#FFCC4D", onStarEarned }: Props) {
  const questions = QUIZZES[experimentId] || [];
  const [q, setQ] = useState(0); const [sel, setSel] = useState<number | null>(null);
  const [show, setShow] = useState(false); const [score, setScore] = useState(0); const [done, setDone] = useState(false);

  function select(i: number) { if (show) return; setSel(i); setShow(true); if (i === questions[q].answer) { setScore((s) => s + 1); onStarEarned?.(); } }
  function next() { q + 1 < questions.length ? (setQ((q) => q + 1), setSel(null), setShow(false)) : setDone(true); }

  if (questions.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm mt-4">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: `${accentColor}10` }}><span className="text-xl">🧠</span><h3 className="text-[14px] font-bold" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>小测验</h3><span className="ml-auto text-[11px] text-[#B0A0C0]">{q + 1}/{questions.length}</span></div>
      <div className="p-5"><AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={`q-${q}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-[14px] font-bold text-[#3D3D4E] mb-4">{questions[q].question}</p>
            <div className="space-y-2">{questions[q].options.map((opt, i) => {
              const ok = i === questions[q].answer; const bad = show && sel === i && !ok;
              return (<motion.button key={i} whileHover={!show ? { scale: 1.02 } : {}} whileTap={!show ? { scale: 0.98 } : {}} onClick={() => select(i)} disabled={show}
                className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-medium border-2 transition-all ${show && ok ? "border-green-400 bg-green-50 text-green-700" : bad ? "border-red-300 bg-red-50 text-red-600" : sel === i ? "border-[#D0C0F0] bg-[#FDF8FF]" : "border-[#E8E0F0] hover:border-[#D0C0F0]"}`}>
                <span className="font-bold mr-2">{opt.slice(0, 2)}</span>{opt.slice(3)}{show && ok && <span className="float-right">✅</span>}{bad && <span className="float-right">❌</span>}</motion.button>);
            })}</div>
            {show && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
              <div className="p-4 rounded-xl" style={{ background: `${accentColor}10` }}><p className="text-[12px] text-[#6B6B7B]">{questions[q].explanation}</p></div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={next} className="mt-3 w-full py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, boxShadow: `0 3px 12px ${accentColor}30` }}>{q + 1 < questions.length ? "下一题 →" : "查看结果 🎉"}</motion.button>
            </motion.div>}
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <span className="text-5xl">🎉</span><p className="text-[18px] font-bold text-[#3D3D4E] mt-3" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>{score === questions.length ? "太棒了！全部答对！" : score > 0 ? `答对了 ${score} 题！` : "再来一次吧～"}</p>
            <div className="flex justify-center gap-1 mt-2">{Array.from({ length: questions.length }).map((_, i) => (<span key={i} className="text-2xl">{i < score ? "🌟" : "⭐"}</span>))}</div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setQ(0); setSel(null); setShow(false); setScore(0); setDone(false); }}
              className="mt-4 px-6 py-2 rounded-xl text-[12px] font-bold border-2" style={{ borderColor: accentColor, color: accentColor }}>🔄 再来一次</motion.button>
          </motion.div>
        )}</AnimatePresence></div>
    </motion.div>
  );
}
