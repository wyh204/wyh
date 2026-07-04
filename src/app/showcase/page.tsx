"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Camera,
  FlaskConical,
  BookOpen,
  MessageCircle,
  Heart,
  Zap,
  Users,
  GraduationCap,
  Code2,
  Layers,
  Palette,
  Cpu,
  Rocket,
} from "lucide-react";
import ParticleStars from "@/components/home/ParticleStars";
import { subjectMeta } from "@/components/shared/SubjectCard";
import type { Subject } from "@/types";

const SUBJECTS: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

/* ============ 数字滚动动画 ============ */
function AnimatedCounter({ target, label, suffix = "", delay = 0 }: { target: number; label: string; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const startTime = Date.now() + delay * 1000;
    const step = () => {
      const now = Date.now();
      if (now < startTime) { requestAnimationFrame(step); return; }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(target * eased);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, delay]);

  return (
    <div ref={ref} className="text-center">
      <span
        className="text-[42px] md:text-[56px] font-extrabold tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif", color: "#FF7B5C" }}
      >
        {count}{suffix}
      </span>
      <p className="text-[13px] text-[#8B8B9B] font-bold mt-1">{label}</p>
    </div>
  );
}

/* ============ Section 通用包装 ============ */
function SectionWrapper({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">{children}</div>
    </section>
  );
}

/* ============ Section 标题 ============ */
function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-3xl mb-3 block">{emoji}</span>
      <h2
        className="text-[28px] md:text-[36px] font-extrabold text-[#3D3D4E] tracking-[0.04em]"
        style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
      >
        {title}
      </h2>
      <p className="text-[14px] text-[#8B8B9B] mt-2 font-medium">{subtitle}</p>
    </motion.div>
  );
}

/* ============ 装饰分割线 ============ */
function Divider() {
  return <div className="section-divider max-w-[300px] mx-auto my-0" />;
}

/* ============ 功能卡片数据 ============ */
const features = [
  {
    icon: MessageCircle,
    title: "AI 智能问答",
    desc: "基于 DeepSeek 大模型的智能问答系统，支持多学科、多模态交互，提供专业的学习指导和解答。",
    color: "#FF7B5C",
    bg: "#FFF0EB",
  },
  {
    icon: Camera,
    title: "拍照搜题",
    desc: "上传题目图片即可自动识别并给出详细解答，支持数学公式和英语内容的智能识别与分析。",
    color: "#5BA4E6",
    bg: "#EBF4FF",
  },
  {
    icon: FlaskConical,
    title: "3D 互动实验",
    desc: "基于 Three.js 的交互式物理化学实验，拖动操作、实时反馈，让抽象概念变得直观可感。",
    color: "#B39DDB",
    bg: "#F5F0FA",
  },
  {
    icon: BookOpen,
    title: "五大学科覆盖",
    desc: "全面覆盖语文、数学、英语、物理、化学五大初中核心学科，一站式学习助手。",
    color: "#6DBE6D",
    bg: "#EDF8ED",
  },
  {
    icon: Heart,
    title: "学习收藏",
    desc: "收藏有价值的学习内容，随时回顾复习。本地存储保障隐私，无需注册即可使用。",
    color: "#FFCC4D",
    bg: "#FFF9EB",
  },
  {
    icon: Sparkles,
    title: "趣味互动",
    desc: "童趣卡通风格界面，粒子动效、点击特效、云朵飘动，让学习过程充满乐趣和惊喜。",
    color: "#FF7B5C",
    bg: "#FFF0EB",
  },
];

/* ============ 技术栈数据 ============ */
const techStack = [
  { icon: Layers, name: "Next.js 14", desc: "App Router · SSR · API Routes", color: "#000000" },
  { icon: Code2, name: "React 18", desc: "Hooks · Server Components", color: "#5BA4E6" },
  { icon: Palette, name: "Tailwind CSS", desc: "Utility-first · 马卡龙配色", color: "#38BDF8" },
  { icon: Cpu, name: "DeepSeek AI", desc: "大模型 · 多模态识别", color: "#B39DDB" },
  { icon: Rocket, name: "Three.js", desc: "WebGL · 3D 交互实验", color: "#FF7B5C" },
  { icon: Zap, name: "Framer Motion", desc: "流畅动效 · 页面过渡", color: "#6DBE6D" },
];

/* ============ 团队数据 ============ */
const teamMembers = [
  { name: "桂林理工大学", role: "三下乡实践团队", emoji: "🎓", color: "#FF7B5C" },
  { name: "AI 赋能教育", role: "项目使命", emoji: "🌟", color: "#5BA4E6" },
  { name: "用心陪伴成长", role: "核心价值", emoji: "💝", color: "#6DBE6D" },
];

