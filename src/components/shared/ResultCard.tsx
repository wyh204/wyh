"use client";
import { motion } from "framer-motion";
import { Copy, Heart, Check } from "lucide-react";
import { useState } from "react";
import { cn, copyToClipboard } from "@/lib/utils";
import type { HistoryItem } from "@/types";

interface Props {
  content: string;
  item: HistoryItem;
  isFav: boolean;
  onToggleFavorite: () => void;
}

export default function ResultCard({ content, item, isFav, onToggleFavorite }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative"
    >
      <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-english" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
        <button
          onClick={onToggleFavorite}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
            isFav
              ? "text-red-400 bg-red-400/10"
              : "text-text-secondary hover:text-red-400 hover:bg-white/5",
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", isFav && "fill-current")} />
          {isFav ? "已收藏" : "收藏"}
        </button>
      </div>
    </motion.div>
  );
}
