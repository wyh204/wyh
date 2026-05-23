"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ExperimentCanvas from "@/components/experiment/ExperimentCanvas";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";
import { Beaker } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function ChemistryExperimentPage() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const experiment = CHEMISTRY_EXPERIMENTS.find((e) => e.id === experimentId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const loadExperiment = useCallback(async () => {
    if (!experiment) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chemistry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentName: experiment.name, scientist: experiment.scientist }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); return; }
      setResult(json.data.raw);
    } catch {
      setError({ message: "网络错误" });
    } finally {
      setLoading(false);
    }
  }, [experiment]);

  if (!experiment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-text-secondary">实验未找到</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#f0a040" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-chemistry mb-1">
          {experiment.name}
        </motion.h2>
        <p className="text-text-secondary text-sm mb-6">{experiment.scientist}</p>

        <ExperimentCanvas experimentId={experimentId} color="#f0a040" />

        <div className="mt-6 flex gap-4">
          <button
            onClick={loadExperiment}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-chemistry/20 hover:bg-chemistry/30 text-chemistry font-medium text-sm transition-all flex items-center gap-2"
          >
            <Beaker className="w-4 h-4" />
            {loading ? "加载中..." : "AI 实验指导"}
          </button>
        </div>

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card p-6">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{result}</div>
          </motion.div>
        )}

        {error && <ErrorToast message={error.message} code={error.code} onRetry={loadExperiment} onDismiss={() => setError(null)} />}
      </div>
    </div>
  );
}
