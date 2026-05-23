"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ResultCard from "@/components/shared/ResultCard";
import InputPanel from "@/components/shared/InputPanel";
import type { HistoryItem } from "@/types";
import { useHistory } from "@/hooks/useHistory";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#60a5fa";

export default function MathPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { save, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); setLoading(false); return; }
      setResult(json.data.raw);
      const item = save("math", input, json.data.raw || "");
      setCurrentItem(item);
    } catch {
      setError({ message: "网络错误" });
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [save]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 数 学</p>
        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">数 学</h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">Math</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          智能解题 · 数学史故事 · 考点分析。输入题目，获取完整分析和解答过程。
        </p>
        <InputPanel placeholder="输入数学题目..." onSubmit={handleSubmit} loading={loading} accentColor={ACCENT} />
        {loading && <div className="mt-8"><SkeletonLoader /></div>}
        {result && currentItem && (
          <div className="mt-10">
            <ResultCard
              content={result}
              item={currentItem}
              isFav={favorites.some((f) => f.id === currentItem.id)}
              onToggleFavorite={() => toggleFavorite(currentItem)}
              accentColor={ACCENT}
              streaming={streaming}
            />
          </div>
        )}
        {error && <ErrorToast message={error.message} code={error.code} onRetry={() => {}} onDismiss={() => setError(null)} />}
      </div>
    </div>
  );
}
