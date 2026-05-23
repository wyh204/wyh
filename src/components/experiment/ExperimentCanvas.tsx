"use client";
import dynamic from "next/dynamic";

const RefractionScene = dynamic(() => import("./RefractionScene"), { ssr: false });
const CircuitScene = dynamic(() => import("./CircuitScene"), { ssr: false });
const BuoyancyScene = dynamic(() => import("./BuoyancyScene"), { ssr: false });
const LensScene = dynamic(() => import("./LensScene"), { ssr: false });
const ChemistryLabScene = dynamic(() => import("./ChemistryLabScene"), { ssr: false });

interface Props {
  experimentId: string;
  color: string;
}

export default function ExperimentCanvas({ experimentId, color }: Props) {
  const cls = "w-full h-72 md:h-96 rounded-[4px] overflow-hidden content-card";

  switch (experimentId) {
    case "light-refraction": return <div className={cls}><RefractionScene /></div>;
    case "electric-circuit": return <div className={cls}><CircuitScene /></div>;
    case "buoyancy": return <div className={cls}><BuoyancyScene /></div>;
    case "convex-lens": return <div className={cls}><LensScene /></div>;
    case "acid-base":
    case "oxygen-prep":
    case "flame-test":
    case "water-electrolysis":
      return <div className={cls}><ChemistryLabScene /></div>;
    default:
      return (
        <div className={`${cls} flex items-center justify-center`}>
          <p className="text-white/20 text-[12px] tracking-[0.08em]">3D 实验场景</p>
        </div>
      );
  }
}
