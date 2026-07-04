"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/types";

/* ===================================================
   各实验小测验 (每实验2道选择题)
   =================================================== */
const QUIZZES: Record<string, QuizQuestion[]> = {
  refraction: [
    { question: "光从空气斜射入水中时，传播方向会怎样？", options: ["A. 沿直线传播", "B. 发生偏折（折射）", "C. 完全反弹回去", "D. 消失不见"], answer: 1, explanation: "光从一种介质进入另一种介质时，传播方向会改变，这就是折射现象哦！" },
    { question: "彩虹的形成和什么原理有关？", options: ["A. 光的反射", "B. 光的折射和色散", "C. 磁铁吸引", "D. 化学反应"], answer: 1, explanation: "白光经过水滴折射后分解成七种颜色，形成美丽的彩虹🌈" },
  ],
  "boiling-water": [
    { question: "水在标准大气压下沸腾时的温度是多少？", options: ["A. 90°C", "B. 100°C", "C. 110°C", "D. 80°C"], answer: 1, explanation: "在标准大气压下，水的沸点是100°C。水沸腾时虽然持续加热，但温度保持不变哦！" },
    { question: "水沸腾前，烧杯底部产生的气泡在上升过程中会怎样？", options: ["A. 变大", "B. 变小消失", "C. 不变", "D. 爆炸"], answer: 1, explanation: "沸腾前，底部气泡上升时遇到较冷的水层，气泡中的水蒸气会重新液化，所以气泡逐渐变小消失🫧" },
  ],
  buoyancy: [
    { question: "浮力的大小等于什么？", options: ["A. 物体的重量", "B. 排开液体的重量", "C. 水的温度", "D. 物体的颜色"], answer: 1, explanation: "阿基米德原理：浮力 = 排开液体的重力。排开的水越多，浮力越大！" },
    { question: "铁船为什么能浮在水上？", options: ["A. 用了特殊材料", "B. 船是空心的，排开的水多", "C. 水有魔法", "D. 船有发动机"], answer: 1, explanation: "铁船是空心的，体积大排开的水多，浮力就大于重力啦～" },
  ],
  "convex-lens": [
    { question: "物体在凸透镜的2倍焦距外，成什么像？", options: ["A. 正立放大虚像", "B. 倒立缩小实像", "C. 倒立放大实像", "D. 不成像"], answer: 1, explanation: "u>2f 时成倒立缩小实像，这就是照相机的原理！📷" },
    { question: "放大镜使用的是凸透镜的哪种成像？", options: ["A. 倒立缩小实像", "B. 正立放大虚像", "C. 倒立放大实像", "D. 倒立等大实像"], answer: 1, explanation: "放大镜使用时物体在焦距内(u<f)，成正立放大的虚像🔍" },
  ],
};

interface Props {
  experimentId: string;
  accentColor?: string;
  onStarEarned?: () => void;
}

export default function ExperimentQuiz({ experimentId, accentColor = "#B39DDB", onStarEarned }: Props) {
  const questions = QUIZZES[experimentId] || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function handleSelect(index: number) {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === questions[currentQ].answer) { setScore((s) => s + 1); onStarEarned?.(); }
  }

  function handleNext() {
    if (currentQ + 1 < questions.length) { setCurrentQ((q) => q + 1); setSelected(null); setShowResult(false); }
    else { setDone(true); }
  }

  if (questions.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm mt-4">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: `${accentColor}10` }}>
        <span className="text-xl">🧠</span>
        <h3 className="text-[14px] font-bold" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>小测验</h3>
        <span className="ml-auto text-[11px] text-[#B0A0C0] font-medium">{currentQ + 1}/{questions.length}</span>
      </div>
      <div className="p-5">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-[14px] font-bold text-[#3D3D4E] mb-4 leading-relaxed">{questions[currentQ].question}</p>
              <div className="space-y-2">
                {questions[currentQ].options.map((opt, i) => {
                  const isCorrect = i === questions[currentQ].answer;
                  const isWrong = showResult && selected === i && !isCorrect;
                  return (
                    <motion.button key={i} type="button" whileHover={!showResult ? { scale: 1.02 } : {}} whileTap={!showResult ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(i)} disabled={showResult}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 border-2 ${
                        showResult && isCorrect ? "border-green-400 bg-green-50 text-green-700"
                        : isWrong ? "border-red-300 bg-red-50 text-red-600"
                        : selected === i ? "border-[#D0C0F0] bg-[#F5F0FA]"
                        : "border-[#E8E0F0] hover:border-[#D0C0F0] hover:bg-[#FDF8FF]"}`}>
                      <span className="font-bold mr-2">{opt.slice(0, 2)}</span>{opt.slice(3)}
                      {showResult && isCorrect && <span className="float-right">✅</span>}
                      {isWrong && <span className="float-right">❌</span>}
                    </motion.button>);
                })}
              </div>
              {showResult && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                  <div className="p-4 rounded-xl" style={{ background: `${accentColor}10` }}>
                    <p className="text-[12px] text-[#6B6B7B] leading-relaxed">{questions[currentQ].explanation}</p>
                  </div>
                  <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext}
                    className="mt-3 w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-all"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, boxShadow: `0 3px 12px ${accentColor}30` }}>
                    {currentQ + 1 < questions.length ? "下一题 →" : "查看结果 🎉"}
                  </motion.button>
                </motion.div>)}
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <motion.span className="text-5xl inline-block" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>🎉</motion.span>
              <p className="text-[18px] font-bold text-[#3D3D4E] mt-3" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
                {score === questions.length ? "太棒了！全部答对！" : score > 0 ? `答对了 ${score} 题！继续加油～` : "别灰心，再来一次吧～"}
              </p>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: questions.length }).map((_, i) => (<span key={i} className="text-2xl">{i < score ? "🌟" : "⭐"}</span>))}
              </div>
              <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setCurrentQ(0); setSelected(null); setShowResult(false); setScore(0); setDone(false); }}
                className="mt-4 px-6 py-2 rounded-xl text-[12px] font-bold border-2 transition-all" style={{ borderColor: accentColor, color: accentColor }}>
                🔄 再来一次
              </motion.button>
            </motion.div>)}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
