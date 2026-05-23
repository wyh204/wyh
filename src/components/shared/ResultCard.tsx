"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Heart, Check } from "lucide-react";
import { useState } from "react";
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
  accentColor = "#a78bfa",
  streaming = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-0"
    >
      {/* Left accent bar */}
      <div
        className="w-[3px] rounded-full flex-shrink-0 mr-6"
        style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}40)` }}
      />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-[10px] tracking-[0.15em] font-bold uppercase"
            style={{ color: accentColor }}
          >
            AI 回 答
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopy}
              className="text-[10px] tracking-[0.08em] text-white/30 hover:text-white/60 transition-colors"
            >
              {copied ? "已复制" : "复制"}
            </button>
            <button
              onClick={onToggleFavorite}
              className={cn(
                "text-[10px] tracking-[0.08em] transition-colors",
                isFav ? "text-red-400" : "text-white/30 hover:text-red-400"
              )}
            >
              {isFav ? "已收藏" : "收藏"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="markdown-body text-[14px] leading-relaxed text-white/65"
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
