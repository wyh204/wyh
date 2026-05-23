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
    <div className="flex gap-0 border-b border-white/[0.06]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-6 py-3 text-[12px] tracking-[0.08em] font-medium transition-all duration-200 border-b-[2px] -mb-[1px]",
            value === opt.value
              ? "text-white border-current"
              : "text-white/20 border-transparent hover:text-white/40"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
