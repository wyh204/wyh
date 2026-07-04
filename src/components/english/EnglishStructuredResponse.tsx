"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ===================================================
   英语结构化回答 — 分模块卡片展示
   模块：识别内容 / 翻译 / 语法解析 / 重点单词 / 易错提醒
   =================================================== */

interface EnglishSection {
  title: string;
  icon: string;
  content: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

function parseSections(markdown: string): EnglishSection[] {
  const sections: EnglishSection[] = [];
  const lines = markdown.split("\n");
  let currentTitle = "📖 完整解析";
  let currentContent: string[] = [];

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (currentContent.length > 0 && currentContent.join("\n").trim()) {
        sections.push({ title: currentTitle, ...getSectionStyle(currentTitle), content: currentContent.join("\n").trim() });
      }
      currentTitle = line.replace(/^##\s+/, "").trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0 && currentContent.join("\n").trim()) {
    sections.push({ title: currentTitle, ...getSectionStyle(currentTitle), content: currentContent.join("\n").trim() });
  }

  if (sections.length === 0 && markdown.trim()) {
    sections.push({ title: "📖 完整解析", ...getSectionStyle("完整解析"), content: markdown });
  }

  return sections;
}

function getSectionStyle(title: string): Omit<EnglishSection, "title" | "content"> {
  const t = title.toLowerCase();
  if (t.includes("翻译") || t.includes("translat")) {
    return { icon: "🌐", color: "#5BA4E6", bgColor: "#EBF4FF", borderColor: "#A0C8F0" };
  }
  if (t.includes("语法") || t.includes("grammar") || t.includes("结构")) {
    return { icon: "📖", color: "#B39DDB", bgColor: "#F5F0FA", borderColor: "#D0C0F0" };
  }
  if (t.includes("单词") || t.includes("词汇") || t.includes("vocabulary") || t.includes("重点")) {
    return { icon: "📝", color: "#FF7B5C", bgColor: "#FFF0EB", borderColor: "#FFB09C" };
  }
  if (t.includes("易错") || t.includes("注意") || t.includes("提醒") || t.includes("mistake")) {
    return { icon: "⚠️", color: "#FF9A85", bgColor: "#FFF5F3", borderColor: "#FFC4B8" };
  }
  if (t.includes("发音") || t.includes("pronunciation") || t.includes("音标")) {
    return { icon: "🔊", color: "#6DBE6D", bgColor: "#EDF8ED", borderColor: "#B8E0B8" };
  }
  if (t.includes("例句") || t.includes("example")) {
    return { icon: "💬", color: "#FFCC4D", bgColor: "#FFF9EB", borderColor: "#FFE8A0" };
  }
  return { icon: "📖", color: "#6DBE6D", bgColor: "#EDF8ED", borderColor: "#B8E0B8" };
}

interface Props {
  content: string;
  accentColor?: string;
  recognizedText?: string | null;
}

export default function EnglishStructuredResponse({ content, accentColor = "#6DBE6D", recognizedText }: Props) {
  const sections = parseSections(content);

  return (
    <div className="space-y-4">
      {/* 识别到的内容 */}
      {recognizedText && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-2xl border-2 p-5" style={{ background: "#F0F7F0", borderColor: "#B8E0B8" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📷</span>
            <h3 className="text-[14px] font-bold text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>识别内容</h3>
          </div>
          <p className="text-[15px] font-bold text-[#4D4D5E] leading-relaxed bg-white rounded-xl p-4 border-2 border-[#D0F0D0]">
            {recognizedText}
          </p>
        </motion.div>
      )}

      {/* 解题模块 */}
      {sections.map((section, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.35 }}
          className="rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: section.borderColor }}>
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: section.bgColor }}>
            <span className="text-lg">{section.icon}</span>
            <h3 className="text-[14px] font-bold tracking-[0.05em]" style={{ color: section.color, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>{section.title}</h3>
          </div>
          <div className="p-5 bg-white">
            <div className="markdown-body text-[15px] leading-[1.9] text-[#4D4D5E]" style={{ ["--accent-color" as string]: section.color }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      ))}

      {sections.length > 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-[11px] text-[#B0A0C0] pt-2">
          🌟 太棒了！你又完成了一次英语学习，继续加油哦～
        </motion.p>
      )}
    </div>
  );
}
