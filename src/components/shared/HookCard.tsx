import { cn } from "@/lib/utils";
import type { EssayHook } from "@/types";

interface Props {
  hook: EssayHook;
  index: number;
}

const styleColorMap: Record<string, string> = {
  "温情": "#f472b6",
  "励志": "#fbbf24",
  "哲理": "#a78bfa",
  "幽默": "#34d399",
  "悬念": "#f87171",
  "诗意": "#60a5fa",
  "对比": "#fb923c",
  "反问": "#c084fc",
  "排比": "#4ade80",
  "叙事": "#f0a040",
};

export default function HookCard({ hook, index }: Props) {
  const color = Object.entries(styleColorMap).find(([k]) => hook.styleTag.includes(k))?.[1] || "#8888a0";

  return (
    <div className="glass-card p-4 hover:border-white/15 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-text-secondary">#{index + 1}</span>
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: `${color}20`, color }}
          >
            {hook.styleTag}
          </span>
          <span className="text-xs text-yuwen font-bold">{hook.clickBaitScore}/10</span>
        </div>
      </div>
      <p className="text-sm text-text-primary mb-2 leading-relaxed">{hook.hookText}</p>
      <p className="text-xs text-text-secondary">{hook.reason}</p>
    </div>
  );
}
