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
import type { YuwenMode, EssayHook } from "@/types";
import { Clock, Heart } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const MODE_OPTIONS = [
  { value: "modern" as const, label: "现代文学学习" },
  { value: "classical" as const, label: "古文学习" },
  { value: "essay" as const, label: "考试作文 Help" },
];

export default function YuwenPage() {
  const [mode, setMode] = useState<YuwenMode>("modern");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [lastItem, setLastItem] = useState<ReturnType<typeof useHistory>["history"][0] | null>(null);

  const { history, favorites, save, toggleFavorite, clearAll, isFavorite: checkFav } = useHistory();

  const handleSubmit = useCallback(
    async (input: string) => {
      setLoading(true);
      setResult(null);
      setHooks(null);
      setError(null);
      try {
        const res = await fetch("/api/yuwen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, input }),
        });
        const json = await res.json();
        if (!res.ok) { setError({ message: json.error, code: json.code }); return; }

        if (mode === "essay") {
          setHooks(json.data.hooks || []);
          const item = save("yuwen", input, { hooks: json.data.hooks }, mode);
          setLastItem(item);
        } else {
          setResult(json.data.raw || "");
          const item = save("yuwen", input, { raw: json.data.raw }, mode);
          setLastItem(item);
        }
      } catch {
        setError({ message: "网络错误，请检查连接后重试" });
      } finally {
        setLoading(false);
      }
    },
    [mode, save],
  );

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#e85d3a" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-yuwen mb-2">语文学习</h2>
          <p className="text-text-secondary text-sm">AI 文学鉴赏 · 古文精讲 · 作文辅导</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <ModeSelector options={MODE_OPTIONS} value={mode} onChange={setMode} />
          </div>
          <button onClick={() => setHistoryOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Clock className="w-5 h-5 text-text-secondary" />
          </button>
          <button onClick={() => setFavoriteOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Heart className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <InputPanel
          placeholder={mode === "essay" ? "请输入作文主题，如：我的家乡..." : "请输入文章篇章名，如：背影..."}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && lastItem && (
          <div className="mt-6">
            <ResultCard content={result} item={lastItem} isFav={checkFav(lastItem.id)} onToggleFavorite={() => toggleFavorite(lastItem)} />
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
