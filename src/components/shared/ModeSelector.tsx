"use client";
import { cn } from "@/lib/utils";

interface ModeOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: ModeOption<T>[];
  value: T;
  onChange: (v: T) => void;
}

export default function ModeSelector<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex gap-1 border-b-2 border-[#E8E0F0]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-6 py-3 text-[13px] tracking-[0.06em] font-bold transition-all duration-200 border-b-[3px] -mb-[2px] rounded-t-xl",
            value === opt.value
              ? "text-[#3D3D4E] border-current bg-[#FFF0EB]"
              : "text-[#B0A0C0] border-transparent hover:text-[#8B8B9B] hover:bg-[#F5F0FA]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
