"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CharacterTooltip from "./CharacterTooltip";

/* ===================================================
   结构化 AI 回答 — 按 ## 标题分模块显示
   =================================================== */
interface Section {
  title: string;
  content: string;
  icon: string;
}

function parseSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split("\n");
  let currentTitle = "📖 课文解析";
  let currentContent: string[] = [];

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (currentContent.length > 0) {
        sections.push({ title: currentTitle, content: currentContent.join("\n").trim(), icon: getIcon(currentTitle) });
      }
      currentTitle = line.replace(/^##\s+/, "").trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  // 最后一段
  if (currentContent.length > 0) {
    sections.push({ title: currentTitle, content: currentContent.join("\n").trim(), icon: getIcon(currentTitle) });
  }

  // 如果没有 ## 标题，整段作为一个模块
  if (sections.length === 0) {
    sections.push({ title: "📖 课文解析", content: markdown, icon: "📖" });
  }

  return sections;
}

function getIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("作者") || t.includes("背景")) return "👤";
  if (t.includes("重点") || t.includes("解析") || t.includes("赏析")) return "✨";
  if (t.includes("生字") || t.includes("词汇") || t.includes("词语")) return "📝";
  if (t.includes("中心") || t.includes("思想") || t.includes("主旨")) return "💡";
  if (t.includes("写作") || t.includes("手法") || t.includes("修辞")) return "🎯";
  if (t.includes("结构") || t.includes("段落")) return "🏗️";
  if (t.includes("总结") || t.includes("归纳")) return "📋";
  return "📖";
}

interface Props {
  content: string;
  accentColor?: string;
  enableCharTooltip?: boolean;
}

export default function StructuredYuwenResponse({
  content,
  accentColor = "#FF7B5C",
  enableCharTooltip = false,
}: Props) {
  const sections = parseSections(content);

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
          style={{ borderColor: i === 0 ? `${accentColor}30` : undefined }}
        >
          {/* 模块标题 */}
          <div
            className="flex items-center gap-2 px-5 py-3 border-b-2 border-[#F5F0FA]"
            style={{ background: `${accentColor}08` }}
          >
            <span className="text-lg">{section.icon}</span>
            <h3
              className="text-[14px] font-bold tracking-[0.05em]"
              style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
            >
              {section.title}
            </h3>
          </div>

          {/* 模块内容 */}
          <div className="p-5">
            {enableCharTooltip ? (
              <CharacterTooltip text={section.content} accentColor={accentColor} />
            ) : (
              <div
                className="markdown-body text-[15px] leading-[1.9] text-[#4D4D5E]"
                style={{ ["--accent-color" as string]: accentColor }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {section.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
