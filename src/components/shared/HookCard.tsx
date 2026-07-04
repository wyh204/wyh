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

// 拆分 hookText 中的「开头」和「结尾」
function splitHook(text: string): { kaifou: string; jiewei: string } {
  const parts = text.split(/结尾[：:]/);
  const kaifou = (parts[0] || "").replace(/^开头[：:]\s*/, "").trim();
  const jiewei = (parts[1] || "").trim();
  return { kaifou, jiewei };
}

export default function HookCard({ hook, index }: Props) {
  const color = Object.entries(styleColorMap).find(([k]) => hook.styleTag.includes(k))?.[1] || "#a78bfa";
  const { kaifou, jiewei } = splitHook(hook.hookText);

  return (
    <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-5 group transition-all duration-300 hover:shadow-md">
      {/* 头部：序号 + 风格标签 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.12em] text-[#B0A0C0] font-bold">#{index + 1}</span>
        <span className="px-2 py-0.5 rounded-lg text-[10px] tracking-[0.08em] font-bold"
          style={{ background: `${color}20`, color }}>
          {hook.styleTag}
        </span>
      </div>

      {/* 开头 */}
      <div className="mb-2">
        <span className="text-[11px] font-bold" style={{ color }}>✍️ 开头</span>
        <p className="text-[13px] text-[#4D4D5E] leading-relaxed mt-0.5">{kaifou}</p>
      </div>

      {/* 中间提示 — 引导学生自己填写正文 */}
      <div className="my-3 mx-1 border-2 border-dashed rounded-xl py-3 px-4 text-center" style={{ borderColor: `${color}30`, background: `${color}05` }}>
        <span className="text-[13px] font-medium" style={{ color }}>📝 ··· 中间写你的故事 ···</span>
        <p className="text-[10px] text-[#B0A0C0] mt-1">根据开头展开，把事件经过、人物对话、细节描写写在这里～</p>
      </div>

      {/* 结尾 */}
      {jiewei && (
        <div className="mb-3">
          <span className="text-[11px] font-bold" style={{ color }}>🏁 结尾</span>
          <p className="text-[13px] text-[#4D4D5E] leading-relaxed mt-0.5">{jiewei}</p>
        </div>
      )}

      {/* 底部：理由 + 评分 */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0E8F8]">
        <p className="text-[11px] text-[#8B8B9B] flex-1 mr-2 leading-relaxed">💬 {hook.reason}</p>
        <span className="shrink-0 text-[12px] font-bold" style={{ color }}>⭐ {hook.clickBaitScore}/10</span>
      </div>

      <div className="h-[3px] mt-4 transition-all duration-300 ease-out group-hover:w-full rounded-full"
        style={{ background: color, width: "0%" }} />
    </div>
  );
}
