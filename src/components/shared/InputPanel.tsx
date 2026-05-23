"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  placeholder?: string;
  onSubmit: (input: string) => void;
  loading?: boolean;
  disabled?: boolean;
  maxLength?: number;
  accentColor?: string;
}

export default function InputPanel({
  placeholder = "请输入你想了解的内容...",
  onSubmit,
  loading = false,
  disabled = false,
  maxLength = 500,
  accentColor = "#a78bfa",
}: Props) {
  const [input, setInput] = useState("");

  function handleSubmit() {
    if (!input.trim() || loading || disabled) return;
    onSubmit(input.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-3 items-stretch">
      <div className="flex-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={1}
          className={cn(
            "w-full h-full bg-[#0d0d1a] border border-white/[0.06] rounded-[4px] px-5 py-4",
            "text-white/65 placeholder-white/15",
            "focus:outline-none focus:border-white/15",
            "resize-none transition-all duration-200 text-[13px] tracking-[0.02em]",
          )}
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || disabled || !input.trim()}
        className={cn(
          "px-8 rounded-[4px] font-bold text-[12px] tracking-[0.1em] flex items-center gap-2 transition-all duration-200",
          "disabled:opacity-30 disabled:cursor-not-allowed text-[#0a0a0f]",
        )}
        style={{ background: loading ? `${accentColor}80` : accentColor }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        发 送
      </button>
    </div>
  );
}
