"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ResultCard from "@/components/shared/ResultCard";
import ModeSelector from "@/components/shared/ModeSelector";
import InputPanel from "@/components/shared/InputPanel";
import HookList from "@/components/shared/HookList";
import type { EnglishMode, HistoryItem, EssayHook } from "@/types";
import { useHistory } from "@/hooks/useHistory";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#34d399";

const modeOptions = [
  { value: "grammar" as const, label: "语法指导" },
  { value: "essay" as const, label: "作文指导" },
];

export default function EnglishPage() {
  const [mode, setMode] = useState<EnglishMode>("grammar");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [outline, setOutline] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { save, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHooks(null);
    setOutline(null);
    setGuidance(null);

    try {
      const res = await fetch("/api/english", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
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

      // For essay mode, parse fullText for outline/guidance/hooks
      if (mode === "essay") {
        try {
          const parsed = JSON.parse(fullText);
          if (parsed.outline) setOutline(parsed.outline);
          if (parsed.guidance) setGuidance(parsed.guidance);
          if (parsed.hooks?.length) setHooks(parsed.hooks);
        } catch { /* not JSON, keep as raw result */ }
      }

      const item = save("english", input, fullText, mode);
      setCurrentItem(item);
    } catch {
      setError({ message: "网络错误" });
    } finally {
      setLoading(false);
    }
  }, [mode, save]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 英 语</p>
        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">英 语</h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">English</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          语法精讲 · 作文指导 · 满分大纲。选择学习模式，获取专业英语辅导。
        </p>
        <ModeSelector options={modeOptions} value={mode} onChange={setMode} />
        <div className="mt-8">
          <InputPanel
            placeholder={mode === "essay" ? "输入文体和主题..." : "输入英文句子或中文语法描述..."}
            onSubmit={handleSubmit}
            loading={loading}
            accentColor={ACCENT}
          />
        </div>
        {loading && <div className="mt-8"><SkeletonLoader /></div>}
        {outline && (
          <div className="mt-10">
            <div className="content-card p-6 accent-left" style={{ ["--accent-color" as string]: ACCENT }}>
              <h3 className="text-[12px] tracking-[0.1em] font-bold mb-3" style={{ color: ACCENT }}>作文大纲</h3>
              <div className="markdown-body text-[14px] text-white/65" style={{ ["--accent-color" as string]: ACCENT }}>
                {outline}
              </div>
            </div>
          </div>
        )}
        {guidance && (
          <div className="mt-4">
            <div className="content-card p-6 accent-left" style={{ ["--accent-color" as string]: ACCENT }}>
              <h3 className="text-[12px] tracking-[0.1em] font-bold mb-3" style={{ color: ACCENT }}>写作指导</h3>
              <div className="markdown-body text-[14px] text-white/65" style={{ ["--accent-color" as string]: ACCENT }}>
                {guidance}
              </div>
            </div>
          </div>
        )}
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
        {hooks && <div className="mt-10"><HookList hooks={hooks} /></div>}
        {error && <ErrorToast message={error.message} code={error.code} onRetry={() => {}} onDismiss={() => setError(null)} />}
      </div>
    </div>
  );
}
