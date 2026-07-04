"use client";
import { motion } from "framer-motion";
import HookCard from "./HookCard";
import type { EssayHook } from "@/types";
import { Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

interface Props {
  hooks: EssayHook[];
}

export default function HookList({ hooks }: Props) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const text = hooks.map((h, i) => {
      const parts = h.hookText.split(/结尾[：:]/);
      const k = (parts[0] || "").replace(/^开头[：:]\s*/, "").trim();
      const j = (parts[1] || "").trim();
      return `【${i + 1}】${h.styleTag}风格（⭐${h.clickBaitScore}/10）\n开头：${k}${j ? `\n结尾：${j}` : ""}`;
    }).join("\n\n");
    await copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[13px] tracking-[0.1em] font-bold text-[#6B6B7B]">
          💡 爆款开头结尾 Hook
        </h3>
        <button
          type="button"
          onClick={handleCopyAll}
          className="text-[11px] tracking-[0.08em] text-[#9999AA] hover:text-[#6B6B7B] transition-colors flex items-center gap-1.5 font-medium"
        >
          <Copy className="w-3 h-3" />
          {copiedAll ? "✅ 已复制全部" : "📋 一键复制"}
        </button>
      </div>
      <motion.div
        className="grid gap-3 md:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {hooks.map((hook, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          >
            <HookCard hook={hook} index={i} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
