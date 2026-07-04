"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageCircle } from "lucide-react";

/* ================================================================
   统一追问模块 — 预设快捷提问 + 输入框 + AI 回复
   所有学科共用，确保交互体验完全一致
   ================================================================ */

interface QuickQuestion {
  icon: string;
  label: string;
  prompt: string;
}

// 各学科预设快捷提问
const SUBJECT_QUESTIONS: Record<string, QuickQuestion[]> = {
  yuwen: [
    { icon: "🤔", label: "内容看不懂", prompt: "这段内容我没太看懂，能用更简单的话再讲一遍吗？" },
    { icon: "⭐", label: "重点是什么", prompt: "这篇文章最重要的知识点是什么？帮我总结一下" },
    { icon: "✍️", label: "怎么写作文", prompt: "按照刚才学的内容，我该怎么运用到写作文中？" },
  ],
  math: [
    { icon: "🤔", label: "步骤看不懂", prompt: "解题步骤我没看懂，能用更简单的方法再讲一遍吗？" },
    { icon: "💡", label: "为什么这么做", prompt: "为什么这道题要这样解？背后的数学原理是什么？" },
    { icon: "🔄", label: "更简单的方法", prompt: "有没有更简单的解题方法？适合初中生理解的" },
  ],
  english: [
    { icon: "🔊", label: "单词怎么读", prompt: "这些单词怎么读？能用中文标注一下发音吗？" },
    { icon: "📖", label: "语法是什么意思", prompt: "刚才讲的语法我没太懂，能用大白话再解释一遍吗？" },
    { icon: "✍️", label: "作文怎么写", prompt: "按照学到的内容，英语作文应该怎么组织？" },
  ],
  physics: [
    { icon: "🤔", label: "步骤为什么这样", prompt: "实验步骤为什么要这样做？背后的物理原理是什么？" },
    { icon: "⚠️", label: "有什么安全风险", prompt: "做这个实验有什么需要注意的安全问题？" },
    { icon: "🔄", label: "失败了怎么办", prompt: "如果实验失败了怎么办？常见的错误有哪些？" },
  ],
  chemistry: [
    { icon: "🤔", label: "步骤为什么这样", prompt: "实验步骤为什么要这样做？背后的化学原理是什么？" },
    { icon: "⚠️", label: "有什么安全风险", prompt: "做这个实验有什么需要注意的安全问题？" },
    { icon: "🔄", label: "失败了怎么办", prompt: "如果实验失败或现象不明显怎么办？" },
  ],
};

interface Props {
  subject: "yuwen" | "math" | "english" | "physics" | "chemistry";
  accentColor?: string;
  onAsk: (question: string) => Promise<void>;
  loading?: boolean;
  reply?: string | null;
  streaming?: boolean;
}

export default function FollowUpQuestions({
  subject, accentColor = "#FF7B5C", onAsk, loading = false, reply, streaming = false,
}: Props) {
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const questions = SUBJECT_QUESTIONS[subject] || [];

  async function handleAsk(question: string) {
    const q = question || input.trim();
    if (!q || loading) return;
    setExpanded(true);
    setInput("");
    await onAsk(q);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm mt-6">
      {/* 标题栏 */}
      <button type="button" onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-5 py-3 hover:bg-[#FFFDF9] transition-colors">
        <MessageCircle className="w-4 h-4" style={{ color: accentColor }} />
        <span className="text-[14px] font-bold text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
          💬 还有疑问？问我吧！
        </span>
        <span className="ml-auto text-[11px] text-[#B0A0C0]">{expanded ? "收起 ▲" : "展开提问 ▼"}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#F5F0FA]">
            <div className="p-5 space-y-4">
              {/* 快捷提问按钮 */}
              <div className="flex flex-wrap gap-2">
                {questions.map((q) => (
                  <motion.button key={q.label} type="button" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => handleAsk(q.prompt)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-bold
                               bg-white border-2 border-[#E8E0F0] text-[#4D4D5E]
                               hover:border-[#D0C0F0] hover:bg-[#FDF8FF] transition-all">
                    <span className="text-sm">{q.icon}</span> {q.label}
                  </motion.button>
                ))}
              </div>

              {/* 输入框 + 发送 */}
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk("")}
                  placeholder="输入你的问题..."
                  disabled={loading}
                  className="flex-1 bg-white border-2 border-[#E8E0F0] rounded-2xl px-4 py-2.5 text-[13px] text-[#3D3D4E]
                             placeholder-[#B0A0C0] focus:outline-none focus:border-current transition-colors font-medium"
                  style={{ borderColor: loading ? "#E8E0F0" : undefined }} />
                <motion.button type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={() => handleAsk("")} disabled={loading || !input.trim()}
                  className="shrink-0 px-5 rounded-2xl text-[13px] font-bold text-white disabled:opacity-30 transition-all"
                  style={{ background: loading ? `${accentColor}80` : accentColor, boxShadow: `0 3px 12px ${accentColor}30` }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* AI 回复 */}
              {loading && !reply && (
                <div className="text-center py-6">
                  <motion.span className="text-3xl inline-block" animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}>🤖</motion.span>
                  <p className="text-[13px] text-[#B0A0C0] font-medium mt-2">AI 小助手正在认真准备回答...</p>
                </div>
              )}

              {reply && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-5" style={{ background: `${accentColor}08` }}>
                  <p className="text-[11px] font-bold mb-2 flex items-center gap-1.5" style={{ color: accentColor }}>
                    <span>🤖</span> AI 小助手回答
                  </p>
                  <p className="text-[14px] text-[#4D4D5E] leading-[1.8] whitespace-pre-wrap">
                    {reply}
                    {streaming && <span className="cursor-blink" style={{ ["--accent-color" as string]: accentColor }} />}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { SUBJECT_QUESTIONS };
