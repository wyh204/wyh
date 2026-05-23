"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import InputPanel from "@/components/shared/InputPanel";
import ResultCard from "@/components/shared/ResultCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import HistoryDrawer from "@/components/shared/HistoryDrawer";
import FavoriteDrawer from "@/components/shared/FavoriteDrawer";
import { useHistory } from "@/hooks/useHistory";
import { Clock, Heart } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function MathPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [lastItem, setLastItem] = useState<ReturnType<typeof useHistory>["history"][0] | null>(null);

  const { history, favorites, save, toggleFavorite, clearAll, isFavorite: checkFav } = useHistory();

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); return; }
      setResult(json.data.raw);
      const item = save("math", input, { raw: json.data.raw });
      setLastItem(item);
    } catch {
      setError({ message: "网络错误，请检查连接后重试" });
    } finally {
      setLoading(false);
    }
  }, [save]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#4da6ff" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-math mb-2">数学学习</h2>
          <p className="text-text-secondary text-sm">AI 智能解题 · 数学家故事 · 考点分析</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1" />
          <button onClick={() => setHistoryOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Clock className="w-5 h-5 text-text-secondary" />
          </button>
          <button onClick={() => setFavoriteOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Heart className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <InputPanel
          placeholder="请输入数学题目，如：解方程 2x² - 5x + 2 = 0..."
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

        {error && <ErrorToast message={error.message} code={error.code} onRetry={() => setError(null)} onDismiss={() => setError(null)} />}
      </div>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} history={history}
        onToggleFavorite={toggleFavorite} onClearAll={clearAll} isFavorite={checkFav} />
      <FavoriteDrawer open={favoriteOpen} onClose={() => setFavoriteOpen(false)} favorites={favorites}
        onRemove={(id) => toggleFavorite({ id } as never)} />
    </div>
  );
}
