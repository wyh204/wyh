import type { EssayHook } from "@/types";

interface Props {
  hook: EssayHook;
  index: number;
}

const styleColorMap: Record<string, string> = {
  "温情": "#f472b6", "励志": "#fbbf24", "哲理": "#a78bfa", "幽默": "#34d399",
  "悬念": "#f87171", "诗意": "#60a5fa", "对比": "#fb923c", "反问": "#c084fc",
  "排比": "#4ade80", "叙事": "#f0a040",
};

export default function HookCard({ hook, index }: Props) {
  const color = Object.entries(styleColorMap).find(([k]) => hook.styleTag.includes(k))?.[1] || "#a78bfa";

  return (
    <div className="content-card p-5 group transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.12em] text-white/20 font-bold">#{index + 1}</span>
        <span
          className="px-2 py-0.5 rounded-[2px] text-[10px] tracking-[0.08em] font-bold"
          style={{ background: `${color}15`, color }}
        >
          {hook.styleTag}
        </span>
      </div>
      <p className="text-[13px] text-white/70 leading-relaxed mb-3">{hook.hookText}</p>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/25">{hook.reason}</p>
        <span className="text-[11px] font-bold" style={{ color }}>{hook.clickBaitScore}/10</span>
      </div>
      <div
        className="h-[2px] mt-4 transition-all duration-300 ease-out group-hover:w-full rounded-full"
        style={{ background: color, width: "0%" }}
      />
    </div>
  );
}
