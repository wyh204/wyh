"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef, useEffect } from "react";
import { cn, copyToClipboard } from "@/lib/utils";
import type { HistoryItem } from "@/types";

interface Props {
  content: string;
  item: HistoryItem;
  isFav: boolean;
  onToggleFavorite: () => void;
  accentColor?: string;
  streaming?: boolean;
}

export default function ResultCard({
  content,
  item,
  isFav,
  onToggleFavorite,
  accentColor = "#FF7B5C",
  streaming = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  async function handleCopy() {
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => {
      if (mountedRef.current) {
        setCopied(false);
      }
    }, 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-0"
    >
      {/* Left accent bar */}
      <div
        aria-hidden="true"
        className="w-[4px] rounded-full flex-shrink-0 mr-6"
        style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}40)` }}
      />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-[11px] tracking-[0.12em] font-bold"
            style={{ color: accentColor }}
          >
            🤖 AI 回 答
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] tracking-[0.08em] text-[#9999AA] hover:text-[#6B6B7B] transition-colors font-medium"
            >
              {copied ? "✅ 已复制" : "📋 复制"}
            </button>
            <button
              type="button"
              onClick={onToggleFavorite}
              className={cn(
                "text-[11px] tracking-[0.08em] transition-colors font-medium",
                isFav ? "text-red-500" : "text-[#9999AA] hover:text-red-400"
              )}
            >
              {isFav ? "❤️ 已收藏" : "🤍 收藏"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="markdown-body text-[15px] leading-relaxed text-[#4D4D5E]"
          style={{ ["--accent-color" as string]: accentColor }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
          {streaming && <span className="cursor-blink" style={{ ["--accent-color" as string]: accentColor }} />}
        </div>
      </div>
    </motion.div>
  );
}
