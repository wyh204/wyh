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
  accentColor = "#FF7B5C",
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
            "w-full h-full bg-white border-2 border-[#E8E0F0] rounded-2xl px-5 py-4",
            "text-[#3D3D4E] placeholder-[#B0A0C0]",
            "focus:outline-none focus:border-[#FFB09C] focus:shadow-[0_0_0_4px_rgba(255,123,92,0.1)]",
            "resize-none transition-all duration-200 text-[14px] tracking-[0.02em] font-medium",
          )}
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || disabled || !input.trim()}
        className={cn(
          "px-8 rounded-2xl font-bold text-[13px] tracking-[0.08em] flex items-center gap-2 transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed text-white",
          "hover:scale-105 active:scale-95",
        )}
        style={{
          background: loading ? `${accentColor}99` : accentColor,
          boxShadow: `0 4px 16px ${accentColor}40`,
        }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        发 送
      </button>
    </div>
  );
}
