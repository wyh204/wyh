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
}

export default function InputPanel({
  placeholder = "请输入你想了解的内容...",
  onSubmit,
  loading = false,
  disabled = false,
  maxLength = 500,
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
    <div className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={2}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3",
            "text-text-primary placeholder-text-secondary/50",
            "focus:outline-none focus:border-white/25 focus:bg-white/8",
            "resize-none transition-all duration-200 text-sm",
          )}
        />
        <span className="absolute bottom-2 right-3 text-xs text-text-secondary/50">
          {input.length}/{maxLength}
        </span>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || disabled || !input.trim()}
        className={cn(
          "px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200",
          "bg-white/10 hover:bg-white/15 text-text-primary",
          "disabled:opacity-40 disabled:cursor-not-allowed",
        )}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        发送
      </button>
    </div>
  );
}
