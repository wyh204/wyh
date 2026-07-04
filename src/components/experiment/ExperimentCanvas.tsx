"use client";
import dynamic from "next/dynamic";

const ExperimentVideoPlayer = dynamic(() => import("@/components/shared/ExperimentVideoPlayer"), { ssr: false });

interface Props { experimentId: string; accentColor?: string; }

export default function ExperimentCanvas({ experimentId, accentColor = "#B39DDB" }: Props) {
  const isPhysics = ["refraction", "boiling-water", "buoyancy", "convex-lens"].includes(experimentId);
  const isChem = ["solution-prep", "oxygen", "ph-test", "titration"].includes(experimentId);

  if (isPhysics || isChem) {
    const color = isPhysics ? "#B39DDB" : "#FFCC4D";
    return <ExperimentVideoPlayer experimentId={experimentId} accentColor={color} />;
  }

  return (
    <div className="w-full aspect-video rounded-2xl border-2 border-[#E8E0F0] bg-white flex items-center justify-center">
      <p className="text-[#B0A0C0] text-[14px] font-medium">🎬 视频加载中...</p>
    </div>
  );
}
