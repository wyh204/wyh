"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ModeSelector from "@/components/shared/ModeSelector";
import InputPanel from "@/components/shared/InputPanel";
import ResultCard from "@/components/shared/ResultCard";
import HookList from "@/components/shared/HookList";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import HistoryDrawer from "@/components/shared/HistoryDrawer";
import FavoriteDrawer from "@/components/shared/FavoriteDrawer";
import { useHistory } from "@/hooks/useHistory";
import type { EnglishMode, EssayHook } from "@/types";
import { Clock, Heart } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const MODE_OPTIONS = [
  { value: "grammar" as const, label: "语法指导" },
  { value: "essay" as const, label: "作文指导" },
];

export default function EnglishPage() {
  const [mode, setMode] = useState<EnglishMode>("grammar");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [outline, setOutline] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [lastItem, setLastItem] = useState<ReturnType<typeof useHistory>["history"][0] | null>(null);

  const { history, favorites, save, toggleFavorite, clearAll, isFavorite: checkFav } = useHistory();

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setResult(null); setOutline(null); setHooks(null); setError(null);
    try {
      const res = await fetch("/api/english", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); return; }

      if (mode === "essay") {
        setOutline(json.data.outline || "");
        setHooks(json.data.hooks || []);
        const item = save("english", input, { outline: json.data.outline, hooks: json.data.hooks }, mode);
        setLastItem(item);
      } else {
        setResult(json.data.raw || "");
        const item = save("english", input, { raw: json.data.raw }, mode);
        setLastItem(item);
      }
    } catch {
      setError({ message: "网络错误，请检查连接后重试" });
    } finally {
      setLoading(false);
    }
  }, [mode, save]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#3dd68c" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-english mb-2">英语学习</h2>
          <p className="text-text-secondary text-sm">AI 语法精讲 · 满分作文指导</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1"><ModeSelector options={MODE_OPTIONS} value={mode} onChange={setMode} /></div>
          <button onClick={() => setHistoryOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Clock className="w-5 h-5 text-text-secondary" />
          </button>
          <button onClick={() => setFavoriteOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Heart className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <InputPanel
          placeholder={mode === "grammar" ? "输入中文描述语法点，如：现在完成时... 或粘贴英文句子" : "输入文体和主题，如：书信 给朋友的感谢信..."}
          onSubmit={handleSubmit}
          loading={loading}
          maxLength={1000}
        />

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && lastItem && (
          <div className="mt-6">
            <ResultCard content={result} item={lastItem} isFav={checkFav(lastItem.id)} onToggleFavorite={() => toggleFavorite(lastItem)} />
          </div>
        )}

        {outline && (
          <div className="mt-6 glass-card p-6">
            <h3 className="text-lg font-bold text-english mb-4">满分作文大纲与指导</h3>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{outline}</div>
          </div>
        )}

        {hooks && hooks.length > 0 && (
          <div className="mt-6"><HookList hooks={hooks} /></div>
        )}

        {error && <ErrorToast message={error.message} code={error.code} onRetry={() => setError(null)} onDismiss={() => setError(null)} />}
      </div>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} history={history}
        onToggleFavorite={toggleFavorite} onClearAll={clearAll} isFavorite={checkFav} />
      <FavoriteDrawer open={favoriteOpen} onClose={() => setFavoriteOpen(false)} favorites={favorites}
        onRemove={(id) => toggleFavorite({ id } as never)} />
    </div>
  );
}
