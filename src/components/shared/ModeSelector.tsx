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
    <div className="flex gap-2 p-1 glass-card rounded-xl">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            value === opt.value
              ? "bg-white/15 text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
