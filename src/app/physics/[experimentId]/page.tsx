"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ExperimentCanvas from "@/components/experiment/ExperimentCanvas";
import ResultCard from "@/components/shared/ResultCard";
import { PHYSICS_EXPERIMENTS } from "@/lib/experiments";
import { Beaker } from "lucide-react";
import type { HistoryItem } from "@/types";
import { useHistory } from "@/hooks/useHistory";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#c084fc";

export default function PhysicsExperimentPage() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const experiment = PHYSICS_EXPERIMENTS.find((e) => e.id === experimentId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { save, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const loadExperiment = useCallback(async () => {
    if (!experiment) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/physics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentName: experiment.name, scientist: experiment.scientist }),
      });

      if (!res.ok) {
        try {
          const json = await res.json();
          setError({ message: json.error, code: json.code });
        } catch { setError({ message: "网络错误" }); }
        setLoading(false);
        return;
      }

      // SSE streaming reader
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
          } catch { /* skip unparseable */ }
        }
      }
      setStreaming(false);

      const item = save("physics", experiment.name, fullText);
      setCurrentItem(item);
    } catch {
      setError({ message: "网络错误" });
    } finally {
      setLoading(false);
    }
  }, [experiment, save]);

  if (!experiment) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-white/20 text-[12px] tracking-[0.08em]">实验未找到</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">
          课程 / 物理 / {experiment.name}
        </p>
        <div className="mb-2">
          <h2 className="text-[40px] md:text-[48px] font-[900] tracking-[0.04em] leading-[1.1] text-white">
            {experiment.name}
          </h2>
          <p className="text-[16px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">
            {experiment.scientist}
          </p>
        </div>
        <div className="mt-8">
          <ExperimentCanvas experimentId={experimentId} color={ACCENT} />
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={loadExperiment}
            disabled={loading}
            className="content-card px-8 py-3 text-[12px] tracking-[0.1em] font-bold transition-all hover:border-white/15 flex items-center gap-3"
            style={{ color: ACCENT }}
          >
            <Beaker className="w-4 h-4" />
            {loading ? "加载中..." : "AI 实验指导"}
          </button>
        </div>
        {loading && <div className="mt-6"><SkeletonLoader /></div>}
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
        {error && (
          <ErrorToast message={error.message} code={error.code} onRetry={loadExperiment} onDismiss={() => setError(null)} />
        )}
      </div>
    </div>
  );
}
