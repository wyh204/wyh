"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ================================================================
   统一 AI 指导模块 — 按 ## 标题拆分为结构化卡片
   所有学科共用，确保风格完全一致
   ================================================================ */

interface GuidanceModule {
  title: string;
  icon: string;
  content: string;
  color: string;
  bg: string;
}

// 根据模块标题匹配图标和颜色
function getModuleStyle(title: string, accentColor: string): { icon: string; color: string; bg: string } {
  const t = title.toLowerCase();
  if (t.includes("目标") || t.includes("目的")) return { icon: "🎯", color: "#FF7B5C", bg: "#FFF0EB" };
  if (t.includes("核心") || t.includes("讲解") || t.includes("知识点")) return { icon: "📖", color: "#5BA4E6", bg: "#EBF4FF" };
  if (t.includes("步骤") || t.includes("操作") || t.includes("分步") || t.includes("过程")) return { icon: "📝", color: "#FF7B5C", bg: "#FFF0EB" };
  if (t.includes("易错") || t.includes("注意") || t.includes("提醒") || t.includes("风险")) return { icon: "⚠️", color: "#FF9A85", bg: "#FFF5F3" };
  if (t.includes("拓展") || t.includes("趣味") || t.includes("总结") || t.includes("应用")) return { icon: "🎪", color: "#B39DDB", bg: "#F5F0FA" };
  if (t.includes("分析") || t.includes("题目")) return { icon: "🔍", color: "#5BA4E6", bg: "#EBF4FF" };
  if (t.includes("考点") || t.includes("总结") || t.includes("要点")) return { icon: "💡", color: "#FFCC4D", bg: "#FFF9EB" };
  if (t.includes("器材") || t.includes("准备")) return { icon: "🧪", color: "#6DBE6D", bg: "#EDF8ED" };
  if (t.includes("翻译") || t.includes("例句")) return { icon: "🌐", color: "#5BA4E6", bg: "#EBF4FF" };
  if (t.includes("同类") || t.includes("练习")) return { icon: "✏️", color: "#6DBE6D", bg: "#EDF8ED" };
  // 默认用主题色
  return { icon: "📌", color: accentColor, bg: `${accentColor}10` };
}

// 解析 markdown — 按 ## 标题分模块
function parseModules(markdown: string, accentColor: string): GuidanceModule[] {
  const modules: GuidanceModule[] = [];
  const lines = markdown.split("\n");
  let currentTitle = "📋 完整指导";
  let currentContent: string[] = [];

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (currentContent.length > 0 && currentContent.join("\n").trim()) {
        modules.push({ title: currentTitle, ...getModuleStyle(currentTitle, accentColor), content: currentContent.join("\n").trim() });
      }
      currentTitle = line.replace(/^##\s+/, "").trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  // 最后一段
  if (currentContent.length > 0 && currentContent.join("\n").trim()) {
    modules.push({ title: currentTitle, ...getModuleStyle(currentTitle, accentColor), content: currentContent.join("\n").trim() });
  }
  // 如果没有 ## 标题，整段作为一个模块
  if (modules.length === 0 && markdown.trim()) {
    modules.push({ title: "📋 完整指导", icon: "📌", content: markdown, color: accentColor, bg: `${accentColor}08` });
  }
  return modules;
}

interface Props {
  content: string;
  accentColor?: string;
  streaming?: boolean;
  /** 额外的前置内容(如识别的题目) */
  prefix?: React.ReactNode;
}

export default function StructuredGuidance({ content, accentColor = "#FF7B5C", streaming = false, prefix }: Props) {
  const modules = parseModules(content, accentColor);

  return (
    <div className="space-y-4">
      {prefix}
      {modules.map((mod, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="bg-white border-2 rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: `${mod.color}25` }}>
          {/* 模块标题栏 */}
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: mod.bg }}>
            <span className="text-lg">{mod.icon}</span>
            <h3 className="text-[14px] font-bold tracking-[0.05em]" style={{ color: mod.color, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
              {mod.title}
            </h3>
          </div>
          {/* 模块内容 */}
          <div className="p-5">
            <div className="markdown-body text-[15px] leading-[1.9] text-[#4D4D5E]"
              style={{ ["--accent-color" as string]: mod.color }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{mod.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      ))}
      {/* 流式输出光标 */}
      {streaming && modules.length > 0 && (
        <span className="cursor-blink" style={{ ["--accent-color" as string]: accentColor }} />
      )}
    </div>
  );
}
