"use client";
import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ExperimentGuide from "@/components/chemistry/ExperimentGuide";
import ExperimentSummary from "@/components/chemistry/ExperimentSummary";
import ExperimentQuiz from "@/components/chemistry/ExperimentQuiz";
import StructuredGuidance from "@/components/shared/StructuredGuidance";
import FollowUpQuestions from "@/components/shared/FollowUpQuestions";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";
import type { HistoryItem } from "@/types";
import { useHistory } from "@/hooks/useHistory";

const ACCENT = "#FFCC4D";

export default function ChemistryExperimentPage() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const router = useRouter();
  const experiment = CHEMISTRY_EXPERIMENTS.find((e) => e.id === experimentId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { save, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const [aiGuided, setAiGuided] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [stars, setStars] = useState(0);
  const [followUpReply, setFollowUpReply] = useState<string | null>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpStreaming, setFollowUpStreaming] = useState(false);

  const loadExperiment = useCallback(async () => {
    if (!experiment) return;
    setLoading(true); setError(null); setResult(null); setAiGuided(true);
    try {
      const res = await fetch("/api/chemistry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ experimentName: experiment.name, scientist: experiment.scientist }) });
      if (!res.ok) { try { const j = await res.json(); setError({ message: j.error, code: j.code }); } catch { setError({ message: "网络错误" }); } setLoading(false); return; }
      const reader = res.body?.getReader(); if (!reader) { setLoading(false); return; }
      const decoder = new TextDecoder(); let fullText = ""; setResult(""); setStreaming(true);
      while (true) { const { done, value } = await reader.read(); if (done) break; const lines = decoder.decode(value, { stream: true }).split("\n"); for (const line of lines) { if (!line.startsWith("data: ")) continue; try { const p = JSON.parse(line.slice(6)); if (p.error) { setError({ message: p.error }); setStreaming(false); break; } if (p.done) { setStreaming(false); fullText = p.full || fullText; } else if (p.delta) { fullText += p.delta; setResult(fullText); } } catch { /* skip */ } } }
      setStreaming(false);
      save("chemistry", experiment.name, fullText); setCurrentItem({ id: Date.now().toString(), subject: "chemistry", input: experiment.name, output: fullText, timestamp: Date.now() });
      setShowSummary(true);
    } catch { setError({ message: "网络错误" }); } finally { setLoading(false); }
  }, [experiment, save]);

  function handleReset() { setResult(null); setError(null); setAiGuided(false); setShowSummary(false); setShowQuiz(false); setStars(0); setFollowUpReply(null); }

  async function handleFollowUp(question: string) {
    setFollowUpLoading(true); setFollowUpReply(null); setFollowUpStreaming(true);
    try {
      const res = await fetch("/api/chemistry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ experimentName: experiment?.name || "", scientist: experiment?.scientist || "", question }) });
      if (!res.ok) { setFollowUpReply("😢 哎呀，出了点小问题～"); setFollowUpLoading(false); setFollowUpStreaming(false); return; }
      const reader = res.body?.getReader(); if (!reader) { setFollowUpLoading(false); return; }
      const decoder = new TextDecoder(); let full = ""; setFollowUpReply("");
      while (true) { const { done, value } = await reader.read(); if (done) break; const lines = decoder.decode(value, { stream: true }).split("\n"); for (const line of lines) { if (!line.startsWith("data: ")) continue; try { const p = JSON.parse(line.slice(6)); if (p.error) { setFollowUpStreaming(false); break; } if (p.done) { setFollowUpStreaming(false); full = p.full || full; } else if (p.delta) { full += p.delta; setFollowUpReply(full); } } catch { /* skip */ } } }
      setFollowUpStreaming(false);
    } catch { setFollowUpReply("😢 网络好像走丢了～"); } finally { setFollowUpLoading(false); setFollowUpStreaming(false); }
  }

  if (!experiment) return <div className="max-w-3xl mx-auto px-6 py-12 text-center"><p className="text-[#B0A0C0] text-[14px] font-medium">实验未找到</p></div>;

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[11px] tracking-[0.12em] text-[#B0A0C0] mb-8 font-medium">🧪 课程 / 化学 / {experiment.name}</p>
        <div className="mb-2"><h2 className="text-[40px] md:text-[48px] font-[900] tracking-[0.04em] leading-[1.1] text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>{experiment.name}</h2>
          <div className="flex items-center gap-2 mt-1"><p className="text-[15px] font-medium text-[#B0A0C0]">👨‍🔬 {experiment.scientist}</p>{experiment.difficulty && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: ACCENT, background: `${ACCENT}15` }}>{experiment.difficulty}</span>}</div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push("/chemistry")} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-bold bg-white border-2 border-[#E8E0F0] text-[#6B6B7B] hover:border-[#D0C0F0] transition-all"><ArrowLeft className="w-3.5 h-3.5" /> 返回</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-bold bg-white border-2 border-[#E8E0F0] text-[#6B6B7B] hover:border-[#D0C0F0] transition-all"><RotateCcw className="w-3.5 h-3.5" /> 重新实验</motion.button>
          {stars > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">{Array.from({ length: Math.min(stars, 5) }).map((_, i) => (<span key={i} className="animate-twinkle text-lg" style={{ animationDelay: `${i * 0.2}s` }}>🌟</span>))}</motion.span>}
        </div>

        <ExperimentGuide experimentId={experimentId} accentColor={ACCENT} />

        {/* 外部实验链接 — 美观的跳转入口 */}
        {experiment.url && (
          <motion.a
            href={experiment.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 block bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#D0C0F0] transition-all group"
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                style={{ background: `${ACCENT}15` }}
              >
                🧪
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#3D3D4E] tracking-[0.03em]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
                  在虚拟实验室中操作
                </p>
                <p className="text-[12px] text-[#8B8B9B] mt-0.5 truncate flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 flex-shrink-0" style={{ color: ACCENT }} />
                  <span>{experiment.url.replace(/^https?:\/\//, "")}</span>
                </p>
              </div>
              <div
                className="shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all group-hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}99)`, boxShadow: `0 2px 8px ${ACCENT}30` }}
              >
                开始实验 →
              </div>
            </div>
          </motion.a>
        )}



        <div className="mt-6">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={loadExperiment} disabled={loading}
            className="w-full bg-white border-2 border-[#E8E0F0] rounded-2xl px-8 py-4 text-[14px] font-bold transition-all hover:border-[#D0C0F0] hover:shadow-lg flex items-center justify-center gap-3"
            style={{ color: ACCENT, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
            <Sparkles className="w-5 h-5" />{loading ? "🤖 AI 老师正在分析..." : aiGuided ? "🔄 再问一次 AI 老师" : "🤖 遇到困难？点击我，我来教你做实验~"}
          </motion.button>
        </div>

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && !loading && (
          <div className="mt-6">
            <StructuredGuidance content={result} accentColor={ACCENT} streaming={streaming} />
            {!showSummary && <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowSummary(true)} className="mt-4 w-full py-3 rounded-2xl text-[13px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}99)`, boxShadow: `0 3px 12px ${ACCENT}30` }}>📊 查看实验小结</motion.button>}
          </div>
        )}

        {showSummary && <ExperimentSummary experimentId={experimentId} accentColor={ACCENT} />}
        {showSummary && !showQuiz && <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowQuiz(true)} className="mt-4 w-full py-3 rounded-2xl text-[13px] font-bold border-2" style={{ borderColor: ACCENT, color: ACCENT }}>🧠 来做两道小测验吧！</motion.button>}
        {showQuiz && <ExperimentQuiz experimentId={experimentId} accentColor={ACCENT} onStarEarned={() => setStars((s) => Math.min(5, s + 1))} />}
        <FollowUpQuestions subject="chemistry" accentColor={ACCENT} onAsk={handleFollowUp} loading={followUpLoading} reply={followUpReply} streaming={followUpStreaming} />
        {error && <ErrorToast message={error.message} code={error.code} onRetry={loadExperiment} onDismiss={() => setError(null)} />}
      </div>
    </div>
  );
}
