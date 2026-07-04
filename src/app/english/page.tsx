"use client";
import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ModeSelector from "@/components/shared/ModeSelector";
import HookList from "@/components/shared/HookList";
import EnglishImageUpload from "@/components/english/EnglishImageUpload";
import EnglishStructuredResponse from "@/components/english/EnglishStructuredResponse";
import type { EnglishMode, HistoryItem, EssayHook } from "@/types";
import { useHistory } from "@/hooks/useHistory";

/* ===================================================
   主题色 — 英语草绿
   =================================================== */
const ACCENT = "#6DBE6D";

/* ===================================================
   模式选项
   =================================================== */
const modeOptions = [
  { value: "grammar" as const, label: "📖 语法指导" },
  { value: "essay" as const, label: "✍️ 作文指导" },
];

/* ===================================================
   学生友好提示文案
   =================================================== */
const KID_FRIENDLY = {
  loadingText: "🤖 AI 小老师正在认真分析，马上就好～",
  imageLoading: "🔍 AI 小老师正在看图片，帮小同学识别内容中...",
  errorDefault: "😢 哎呀，出了点小问题，请再试一次吧～",
  errorNetwork: "😢 哎呀，网络好像走丢了，请检查网络后重试～",
  errorBlurry: "😢 哎呀，图片有点模糊，再拍一次试试吧～",
  emptyHint: "🌍 输入英文句子/单词，或点击相机按钮拍照识别～",
  starReward: "🌟 太棒了！你又学会了一个新知识～",
};

/* ===================================================
   快捷提示按钮
   =================================================== */
const QUICK_HINTS = [
  { icon: "📝", label: "语法讲解", prompt: "请讲解一般现在时的用法，用大白话解释" },
  { icon: "🔤", label: "单词学习", prompt: "请讲解单词 beautiful 的发音、释义、例句和记忆技巧" },
  { icon: "📖", label: "句子翻译", prompt: "请翻译句子：I have a dream that one day all children can go to school." },
  { icon: "⚠️", label: "常见错误", prompt: "请列举初中生学英语时最容易犯的5个语法错误" },
];

