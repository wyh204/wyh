"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ResultCard from "@/components/shared/ResultCard";
import StructuredGuidance from "@/components/shared/StructuredGuidance";
import FollowUpQuestions from "@/components/shared/FollowUpQuestions";
import ModeSelector from "@/components/shared/ModeSelector";
import InputPanel from "@/components/shared/InputPanel";
import HookList from "@/components/shared/HookList";
// ─── 新增组件 ───
import QuickActions from "@/components/yuwen/QuickActions";
import StructuredYuwenResponse from "@/components/yuwen/StructuredYuwenResponse";
import ReadingButton from "@/components/yuwen/ReadingButton";
import ProgressBar from "@/components/yuwen/ProgressBar";
import FunExtension from "@/components/yuwen/FunExtension";
import NotesSidebar from "@/components/yuwen/NotesSidebar";
import type { YuwenMode, HistoryItem, EssayHook } from "@/types";
import { useHistory } from "@/hooks/useHistory";

/* ===================================================
   主题色 — 语文暖橙
   =================================================== */
const ACCENT = "#FF7B5C";

/* ===================================================
   学习模式选项 — 新增「趣味拓展」
   =================================================== */
const modeOptions = [
  { value: "modern" as const, label: "📖 现代文学" },
  { value: "classical" as const, label: "📜 古文学习" },
  { value: "essay" as const, label: "✍️ 作文 HELP" },
  { value: "fun" as const, label: "🎪 趣味拓展" },
];

/* ===================================================
   引导性 placeholder 文案
   =================================================== */
function getPlaceholder(mode: YuwenMode): string {
  switch (mode) {
    case "modern":
      return "输入课文题目或问题，比如：《春》的重点段落赏析 ✨";
    case "classical":
      return "输入古文篇名或问题，比如：《岳阳楼记》的经典段落释义 📜";
    case "essay":
      return "输入作文主题，比如：写一篇关于「成长」的作文 🌸";
    case "fun":
      return "在下方趣味拓展中探索课文背后的故事吧～ 🎪";
    default:
      return "输入你想了解的语文知识...";
  }
}

/* ===================================================
   学生友好提示文案
   =================================================== */
const KID_FRIENDLY = {
  loading: {
    modern: "🤖 AI 小助手正在认真阅读课文，马上就好～",
    classical: "🤖 AI 小助手正在翻阅古籍，请稍等片刻～",
    essay: "🤖 AI 小助手正在构思作文灵感，马上回来～",
    fun: "🤖 AI 小助手正在准备趣味内容～",
  },
  error: {
    network: "😢 哎呀，网络好像走丢了，请检查网络后重试～",
    timeout: "⏰ 小助手想得太久了，请稍后再试一次吧～",
    default: "😢 出了点小问题，请再试一次吧～",
  },
};

function getKidFriendlyError(code?: string): string {
  if (code === "TIMEOUT") return KID_FRIENDLY.error.timeout;
  if (code === "NO_API_KEY") return "🔑 老师还没有设置AI小助手的钥匙，请联系老师～";
  return KID_FRIENDLY.error.default;
}

/* ===================================================
   语文学习主页
   =================================================== */
