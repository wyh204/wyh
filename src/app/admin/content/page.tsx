"use client";
import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Beaker, FlaskConical, Eye, Sparkles, BookOpen, MessageCircle, FileText } from "lucide-react";
import { subjectMeta } from "@/components/shared/SubjectCard";
import { PHYSICS_EXPERIMENTS, CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";
import type { Subject, Experiment } from "@/types";

const SUBJECTS: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

/* ============ 各学科内容配置 ============ */
interface SubjectContent {
  modes?: { name: string; icon: string; desc: string }[];
  experiments?: Experiment[];
  features?: { icon: string; name: string; desc: string }[];
}

const subjectContent: Record<Subject, SubjectContent> = {
  yuwen: {
    modes: [
      { name: "现代文阅读", icon: "📖", desc: "现代文学鉴赏与分析" },
      { name: "文言文精读", icon: "📜", desc: "古文翻译与注释" },
      { name: "作文辅导", icon: "✍️", desc: "写作技巧与范文" },
      { name: "趣味拓展", icon: "🎭", desc: "成语故事、文字游戏" },
    ],
    features: [
      { icon: "🔤", name: "生字解析", desc: "拼音、部首、笔画数" },
      { icon: "📝", name: "学习笔记", desc: "随时记录学习心得" },
      { icon: "🎯", name: "进度追踪", desc: "分章节学习进度" },
    ],
  },
  math: {
    modes: [
      { name: "文字提问", icon: "💬", desc: "输入数学题目获取解答" },
      { name: "拍照搜题", icon: "📸", desc: "上传题目图片智能识别" },
    ],
    features: [
      { icon: "📐", name: "分步解析", desc: "详细的解题步骤" },
      { icon: "🔢", name: "公式识别", desc: "AI 识别数学公式" },
      { icon: "📊", name: "知识点归纳", desc: "考点与思路总结" },
    ],
  },
  english: {
    modes: [
      { name: "语法精讲", icon: "📝", desc: "英语语法深度解析" },
      { name: "作文指导", icon: "📄", desc: "英语写作辅导" },
      { name: "图片识别", icon: "🖼️", desc: "上传英语内容图片" },
    ],
    features: [
      { icon: "🌐", name: "满分大纲", desc: "结构化写作指导" },
      { icon: "📚", name: "范文示例", desc: "优秀作文参考" },
    ],
  },
  physics: {
    experiments: PHYSICS_EXPERIMENTS,
    features: [
      { icon: "🔬", name: "3D 交互实验", desc: "Three.js 实时渲染" },
      { icon: "📖", name: "实验引导", desc: "分步骤实验教学" },
      { icon: "❓", name: "知识测验", desc: "实验后巩固练习" },
    ],
  },
  chemistry: {
    experiments: CHEMISTRY_EXPERIMENTS,
    features: [
      { icon: "⚗️", name: "3D 交互实验", desc: "Three.js 实时渲染" },
      { icon: "📖", name: "实验引导", desc: "分步骤实验教学" },
      { icon: "❓", name: "知识测验", desc: "实验后巩固练习" },
    ],
  },
};

/* ============ 实验详情弹窗 ============ */
function ExperimentDetailModal({
  experiment,
  subject,
  onClose,
}: {
  experiment: Experiment;
  subject: Subject;
  onClose: () => void;
}) {
  const meta = subjectMeta[subject];
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <motion.div
        className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
        style={{ border: `3px solid ${meta.color}20` }}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-[#B0A0C0] hover:text-[#FF7B5C] hover:bg-[#FFF0EB] transition-all"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: meta.colorBg }}
          >
            {meta.emoji}
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon)" }}>
              {experiment.name}
            </h3>
            <p className="text-[11px] text-[#B0A0C0] font-medium">
              🔬 {experiment.scientist} · {experiment.difficulty || "入门级"}
            </p>
          </div>
        </div>

        <p className="text-[13px] text-[#6B6B7B] leading-relaxed mb-4">{experiment.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] font-bold text-[#8B8B9B] px-3 py-1 rounded-full bg-[#F5F0FA]">
            ID: {experiment.id}
          </span>
          <span
            className="text-[10px] font-bold px-3 py-1 rounded-full"
            style={{ color: meta.color, background: meta.colorBg }}
          >
            {meta.name}
          </span>
        </div>

        {experiment.url && (
          <a
            href={experiment.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.colorLight})` }}
          >
            <Eye className="w-3.5 h-3.5" /> 查看在线实验
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ============ 主页面 ============ */
export default function ContentManagement() {
  const [activeSubject, setActiveSubject] = useState<Subject>("yuwen");
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const content = subjectContent[activeSubject];
  const meta = subjectMeta[activeSubject];

  return (
    <div className="max-w-5xl mx-auto">
      {/* 标题 */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1
          className="text-[28px] font-extrabold text-[#3D3D4E] tracking-[0.04em]"
          style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
        >
          📝 内容管理
        </h1>
        <p className="text-[13px] text-[#8B8B9B] mt-1 font-medium">
          管理各学科的学习内容、实验和功能配置
        </p>
      </motion.div>

      {/* 学科 Tab */}
      <motion.div
        className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.6)", border: "2px solid rgba(180,160,200,0.1)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {SUBJECTS.map((s) => {
          const m = subjectMeta[s];
          const active = s === activeSubject;
          return (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold tracking-[0.04em] transition-all duration-200"
              style={{
                color: active ? m.color : "#8B8B9B",
                background: active ? m.colorBg : "transparent",
                fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif",
              }}
            >
              <span className="text-base">{m.emoji}</span>
              {m.name}
            </button>
          );
        })}
      </motion.div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* 模式和功能 */}
          {content.modes && content.modes.length > 0 && (
            <div className="glass-panel p-6">
              <h3
                className="text-[14px] font-bold text-[#3D3D4E] mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
              >
                <MessageCircle className="w-4 h-4" style={{ color: meta.color }} strokeWidth={2.5} />
                学习模式
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {content.modes.map((mode) => (
                  <div
                    key={mode.name}
                    className="p-4 rounded-2xl border-2 border-[#F0E8F8] hover:border-current transition-all duration-200 cursor-default"
                    style={{ color: meta.color }}
                  >
                    <span className="text-2xl">{mode.icon}</span>
                    <p className="text-[13px] font-bold mt-2" style={{ color: "#3D3D4E" }}>{mode.name}</p>
                    <p className="text-[11px] text-[#B0A0C0] mt-0.5 font-medium">{mode.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 实验列表（物理/化学） */}
          {content.experiments && content.experiments.length > 0 && (
            <div className="glass-panel p-6">
              <h3
                className="text-[14px] font-bold text-[#3D3D4E] mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
              >
                {activeSubject === "physics" ? (
                  <Beaker className="w-4 h-4" style={{ color: meta.color }} strokeWidth={2.5} />
                ) : (
                  <FlaskConical className="w-4 h-4" style={{ color: meta.color }} strokeWidth={2.5} />
                )}
                交互实验
              </h3>
              <div className="space-y-2">
                {content.experiments.map((exp) => {
                  const isExpanded = expandedCard === exp.id;
                  return (
                    <div
                      key={exp.id}
                      className="rounded-2xl border-2 border-[#F0E8F8] overflow-hidden transition-all duration-200"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                            style={{ background: meta.colorBg }}
                          >
                            {meta.emoji}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#3D3D4E] truncate">{exp.name}</p>
                            <p className="text-[11px] text-[#B0A0C0] font-medium">
                              🔬 {exp.scientist} · {exp.difficulty || "入门级"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ color: meta.color, background: meta.colorBg }}
                          >
                            {exp.difficulty || "入门级"}
                          </span>
                          <button
                            onClick={() => setExpandedCard(isExpanded ? null : exp.id)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#B0A0C0] hover:text-[#FF7B5C] hover:bg-[#FFF0EB] transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => setSelectedExperiment(exp)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#B0A0C0] hover:text-[#5BA4E6] hover:bg-[#EBF4FF] transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-4 pb-4 pt-0 text-[12px] text-[#6B6B7B] leading-relaxed"
                              style={{ borderTop: "1px solid #F0E8F8" }}
                            >
                              <p className="pt-3">{exp.description}</p>
                              {exp.url && (
                                <a
                                  href={exp.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold"
                                  style={{ color: meta.color }}
                                >
                                  🔗 查看在线实验 →
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 功能特性 */}
          {content.features && content.features.length > 0 && (
            <div className="glass-panel p-6">
              <h3
                className="text-[14px] font-bold text-[#3D3D4E] mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
              >
                <Sparkles className="w-4 h-4" style={{ color: meta.color }} strokeWidth={2.5} />
                功能特性
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {content.features.map((feat) => (
                  <div
                    key={feat.name}
                    className="flex items-start gap-3 p-4 rounded-2xl border-2 border-[#F0E8F8]"
                  >
                    <span className="text-2xl shrink-0">{feat.icon}</span>
                    <div>
                      <p className="text-[13px] font-bold text-[#3D3D4E]">{feat.name}</p>
                      <p className="text-[11px] text-[#B0A0C0] mt-0.5 font-medium">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 空状态 */}
          {!content.modes && !content.experiments && !content.features && (
            <div className="glass-panel p-12 text-center">
              <span className="text-4xl">📭</span>
              <p className="text-[14px] text-[#B0A0C0] mt-3 font-medium">该学科暂无内容配置</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 实验详情弹窗 */}
      <AnimatePresence>
        {selectedExperiment && (
          <ExperimentDetailModal
            experiment={selectedExperiment}
            subject={activeSubject}
            onClose={() => setSelectedExperiment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