export default function EnglishPage() {
  // ─── 状态 ───
  const [mode, setMode] = useState<EnglishMode>("grammar");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(KID_FRIENDLY.loadingText);
  const [result, setResult] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [outline, setOutline] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { save, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const lastInputRef = useRef("");

  // ─── 图片相关状态 ───
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);

  // ─── 星星奖励 ───
  const [stars, setStars] = useState(0);

  // ═══════════════════════════════════════════════
  // 文本提交
  // ═══════════════════════════════════════════════
  const handleTextSubmit = useCallback(async (questionText?: string) => {
    const text = questionText || input.trim();
    if (!text || loading) return;

    lastInputRef.current = text;
    setLoading(true);
    setLoadingText(KID_FRIENDLY.loadingText);
    setError(null);
    setResult(null);
    setHooks(null);
    setOutline(null);
    setGuidance(null);
    setRecognizedText(null);
    setIsImageMode(false);

    try {
      const res = await fetch("/api/english", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input: text }),
      });

      if (!res.ok) {
        try { const json = await res.json(); setError({ message: json.error, code: json.code }); }
        catch { setError({ message: KID_FRIENDLY.errorNetwork }); }
        setLoading(false); return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setLoading(false); return; }

      const decoder = new TextDecoder();
      let fullText = "";
      setResult("");
      setStreaming(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.error) { setError({ message: parsed.error }); setStreaming(false); break; }
            if (parsed.done) { setStreaming(false); fullText = parsed.full || fullText; }
            else if (parsed.delta) { fullText += parsed.delta; setResult(fullText); }
          } catch { /* skip */ }
        }
      }
      setStreaming(false);

      if (mode === "essay") {
        try {
          const parsed = JSON.parse(fullText);
          if (parsed.outline) setOutline(parsed.outline);
          if (parsed.guidance) setGuidance(parsed.guidance);
          if (parsed.hooks?.length) setHooks(parsed.hooks);
        } catch { /* not JSON */ }
      }

      const item = save("english", text, fullText, mode);
      setCurrentItem(item);
      setStars((s) => Math.min(10, s + 1));
    } catch { setError({ message: KID_FRIENDLY.errorNetwork }); }
    finally { setLoading(false); }
  }, [input, loading, mode, save]);

  // ═══════════════════════════════════════════════
  // 图片提交 — 拍照识别
  // ═══════════════════════════════════════════════
  const handleImageSubmit = useCallback(async (base64: string, fileName: string) => {
    setLoading(true);
    setLoadingText(KID_FRIENDLY.imageLoading);
    setError(null);
    setResult(null);
    setRecognizedText(null);
    setOutline(null);
    setGuidance(null);
    setHooks(null);
    setIsImageMode(true);

    try {
      const res = await fetch("/api/english/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mode }),
      });

      if (!res.ok) {
        try { const json = await res.json(); setError({ message: json.error, code: json.code }); }
        catch { setError({ message: KID_FRIENDLY.errorBlurry }); }
        setLoading(false); return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setLoading(false); return; }

      const decoder = new TextDecoder();
      let fullText = "";
      let recognizedDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.error) { setError({ message: KID_FRIENDLY.errorBlurry }); setLoading(false); return; }
            if (parsed.done) {
              fullText = parsed.full || fullText;
              const text = parsed.recognizedText || fullText;
              setRecognizedText(text);
              recognizedDone = true;
              lastInputRef.current = text;
              save("english", `[📷拍照] ${text.slice(0, 40)}`, "");
              await fetchAndAnalyze(text);
            } else if (parsed.delta && !recognizedDone) {
              fullText += parsed.delta;
            }
          } catch { /* skip */ }
        }
      }

      if (!recognizedDone && fullText) {
        setRecognizedText(fullText);
        lastInputRef.current = fullText;
        await fetchAndAnalyze(fullText);
      }
    } catch { setError({ message: KID_FRIENDLY.errorNetwork }); setLoading(false); }
  }, [mode, save]);

  // ═══════════════════════════════════════════════
  // 用识别到的文字调用英语分析 API
  // ═══════════════════════════════════════════════
  async function fetchAndAnalyze(text: string) {
    setLoadingText(KID_FRIENDLY.loadingText);
    setStreaming(true);
    setResult("");

    try {
      const res = await fetch("/api/english", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input: text }),
      });

      if (!res.ok) { setLoading(false); return; }
      const reader = res.body?.getReader();
      if (!reader) { setLoading(false); return; }

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.error) { setStreaming(false); break; }
            if (parsed.done) { setStreaming(false); fullText = parsed.full || fullText; }
            else if (parsed.delta) { fullText += parsed.delta; setResult(fullText); }
          } catch { /* skip */ }
        }
      }
      setStreaming(false);

      const item = save("english", `[📷拍照] ${text.slice(0, 40)}`, fullText, mode);
      setCurrentItem(item);
      setStars((s) => Math.min(10, s + 1));
    } catch { /* handled upstream */ }
    finally { setLoading(false); }
  }

  // ═══════════════════════════════════════════════
  // 键盘事件
  // ═══════════════════════════════════════════════
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTextSubmit(); }
  }

  // ═══════════════════════════════════════════════
  // 渲染
  // ═══════════════════════════════════════════════
  const showResult = result && currentItem;

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      {/* 背景卡通剪影 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        <span className="absolute text-[120px] top-[5%] left-[3%] select-none">🌍</span>
        <span className="absolute text-[90px] top-[25%] right-[5%] select-none">🔤</span>
        <span className="absolute text-[80px] top-[55%] left-[8%] select-none">📖</span>
        <span className="absolute text-[100px] top-[70%] right-[8%] select-none">✏️</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 relative z-10">
        {/* 面包屑 */}
        <p className="text-[11px] tracking-[0.12em] text-[#B0A0C0] mb-8 font-medium">🌍 课程 / 英 语</p>

        {/* 标题区 */}
        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>英 语</h2>
          <p className="text-[16px] font-medium tracking-[0.02em] text-[#B0A0C0] mt-1">English</p>
        </div>
        <p className="text-[15px] text-[#6B6B7B] tracking-[0.03em] mb-2 max-w-[450px] font-medium">
          语法精讲 · 作文指导 · 拍照识别 · 单词记忆
        </p>

        {/* 星星奖励 */}
        {stars > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-white border-2 border-[#E8E0F0] rounded-2xl shadow-sm">
            <span className="text-[12px] font-bold text-[#6B6B7B]">学习奖励：</span>
            {Array.from({ length: Math.min(stars, 10) }).map((_, i) => (
              <motion.span key={i} className="text-lg" initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}>🌟</motion.span>
            ))}
            <span className="text-[11px] text-[#B0A0C0] font-medium ml-1">×{stars}</span>
          </motion.div>
        )}

        {/* 快捷提示 */}
        <div className="flex flex-wrap gap-2 mb-5">
          {QUICK_HINTS.map((item) => (
            <motion.button key={item.label} type="button" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setInput(item.prompt); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-bold tracking-[0.04em]
                         bg-white border-2 border-[#E8E0F0] text-[#4D4D5E]
                         hover:border-[#B8E0B8] hover:text-[#6DBE6D] hover:bg-[#EDF8ED]
                         transition-all duration-200 shadow-sm">
              <span className="text-base">{item.icon}</span>{item.label}
            </motion.button>
          ))}
        </div>

        {/* 模式选择 */}
        <ModeSelector options={modeOptions} value={mode} onChange={setMode} />

        {/* 输入区：📷拍照 + 输入框 + 发送 */}
        <div className="flex gap-2 items-stretch mt-6">
          <EnglishImageUpload accentColor={ACCENT} onImageSubmit={handleImageSubmit} disabled={loading} />

          <div className="flex-1">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="输入英文句子/单词，或点击相机图标拍照搜题 📷"
              disabled={loading} maxLength={500} rows={1}
              className="w-full h-full bg-white border-2 border-[#E8E0F0] rounded-2xl px-5 py-3.5
                         text-[#3D3D4E] placeholder-[#B0A0C0]
                         focus:outline-none focus:border-[#B8E0B8] focus:shadow-[0_0_0_4px_rgba(109,190,109,0.1)]
                         resize-none transition-all duration-200 text-[14px] tracking-[0.02em] font-medium" />
          </div>

          <motion.button type="button" onClick={() => handleTextSubmit()}
            disabled={loading || !input.trim()}
            whileHover={{ scale: loading ? 1 : 1.08 }} whileTap={{ scale: 0.95 }}
            className="shrink-0 px-6 rounded-2xl font-bold text-[13px] tracking-[0.06em] flex items-center gap-2 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed text-white"
            style={{ background: loading ? `${ACCENT}99` : `linear-gradient(135deg, ${ACCENT}, #90D890)`, boxShadow: `0 4px 16px ${ACCENT}40` }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}发 送
          </motion.button>
        </div>

        {/* ─── 加载状态 ─── */}
        {loading && (
          <div className="mt-8">
            <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6 mb-4 text-center">
              <motion.span className="text-4xl inline-block" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🌍</motion.span>
              <p className="text-[14px] text-[#6B6B7B] font-medium mt-2">{loadingText}</p>
            </div>
            <SkeletonLoader />
          </div>
        )}

        {/* ─── 结构化英语解析 ─── */}
        {showResult && !loading && (
          <div className="mt-8">
            <EnglishStructuredResponse content={result} accentColor={ACCENT} recognizedText={recognizedText} />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button type="button" onClick={() => navigator.clipboard.writeText(result)}
                className="text-[11px] text-[#9999AA] hover:text-[#6B6B7B] font-medium transition-colors">📋 复制答案</button>
              <button type="button" onClick={() => { if (currentItem) toggleFavorite(currentItem); }}
                className={`text-[11px] font-medium transition-colors ${currentItem && favorites.some((f) => f.id === currentItem.id) ? "text-red-500" : "text-[#9999AA] hover:text-red-400"}`}>
                {currentItem && favorites.some((f) => f.id === currentItem.id) ? "❤️ 已收藏" : "🤍 收藏"}
              </button>
            </div>
          </div>
        )}

        {/* ─── 大纲 (作文模式) ─── */}
        {outline && !isImageMode && (
          <div className="mt-6">
            <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6" style={{ ["--accent-color" as string]: ACCENT }}>
              <h3 className="text-[13px] tracking-[0.1em] font-bold mb-3" style={{ color: ACCENT }}>📝 作文大纲</h3>
              <div className="markdown-body text-[14px] text-[#4D4D5E]" style={{ ["--accent-color" as string]: ACCENT }}>{outline}</div>
            </div>
          </div>
        )}

        {guidance && !isImageMode && (
          <div className="mt-4">
            <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6" style={{ ["--accent-color" as string]: ACCENT }}>
              <h3 className="text-[13px] tracking-[0.1em] font-bold mb-3" style={{ color: ACCENT }}>✏️ 写作指导</h3>
              <div className="markdown-body text-[14px] text-[#4D4D5E]" style={{ ["--accent-color" as string]: ACCENT }}>{guidance}</div>
            </div>
          </div>
        )}

        {hooks && <div className="mt-6"><HookList hooks={hooks} /></div>}

        {/* ─── 错误提示 ─── */}
        {error && <ErrorToast message={error.message} code={error.code}
          onRetry={lastInputRef.current ? () => handleTextSubmit(lastInputRef.current) : undefined}
          onDismiss={() => setError(null)} />}

        {/* ─── 空状态 ─── */}
        {!result && !loading && !error && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-10 bg-white border-2 border-[#E8E0F0] rounded-2xl p-8 text-center">
            <motion.span className="text-5xl inline-block" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>🌍</motion.span>
            <p className="text-[16px] font-bold text-[#4D4D5E] mt-3" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
              输入英文内容，或点击相机拍照识别～
            </p>
            <p className="text-[13px] text-[#B0A0C0] mt-2">
              支持单词学习、句子翻译、语法讲解和作文批改 📖
            </p>
            <div className="flex justify-center gap-3 mt-4 text-[11px] text-[#B0A0C0]">
              <span>📷 拍照识别</span><span>·</span>
              <span>🔤 单词学习</span><span>·</span>
              <span>📖 语法分析</span><span>·</span>
              <span>✍️ 作文指导</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
