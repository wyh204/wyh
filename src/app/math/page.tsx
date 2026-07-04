"use client";
import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Calculator, Send, Loader2 } from "lucide-react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import MathImageUpload from "@/components/math/MathImageUpload";
import MathStructuredResponse from "@/components/math/MathStructuredResponse";
import type { HistoryItem } from "@/types";
import { useHistory } from "@/hooks/useHistory";

/* ===================================================
   主题色 — 数学天蓝
   =================================================== */
const ACCENT = "#5BA4E6";

/* ===================================================
   学生友好提示文案
   =================================================== */
const KID_FRIENDLY = {
  loadingText: "🤖 AI 小老师正在认真解题，马上就好～",
  imageLoading: "🔍 AI 小老师正在看图片，帮小同学识别题目中...",
  errorDefault: "😢 哎呀，出了点小问题，请再试一次吧～",
  errorNetwork: "😢 哎呀，网络好像走丢了，请检查网络后重试～",
  emptyHint: "📐 在下方输入数学题目，或点击相机按钮拍照搜题～",
};

/* ===================================================
   数学学习主页
   =================================================== */
export default function MathPage() {
  // ─── 文本输入状态 ───
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(KID_FRIENDLY.loadingText);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { save, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const lastInputRef = useRef("");

  // ─── 图片相关状态 ───
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);

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
    setRecognizedText(null);
    setIsImageMode(false);

    try {
      const res = await fetch("/api/math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) {
        try {
          const json = await res.json();
          setError({ message: json.error, code: json.code });
        } catch { setError({ message: KID_FRIENDLY.errorNetwork }); }
        setLoading(false);
        return;
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
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError({ message: parsed.error });
              setStreaming(false);
              break;
            }
            if (parsed.done) {
              setStreaming(false);
              fullText = parsed.full || fullText;
            } else if (parsed.delta) {
              fullText += parsed.delta;
              setResult(fullText);
            }
          } catch { /* skip */ }
        }
      }
      setStreaming(false);

      const item = save("math", text, fullText);
      setCurrentItem(item);
    } catch {
      setError({ message: KID_FRIENDLY.errorNetwork });
    } finally {
      setLoading(false);
    }
  }, [input, loading, save]);

  // ═══════════════════════════════════════════════
  // 图片提交 — 拍照搜题
  // ═══════════════════════════════════════════════
  const handleImageSubmit = useCallback(async (base64: string, fileName: string) => {
    setLoading(true);
    setLoadingText(KID_FRIENDLY.imageLoading);
    setError(null);
    setResult(null);
    setRecognizedText(null);
    setIsImageMode(true);

    try {
      const res = await fetch("/api/math/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, hint: input.trim() || undefined }),
      });

      if (!res.ok) {
        try {
          const json = await res.json();
          setError({ message: json.error, code: json.code });
        } catch {
          setError({ message: "😢 哎呀，题目有点模糊，再拍一次试试吧～" });
        }
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setLoading(false); return; }

      const decoder = new TextDecoder();
      let fullText = "";

      // 先获取识别的题目
      let recognizedDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError({ message: "😢 哎呀，题目有点模糊，再拍一次试试吧～" });
              setLoading(false);
              return;
            }
            if (parsed.done) {
              fullText = parsed.full || fullText;
              const text = parsed.recognizedText || fullText;
              setRecognizedText(text);
              recognizedDone = true;

              // 识别完成后，自动用识别的题目调用解题 API
              const item = save("math", `[📷拍照] ${text}`, "");
              setCurrentItem(item);
              lastInputRef.current = text;

              // 调用文本解题
              await fetchAndSolve(text);
            } else if (parsed.delta && !recognizedDone) {
              fullText += parsed.delta;
            }
          } catch { /* skip */ }
        }
      }

      if (!recognizedDone && fullText) {
        setRecognizedText(fullText);
        lastInputRef.current = fullText;
        await fetchAndSolve(fullText);
      }
    } catch {
      setError({ message: KID_FRIENDLY.errorNetwork });
      setLoading(false);
    }
  }, [input, save]);

  // ═══════════════════════════════════════════════
  // 用识别到的文字调用数学解题 API
  // ═══════════════════════════════════════════════
  async function fetchAndSolve(question: string) {
    setLoadingText(KID_FRIENDLY.loadingText);
    setStreaming(true);
    setResult("");

    try {
      const res = await fetch("/api/math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

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
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setStreaming(false);
              break;
            }
            if (parsed.done) {
              setStreaming(false);
              fullText = parsed.full || fullText;
            } else if (parsed.delta) {
              fullText += parsed.delta;
              setResult(fullText);
            }
          } catch { /* skip */ }
        }
      }
      setStreaming(false);

      const item = save("math", `[📷拍照] ${question}`, fullText);
      setCurrentItem(item);
    } catch {
      /* 解题过程已在 handleImageSubmit 中处理 */
    } finally {
      setLoading(false);
    }
  }

  // ═══════════════════════════════════════════════
  // 键盘事件
  // ═══════════════════════════════════════════════
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  }

  const showResult = result && currentItem;

  // ═══════════════════════════════════════════════
  // 渲染
  // ═══════════════════════════════════════════════
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      {/* ─── 背景卡通剪影 ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        <span className="absolute text-[120px] top-[5%] left-[3%] select-none">🧮</span>
        <span className="absolute text-[100px] top-[25%] right-[5%] select-none">📐</span>
        <span className="absolute text-[80px] top-[55%] left-[8%] select-none">🔢</span>
        <span className="absolute text-[90px] top-[70%] right-[8%] select-none">📊</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 relative z-10">
        {/* ─── 面包屑 ─── */}
        <p className="text-[11px] tracking-[0.12em] text-[#B0A0C0] mb-8 font-medium">🧮 课程 / 数 学</p>

        {/* ─── 标题区 ─── */}
        <div className="mb-2">
          <h2
            className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-[#3D3D4E]"
            style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
          >
            数 学
          </h2>
          <p className="text-[16px] font-medium tracking-[0.02em] text-[#B0A0C0] mt-1">Math</p>
        </div>
        <p className="text-[15px] text-[#6B6B7B] tracking-[0.03em] mb-4 max-w-[420px] font-medium">
          智能解题 · 拍照搜题 · 步骤拆解 · 考点分析
        </p>

        {/* ─── 快捷提示 ─── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: "➕", label: "四则运算", prompt: "帮我讲解一道四则混合运算题" },
            { icon: "📐", label: "几何图形", prompt: "帮我分析一道几何图形题" },
            { icon: "📊", label: "应用题", prompt: "帮我解一道应用题" },
            { icon: "🔢", label: "分数小数", prompt: "帮我讲解分数和小数的运算方法" },
          ].map((item) => (
            <motion.button
              key={item.label}
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInput(item.prompt);
                // 不自动提交，让用户确认
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-bold tracking-[0.04em]
                         bg-white border-2 border-[#E8E0F0] text-[#4D4D5E]
                         hover:border-[#A0C8F0] hover:text-[#5BA4E6] hover:bg-[#EBF4FF]
                         transition-all duration-200 shadow-sm"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* ─── 输入区：拍照按钮 + 输入框 + 发送按钮 ─── */}
        <div className="flex gap-2 items-stretch">
          {/* 📷 拍照搜题按钮 */}
          <MathImageUpload
            accentColor={ACCENT}
            onImageSubmit={handleImageSubmit}
            disabled={loading}
          />

          {/* 输入框 */}
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入题目，或点击相机图标拍照搜题 📷"
              disabled={loading}
              maxLength={500}
              rows={1}
              className="w-full h-full bg-white border-2 border-[#E8E0F0] rounded-2xl px-5 py-3.5
                         text-[#3D3D4E] placeholder-[#B0A0C0]
                         focus:outline-none focus:border-[#A0C8F0] focus:shadow-[0_0_0_4px_rgba(91,164,230,0.1)]
                         resize-none transition-all duration-200 text-[14px] tracking-[0.02em] font-medium"
            />
          </div>

          {/* 发送按钮 */}
          <motion.button
            type="button"
            onClick={() => handleTextSubmit()}
            disabled={loading || !input.trim()}
            whileHover={{ scale: loading ? 1 : 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 px-6 rounded-2xl font-bold text-[13px] tracking-[0.06em] flex items-center gap-2 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed text-white"
            style={{
              background: loading ? `${ACCENT}99` : `linear-gradient(135deg, ${ACCENT}, #7CC0F0)`,
              boxShadow: `0 4px 16px ${ACCENT}40`,
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            发 送
          </motion.button>
        </div>

        {/* ─── 正在识别提示 ─── */}
        {loading && isImageMode && (
          <div className="mt-3 flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: ACCENT }} />
            <span className="text-[11px] text-[#B0A0C0] font-medium">{loadingText}</span>
          </div>
        )}

        {/* ─── 加载状态 ─── */}
        {loading && (
          <div className="mt-8">
            <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6 mb-4 text-center">
              <motion.span
                className="text-4xl inline-block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🧮
              </motion.span>
              <p className="text-[14px] text-[#6B6B7B] font-medium mt-2">{loadingText}</p>
            </div>
            <SkeletonLoader />
          </div>
        )}

        {/* ─── AI 回答 — 结构化数学解析 ─── */}
        {showResult && !loading && (
          <div className="mt-8">
            <MathStructuredResponse
              content={result}
              accentColor={ACCENT}
              recognizedText={recognizedText}
            />

            {/* 操作按钮 */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                }}
                className="text-[11px] text-[#9999AA] hover:text-[#6B6B7B] font-medium transition-colors"
              >
                📋 复制答案
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentItem) toggleFavorite(currentItem);
                }}
                className={`text-[11px] font-medium transition-colors ${
                  currentItem && favorites.some((f) => f.id === currentItem.id)
                    ? "text-red-500"
                    : "text-[#9999AA] hover:text-red-400"
                }`}
              >
                {currentItem && favorites.some((f) => f.id === currentItem.id) ? "❤️ 已收藏" : "🤍 收藏"}
              </button>
            </div>
          </div>
        )}

        {/* ─── 错误提示 ─── */}
        {error && (
          <ErrorToast
            message={error.message}
            code={error.code}
            onRetry={lastInputRef.current ? () => handleTextSubmit(lastInputRef.current) : undefined}
            onDismiss={() => setError(null)}
          />
        )}

        {/* ─── 空状态 ─── */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 bg-white border-2 border-[#E8E0F0] rounded-2xl p-8 text-center"
          >
            <motion.span
              className="text-5xl inline-block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🧮
            </motion.span>
            <p className="text-[16px] font-bold text-[#4D4D5E] mt-3" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
              {isImageMode ? "拍照识别完成后，答案会出现在这里哦～" : "在下方输入数学题目，或点击相机按钮拍照搜题～"}
            </p>
            <p className="text-[13px] text-[#B0A0C0] mt-2">
              {isImageMode
                ? "AI 小老师正在努力识别题目中..."
                : "支持四则运算、几何图形、应用题、方程式等各类题型 📐"
              }
            </p>
            <div className="flex justify-center gap-3 mt-4 text-[11px] text-[#B0A0C0]">
              <span>📷 拍照搜题</span>
              <span>·</span>
              <span>✏️ 手动输入</span>
              <span>·</span>
              <span>📝 步骤拆解</span>
              <span>·</span>
              <span>⚠️ 易错提醒</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