export default function YuwenPage() {
  // ─── 状态 ───
  const [mode, setMode] = useState<YuwenMode>("modern");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { save, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const lastInputRef = useRef("");

  // ─── 新增状态 ───
  const [notesOpen, setNotesOpen] = useState(false);
  const [charTooltipEnabled, setCharTooltipEnabled] = useState(false);
  const [currentTextTitle, setCurrentTextTitle] = useState<string | undefined>();
  const [progress, setProgress] = useState({ total: 5, completed: 0, stars: 0 });
  const [notesCount, setNotesCount] = useState(0);
  const [followUpReply, setFollowUpReply] = useState<string | null>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpStreaming, setFollowUpStreaming] = useState(false);

  // SSR 安全的笔记计数
  useEffect(() => {
    try {
      const raw = localStorage.getItem("yuwen_study_notes");
      setNotesCount(raw ? JSON.parse(raw).length : 0);
    } catch { setNotesCount(0); }
  }, [notesOpen]);

  // ═══════════════════════════════════════════════
  // 提交处理
  // ═══════════════════════════════════════════════
  const handleSubmit = useCallback(async (input: string) => {
    lastInputRef.current = input;
    setLoading(true);
    setError(null);
    setResult(null);
    setHooks(null);

    // 更新当前学习的课文名
    if (input.length < 30) setCurrentTextTitle(input);
    else setCurrentTextTitle(input.slice(0, 30) + "...");

    try {
      const res = await fetch("/api/yuwen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });

      if (!res.ok) {
        try {
          const json = await res.json();
          setError({ message: getKidFriendlyError(json.code), code: json.code });
        } catch { setError({ message: KID_FRIENDLY.error.network }); }
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
              setError({ message: getKidFriendlyError(), code: parsed.error });
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
          } catch { /* skip unparseable */ }
        }
      }
      setStreaming(false);

      // 作文模式：解析 hooks — 兼容两种格式
      // 格式A: [{"hookText":...,"styleTag":...}, ...]  直接数组
      // 格式B: {"hooks": [{"hookText":...,"styleTag":...}, ...]}  对象包裹
      if (mode === "essay") {
        try {
          const parsed = JSON.parse(fullText);
          let extractedHooks = null;
          if (Array.isArray(parsed) && parsed.length > 0) {
            extractedHooks = parsed;  // ✅ 直接数组格式
          } else if (parsed.hooks?.length) {
            extractedHooks = parsed.hooks;  // ✅ 对象包裹格式
          }
          if (extractedHooks) {
            setHooks(extractedHooks);
            setResult(null);  // 清掉JSON，只让HookList展示
          }
        } catch { /* not JSON, keep as raw result */ }
      }

      const item = save("yuwen", input, fullText, mode);
      setCurrentItem(item);

      // 更新学习进度
      setProgress((prev) => ({
        ...prev,
        completed: Math.min(prev.total, prev.completed + 1),
        stars: Math.min(5, prev.stars + (prev.completed < prev.total ? 1 : 0)),
      }));
    } catch {
      setError({ message: KID_FRIENDLY.error.network });
    } finally {
      setLoading(false);
    }
  }, [mode, save]);

  // ═══════════════════════════════════════════════
  // 快捷提问
  // ═══════════════════════════════════════════════
  function handleQuickAction(prompt: string) {
    // 设置输入后自动提交
    lastInputRef.current = prompt;
    setCurrentTextTitle(prompt.slice(0, 30) + "...");
    handleSubmit(prompt);
  }

  // ═══════════════════════════════════════════════
  // 渲染
  // ═══════════════════════════════════════════════
  const showQuickActions = mode !== "fun" && !result && !loading;
  const showResult = result && currentItem;
  const isEssayMode = mode === "essay";
  const isFunMode = mode === "fun";

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      {/* ─── 背景卡通剪影装饰 ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        <span className="absolute text-[120px] top-[5%] left-[3%] select-none">📚</span>
        <span className="absolute text-[100px] top-[20%] right-[5%] select-none">✏️</span>
        <span className="absolute text-[90px] top-[50%] left-[8%] select-none">📖</span>
        <span className="absolute text-[80px] top-[65%] right-[8%] select-none">🌟</span>
        <span className="absolute text-[70px] top-[80%] left-[15%] select-none">📝</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 relative z-10">
        {/* ─── 面包屑 ─── */}
        <p className="text-[11px] tracking-[0.12em] text-[#B0A0C0] mb-8 font-medium">📚 课程 / 语 文</p>

        {/* ─── 标题区 ─── */}
        <div className="mb-2">
          <h2
            className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-[#3D3D4E]"
            style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
          >
            语 文
          </h2>
          <p className="text-[16px] font-medium tracking-[0.02em] text-[#B0A0C0] mt-1">Chinese</p>
        </div>
        <p className="text-[15px] text-[#6B6B7B] tracking-[0.03em] mb-3 max-w-[420px] font-medium">
          现代文学鉴赏 · 古文精读 · 作文辅导 · 趣味拓展
        </p>

        {/* ─── 学习进度条 + 笔记按钮 ─── */}
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-1">
            <ProgressBar
              totalSections={progress.total}
              completedSections={progress.completed}
              stars={progress.stars}
              accentColor={ACCENT}
              textTitle={currentTextTitle}
            />
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotesOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#E8E0F0] text-[12px] font-bold text-[#6B6B7B] hover:border-[#FFB09C] hover:text-[#FF7B5C] transition-all duration-200 shadow-sm"
          >
            <Bookmark className="w-4 h-4" />
            ✏️ 笔记
            <span className="bg-[#FFF0EB] text-[#FF7B5C] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {notesCount}
            </span>
          </motion.button>
        </div>

        {/* ─── 模式选择 ─── */}
        <ModeSelector options={modeOptions} value={mode} onChange={setMode} />

        {/* ─── 输入区 / 快捷提问 ─── */}
        {!isFunMode && (
          <div className="mt-6">
            {/* 快捷提问按钮 */}
            {showQuickActions && (
              <QuickActions onSelect={handleQuickAction} />
            )}

            {/* 输入框 */}
            <InputPanel
              placeholder={getPlaceholder(mode)}
              onSubmit={handleSubmit}
              loading={loading}
              accentColor={ACCENT}
            />
          </div>
        )}

        {/* ─── 生字高亮开关 ─── */}
        {showResult && !isEssayMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mt-6 flex-wrap"
          >
            <button
              type="button"
              onClick={() => setCharTooltipEnabled(!charTooltipEnabled)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-bold tracking-[0.04em] transition-all duration-200 border-2 ${
                charTooltipEnabled
                  ? "bg-[#FFF0EB] border-[#FFB09C] text-[#FF7B5C]"
                  : "bg-white border-[#E8E0F0] text-[#6B6B7B]"
              }`}
            >
              {charTooltipEnabled ? "🔤 字词模式: 开" : "🔤 点击字词学习"}
            </button>
            <ReadingButton text={result} accentColor={ACCENT} />
          </motion.div>
        )}

        {/* ─── 加载状态 — 学生友好提示文案 ─── */}
        {loading && (
          <div className="mt-8">
            <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6 mb-4 text-center">
              <motion.span
                className="text-4xl inline-block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🤖
              </motion.span>
              <p className="text-[14px] text-[#6B6B7B] font-medium mt-2">
                {KID_FRIENDLY.loading[mode]}
              </p>
            </div>
            <SkeletonLoader />
          </div>
        )}

        {/* ─── AI 回答结果 — 结构化模块展示 ─── */}
        {showResult && !isEssayMode && (
          <div className="mt-8">
            <StructuredYuwenResponse
              content={result}
              accentColor={ACCENT}
              enableCharTooltip={charTooltipEnabled}
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
                📋 复制回答
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

        {/* ─── 作文模式 — 解析出hooks则只显示HookList，不显示原始JSON ─── */}
        {isEssayMode && hooks && hooks.length > 0 && (
          <div className="mt-10">
            <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-5 mb-4">
              <p className="text-[13px] font-bold mb-1" style={{ color: ACCENT, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>✨ AI 为你准备了以下作文素材</p>
              <p className="text-[11px] text-[#B0A0C0]">点击 📋 一键复制 可以把所有开头结尾复制到剪贴板哦～</p>
            </div>
            <HookList hooks={hooks} />
          </div>
        )}
        {/* ─── 作文模式 — 纯文本（非JSON）时用ResultCard显示 ─── */}
        {isEssayMode && result && !hooks && (
          <div className="mt-10">
            <ResultCard
              content={result}
              item={currentItem!}
              isFav={favorites.some((f) => f.id === currentItem!.id)}
              onToggleFavorite={() => toggleFavorite(currentItem!)}
              accentColor={ACCENT}
              streaming={streaming}
            />
          </div>
        )}

        {/* ─── 趣味拓展模块 ─── */}
        {isFunMode && <FunExtension accentColor={ACCENT} />}

        {/* ─── 错误提示 — 学生友好提示文案 ─── */}
        {error && (
          <ErrorToast
            message={error.message}
            code={error.code}
            onRetry={lastInputRef.current ? () => handleSubmit(lastInputRef.current) : undefined}
            onDismiss={() => setError(null)}
          />
        )}

        {/* ─── AI 小助手提示 (无结果时) ─── */}
        {!result && !loading && !error && !isFunMode && (
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
              🌟
            </motion.span>
            <p className="text-[16px] font-bold text-[#4D4D5E] mt-3" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
              选择模式，输入课文题目，开始学习吧！
            </p>
            <p className="text-[13px] text-[#B0A0C0] mt-2">
              点击上方的快捷按钮，或输入你想了解的课文内容～
            </p>
            <div className="flex justify-center gap-3 mt-4 text-[11px] text-[#B0A0C0]">
              <span>📖 读课文</span>
              <span>·</span>
              <span>✏️ 学字词</span>
              <span>·</span>
              <span>🌟 获星星</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── 学习笔记侧边栏 ─── */}
      <NotesSidebar
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        accentColor={ACCENT}
        currentText={currentTextTitle}
      />
    </div>
  );
}
