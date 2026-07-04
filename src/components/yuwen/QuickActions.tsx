"use client";
import { motion } from "framer-motion";
import type { QuickAction } from "@/types";

const QUICK_ACTIONS: QuickAction[] = [
  { icon: "📚", label: "作者介绍", prompt: "请介绍这篇文章的作者生平、文学地位和写作背景", color: "#FF7B5C" },
  { icon: "✨", label: "重点解析", prompt: "请分析这篇文章的重点段落、写作手法和语言特色", color: "#FF7B5C" },
  { icon: "📝", label: "重点字词", prompt: "请列出这篇文章中的重点字词，标注拼音和释义，并分析其在文中的作用", color: "#FF7B5C" },
  { icon: "💡", label: "中心思想", prompt: "请概括这篇文章的中心思想、主旨和深层含义", color: "#FF7B5C" },
  { icon: "🎯", label: "写作手法", prompt: "请分析这篇文章使用了哪些写作手法和修辞方法，并举例说明其效果", color: "#FF7B5C" },
  { icon: "🔍", label: "词句赏析", prompt: "请赏析这篇文章中的精彩词句，分析其表达效果和深层意蕴", color: "#FF7B5C" },
];

interface Props {
  onSelect: (prompt: string) => void;
}

export default function QuickActions({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {QUICK_ACTIONS.map((action, i) => (
        <motion.button
          key={action.label}
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(action.prompt)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[13px] font-bold tracking-[0.04em]
                     bg-white border-2 border-[#E8E0F0] text-[#4D4D5E]
                     hover:border-[#FFB09C] hover:text-[#FF7B5C] hover:bg-[#FFF0EB]
                     transition-all duration-200 shadow-sm"
        >
          <span className="text-base">{action.icon}</span>
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}