/* ===================================================
   主页面组件
   =================================================== */
export default function ShowcasePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleStars />

      {/* ========== Hero ========== */}
      <section className="relative pt-28 md:pt-40 pb-20 md:pb-28">
        {/* 光晕装饰 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="glow-orb w-[600px] h-[600px] -top-40 left-[10%]" style={{ background: "radial-gradient(circle, rgba(255,180,140,0.4), transparent 70%)" }} />
          <div className="glow-orb w-[500px] h-[500px] top-20 right-[5%]" style={{ background: "radial-gradient(circle, rgba(150,190,240,0.35), transparent 70%)" }} />
          <div className="glow-orb w-[400px] h-[400px] top-[40%] left-[30%]" style={{ background: "radial-gradient(circle, rgba(200,170,230,0.3), transparent 70%)" }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 标签 */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(255,255,255,0.7)", border: "2px solid rgba(255,180,140,0.25)" }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-sm">🌟</span>
              <span className="text-[12px] font-bold text-[#FF7B5C] tracking-[0.1em]">三下乡 · AI + 教育</span>
              <span className="text-sm">🌟</span>
            </motion.div>

            {/* 主标题 */}
            <h1
              className="text-[48px] md:text-[72px] font-extrabold leading-[1.1] tracking-[0.02em] mb-4"
              style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
            >
              <span className="text-gradient">GLUT AING</span>
              <br />
              <span className="text-[#3D3D4E]">AI 快乐学习乐园</span>
            </h1>

            <p className="text-[16px] md:text-[18px] text-[#6B6B7B] max-w-[600px] mx-auto leading-relaxed font-medium mb-8">
              🌈 AI 驱动的互动学习体验，覆盖五大核心学科
              <br />
              让每一位初中生<strong className="text-[#FF7B5C] font-bold">感受知识的魅力</strong>，快乐成长！
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/#subjects-section"
                className="btn-cartoon"
                style={{
                  background: "linear-gradient(135deg, #FF7B5C 0%, #FFB09C 50%, #FF9A85 100%)",
                  color: "#FFF",
                  boxShadow: "0 6px 28px rgba(255,123,92,0.35)",
                  fontSize: "18px",
                  padding: "16px 40px",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 开始体验 <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </motion.a>
              <motion.a
                href="#background"
                className="btn-cartoon"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  color: "#6B6B7B",
                  border: "3px solid rgba(180,160,200,0.2)",
                  fontSize: "16px",
                  padding: "14px 36px",
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                📖 了解更多
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ========== 项目背景 ========== */}
      <SectionWrapper id="background">
        <SectionTitle emoji="🎯" title="项目背景" subtitle="三下乡社会实践 · AI 赋能乡村教育" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "🏫", title: "项目缘起", text: "桂林理工大学三下乡实践团队深入乡村，发现教育资源不均衡问题。我们希望用 AI 技术缩小教育差距，让每个孩子都能享受优质教育。" },
            { emoji: "🤖", title: "AI 赋能", text: "基于 DeepSeek 大语言模型，打造覆盖语文、数学、英语、物理、化学五大核心学科的智能学习助手，提供个性化学习支持。" },
            { emoji: "🎯", title: "核心目标", text: "通过 AI 互动教学降低学习门槛，激发学习兴趣。让乡村学生也能像城市孩子一样，拥有智能化的学习伙伴。" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="glass-panel p-6 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <span className="text-4xl mb-4 block">{item.emoji}</span>
              <h3
                className="text-[16px] font-bold text-[#3D3D4E] mb-2"
                style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
              >
                {item.title}
              </h3>
              <p className="text-[13px] text-[#6B6B7B] leading-relaxed font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <Divider />

      {/* ========== 核心功能 ========== */}
      <SectionWrapper id="features">
        <SectionTitle emoji="✨" title="核心功能" subtitle="六大核心能力 · 全方位学习支持" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="content-card p-6 group cursor-default"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: feat.bg }}
              >
                <feat.icon className="w-5 h-5" style={{ color: feat.color }} strokeWidth={2.5} />
              </div>
              <h3 className="text-[15px] font-bold text-[#3D3D4E] mb-2">{feat.title}</h3>
              <p className="text-[12px] text-[#8B8B9B] leading-relaxed font-medium">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <Divider />

      {/* ========== 学科展示 ========== */}
      <SectionWrapper id="subjects">
        <SectionTitle emoji="📚" title="学科展示" subtitle="五大核心学科 · 一站式学习体验" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {SUBJECTS.map((s, i) => {
            const meta = subjectMeta[s];
            return (
              <motion.div
                key={s}
                className="subject-card group flex flex-col items-center p-6 text-center cursor-pointer"
                style={{ ["--accent-color" as string]: meta.color, ["--accent-color-light" as string]: meta.colorLight }}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -6, scale: 1.04 }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative"
                  style={{ background: meta.colorBg, border: `3px solid ${meta.color}30`, boxShadow: `0 4px 16px ${meta.color}20` }}
                >
                  <span className="text-[38px]">{meta.emoji}</span>
                </div>
                <p
                  className="text-[15px] font-bold tracking-[0.08em]"
                  style={{ color: meta.color, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
                >
                  {meta.name}
                </p>
                <p className="text-[11px] text-[#B0A0C0] mt-1 font-medium">{meta.enName}</p>
                <p className="text-[12px] text-[#8B8B9B] mt-3 leading-relaxed">{meta.desc}</p>
                <Link
                  href={`/${s}`}
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full text-[11px] font-bold transition-all hover:scale-105"
                  style={{ color: "#FFF", background: `linear-gradient(135deg, ${meta.color}, ${meta.colorLight})` }}
                >
                  进入学习 <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      <Divider />

      {/* ========== 技术栈 ========== */}
      <SectionWrapper id="tech">
        <SectionTitle emoji="🛠️" title="技术栈" subtitle="现代化技术架构 · 极致学习体验" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="glass-panel p-5 text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -4 }}
            >
              <tech.icon
                className="w-8 h-8 mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ color: tech.color }}
                strokeWidth={2}
              />
              <p className="text-[13px] font-bold text-[#3D3D4E]">{tech.name}</p>
              <p className="text-[10px] text-[#B0A0C0] mt-1 font-medium">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <Divider />

      {/* ========== 团队介绍 ========== */}
      <SectionWrapper id="team">
        <SectionTitle emoji="👨‍🎓" title="团队介绍" subtitle="桂林理工大学 · 三下乡实践团队" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              className="glass-panel p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.45 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                style={{ background: `${member.color}18` }}
              >
                {member.emoji}
              </div>
              <h3
                className="text-[16px] font-bold text-[#3D3D4E]"
                style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
              >
                {member.name}
              </h3>
              <p
                className="text-[12px] font-bold mt-1 px-3 py-0.5 rounded-full inline-block"
                style={{ color: member.color, background: `${member.color}15` }}
              >
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <Divider />

      {/* ========== 数据亮点 ========== */}
      <SectionWrapper id="stats">
        <SectionTitle emoji="📊" title="数据亮点" subtitle="AI 赋能教育的实践成果" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <AnimatedCounter target={5} label="覆盖学科" delay={0} />
          <AnimatedCounter target={8} label="3D 互动实验" delay={0.2} />
          <AnimatedCounter target={12} label="AI 能力项" delay={0.4} />
          <AnimatedCounter target={100} label="持续优化中" suffix="%" delay={0.6} />
        </div>
      </SectionWrapper>

      {/* ========== 底部 CTA ========== */}
      <section className="relative py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="glow-orb w-[500px] h-[500px] top-0 left-[30%]" style={{ background: "radial-gradient(circle, rgba(255,200,150,0.3), transparent 70%)" }} />
        </div>
        <motion.div
          className="max-w-2xl mx-auto px-6 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-4xl mb-4 block">🌟</span>
          <h2
            className="text-[32px] md:text-[40px] font-extrabold text-[#3D3D4E] mb-4"
            style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
          >
            准备好开始探索了吗？
          </h2>
          <p className="text-[15px] text-[#6B6B7B] mb-8 font-medium">
            AI 驱动 · 互动探索 · 快乐学习
          </p>
          <motion.a
            href="/#subjects-section"
            className="btn-cartoon inline-flex"
            style={{
              background: "linear-gradient(135deg, #FF7B5C 0%, #FFB09C 50%, #FF9A85 100%)",
              color: "#FFF",
              boxShadow: "0 8px 32px rgba(255,123,92,0.4)",
              fontSize: "20px",
              padding: "18px 48px",
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 立即体验 <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </motion.a>
        </motion.div>
      </section>

      {/* 底部版权 */}
      <footer className="py-8 border-t-2 border-[#F0E8F8]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,248,240,0.8))" }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">🌟</span>
            <p className="text-[12px] tracking-[0.1em] text-[#8B8B9B] font-bold" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
              POWERED BY DEEPSEEK AI
            </p>
            <span className="text-lg">🌟</span>
          </div>
          <p className="text-[11px] tracking-[0.08em] text-[#B0A0C0] font-medium">
            桂林理工大学 三下乡 · GLUT AING EDUCATION
          </p>
          <p className="text-[10px] tracking-[0.06em] text-[#CCC0D8] mt-1">
            ❤️ 让学习变得更快乐，让知识变得更有趣 ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
