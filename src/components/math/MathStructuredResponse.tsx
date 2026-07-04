"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ===================================================
   数学结构化回答 — 分模块卡片展示
   =================================================== */

interface MathSection {
  title: string;
  icon: string;
  content: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// 解析 AI 返回的 markdown，按 ## 标题拆分为模块
function parseSections(markdown: string): MathSection[] {
  const sections: MathSection[] = [];
  const lines = markdown.split("\n");
  let currentTitle = "📝 完整解析";
  let currentContent: string[] = [];

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (currentContent.length > 0 && currentContent.join("\n").trim()) {
        sections.push({
          title: currentTitle,
          ...getSectionStyle(currentTitle),
          content: currentContent.join("\n").trim(),
        });
      }
      currentTitle = line.replace(/^##\s+/, "").trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // 最后一段
  if (currentContent.length > 0 && currentContent.join("\n").trim()) {
    sections.push({
      title: currentTitle,
      ...getSectionStyle(currentTitle),
      content: currentContent.join("\n").trim(),
    });
  }

  // 如果没有 ## 标题，整段作为一个模块
  if (sections.length === 0 && markdown.trim()) {
    sections.push({
      title: "📝 完整解析",
      ...getSectionStyle("完整解析"),
      content: markdown,
    });
  }

  return sections;
}

// 根据标题匹配样式
function getSectionStyle(title: string): Omit<MathSection, "title" | "content"> {
  const t = title.toLowerCase();
  if (t.includes("识别") || t.includes("题目")) {
    return { icon: "🔍", color: "#5BA4E6", bgColor: "#EBF4FF", borderColor: "#A0C8F0" };
  }
  if (t.includes("思路") || t.includes("分析")) {
    return { icon: "💡", color: "#6DBE6D", bgColor: "#EDF8ED", borderColor: "#B8E0B8" };
  }
  if (t.includes("步骤") || t.includes("过程") || t.includes("解")) {
    return { icon: "📝", color: "#FF7B5C", bgColor: "#FFF0EB", borderColor: "#FFB09C" };
  }
  if (t.includes("易错") || t.includes("注意") || t.includes("提醒")) {
    return { icon: "⚠️", color: "#FF9A85", bgColor: "#FFF5F3", borderColor: "#FFC4B8" };
  }
  if (t.includes("考点") || t.includes("知识点")) {
    return { icon: "🎯", color: "#B39DDB", bgColor: "#F5F0FA", borderColor: "#D0C0F0" };
  }
  if (t.includes("答案") || t.includes("结果")) {
    return { icon: "✅", color: "#FFCC4D", bgColor: "#FFF9EB", borderColor: "#FFE8A0" };
  }
  // 默认
  return { icon: "📖", color: "#5BA4E6", bgColor: "#EBF4FF", borderColor: "#A0C8F0" };
}

/* ===================================================
   简单数学公式渲染 — 支持常见格式
   =================================================== */
function renderMathText(text: string): (string | JSX.Element)[] {
  // 把文本中的数学表达式用样式包裹
  // 支持: **粗体**, `代码`, 分数 a/b, √x, x², 等
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;

  // 处理行内代码 `...`
  const codeRegex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(text)) !== null) {
    // 前面的普通文本
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // 代码内容用特殊样式
    parts.push(
      <code key={match.index} className="px-1.5 py-0.5 rounded-md text-[13px] font-mono font-bold" style={{ background: "#EBF4FF", color: "#5BA4E6" }}>
        {match[1]}
      </code>
    );
    lastIndex = match.index + match[0].length;
  }
  // 剩余文本
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

interface Props {
  content: string;
  accentColor?: string;
  recognizedText?: string | null;
}

export default function MathStructuredResponse({
  content,
  accentColor = "#5BA4E6",
  recognizedText,
}: Props) {
  const sections = parseSections(content);

  return (
    <div className="space-y-4">
      {/* ─── 识别到的题目 ─── */}
      {recognizedText && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border-2 p-5"
          style={{ background: "#F0F7FF", borderColor: "#A0C8F0" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📷</span>
            <h3 className="text-[14px] font-bold text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
              识别到的题目
            </h3>
          </div>
          <p className="text-[15px] font-bold text-[#3D3D4E] leading-relaxed bg-white rounded-xl p-4 border-2 border-[#D0E4F8]">
            {recognizedText}
          </p>
        </motion.div>
      )}

      {/* ─── 解题模块 ─── */}
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.35 }}
          className="rounded-2xl border-2 overflow-hidden shadow-sm"
          style={{ borderColor: section.borderColor }}
        >
          {/* 模块标题 */}
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ background: section.bgColor }}
          >
            <span className="text-lg">{section.icon}</span>
            <h3
              className="text-[14px] font-bold tracking-[0.05em]"
              style={{ color: section.color, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
            >
              {section.title}
            </h3>
          </div>

          {/* 模块内容 */}
          <div className="p-5 bg-white">
            <div
              className="markdown-body text-[15px] leading-[1.9] text-[#4D4D5E]"
              style={{ ["--accent-color" as string]: section.color }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      ))}

      {/* ─── 底部提示 ─── */}
      {sections.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] text-[#B0A0C0] pt-2"
        >
          💡 记得复习解题方法，多练习类似题型巩固知识哦～
        </motion.p>
      )}
    </div>
  );
}
