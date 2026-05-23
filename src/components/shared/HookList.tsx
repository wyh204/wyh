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
    const text = hooks.map((h, i) => `【${i + 1}】${h.styleTag}\n${h.hookText}`).join("\n\n");
    await copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">爆款开头结尾 Hook</h3>
        <button
          onClick={handleCopyAll}
          className="text-xs px-3 py-1.5 rounded-lg glass-card hover:border-white/15 transition-all flex items-center gap-1"
        >
          <Copy className="w-3 h-3" />
          {copiedAll ? "已复制全部" : "一键复制全部"}
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
