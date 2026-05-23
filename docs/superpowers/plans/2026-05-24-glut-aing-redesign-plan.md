# GLUT Aing Education 前端重设计 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将整个前端重设计为 Lando Norris 风格 — 暗色基底 + 字重对比字体 + 学科色底线 + 6 项动效 + Markdown 渲染 + 流式 AI + R3F 实验器材

**Architecture:** 保留现有 Next.js 14 App Router 骨架，逐文件替换视觉层。CSS 从毛玻璃圆角转为 `#0d0d1a` 纯色 + `4px` 微圆 + 左侧/底部色条。字体用系统黑体 900 vs 300 字重对比。AI 增加流式 SSE 通道，前端逐 token 追加。实验 Canvas 替换为 R3F 场景。

**Tech Stack:** Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Three.js/R3F/drei + react-markdown + remark-gfm

---

### Task 1: 基础依赖 + CSS 系统

**Files:**
- Modify: `package.json`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 安装 react-markdown + remark-gfm**

```bash
npm install react-markdown remark-gfm
```

- [ ] **Step 2: 运行 build 确认依赖无冲突**

```bash
npm run build
```
Expected: 构建成功，无新增 TypeScript 错误。

- [ ] **Step 3: 重写 globals.css 为 Lando 风格**

替换整个文件内容：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
    background: #0a0a0f;
    color: rgba(255, 255, 255, 0.65);
    min-height: 100vh;
    overflow-x: hidden;
  }
  ::selection {
    background: rgba(167, 139, 250, 0.3);
    color: #fff;
  }
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
  }
}

@layer components {
  /* Lando content card */
  .content-card {
    background: #0d0d1a;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 4px;
  }
  .content-card:hover {
    border-color: rgba(255, 255, 255, 0.1);
  }

  /* Left accent bar */
  .accent-left {
    border-left: 3px solid var(--accent-color, #a78bfa);
  }

  /* Bottom accent bar */
  .accent-bottom {
    position: relative;
  }
  .accent-bottom::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: var(--accent-color, #a78bfa);
    transition: width 0.3s ease;
  }
  .accent-bottom:hover::after {
    width: 100%;
  }

  /* Ghost nav glass */
  .nav-glass {
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  /* Drawer glass */
  .drawer-glass {
    background: rgba(13, 13, 26, 0.95);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.06);
  }

  /* Markdown prose */
  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3 {
    color: var(--accent-color, #a78bfa);
    font-weight: 700;
    letter-spacing: 0.04em;
    margin-top: 1.2em;
    margin-bottom: 0.4em;
  }
  .markdown-body h3 {
    font-size: 15px;
  }
  .markdown-body strong {
    color: var(--accent-color, #a78bfa);
    font-weight: 700;
  }
  .markdown-body p {
    margin-bottom: 0.8em;
    line-height: 1.8;
  }
  .markdown-body ul,
  .markdown-body ol {
    padding-left: 1.2em;
    margin-bottom: 0.8em;
  }
  .markdown-body li {
    margin-bottom: 0.3em;
  }

  /* Blinking cursor for streaming */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .cursor-blink {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--accent-color, #a78bfa);
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
    margin-left: 2px;
  }
}
```

- [ ] **Step 4: 运行 dev 确认 CSS 生效**

```bash
npm run dev
```
访问 `http://localhost:3000`，确认背景色变为 `#0a0a0f`，整体无样式崩坏。

- [ ] **Step 5: 提交**

```bash
git add package.json package-lock.json src/app/globals.css
git commit -m "feat: install react-markdown + rewrite globals.css for Lando style"
```

---

### Task 2: ResultCard 重写 — Markdown 渲染 + 流式模式

**Files:**
- Modify: `src/components/shared/ResultCard.tsx`

- [ ] **Step 1: 重写 ResultCard.tsx**

将整个文件替换为：

```tsx
"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Heart, Check } from "lucide-react";
import { useState } from "react";
import { cn, copyToClipboard } from "@/lib/utils";
import type { HistoryItem } from "@/types";

interface Props {
  content: string;
  item: HistoryItem;
  isFav: boolean;
  onToggleFavorite: () => void;
  accentColor?: string;
  streaming?: boolean;
}

export default function ResultCard({
  content,
  item,
  isFav,
  onToggleFavorite,
  accentColor = "#a78bfa",
  streaming = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-0"
    >
      {/* Left accent bar — grows with content */}
      <div
        className="w-[3px] rounded-full flex-shrink-0 mr-6"
        style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}40)` }}
      />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-[10px] tracking-[0.15em] font-bold uppercase"
            style={{ color: accentColor }}
          >
            AI 回 答
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopy}
              className="text-[10px] tracking-[0.08em] text-white/30 hover:text-white/60 transition-colors"
            >
              {copied ? "已复制" : "复制"}
            </button>
            <button
              onClick={onToggleFavorite}
              className={cn(
                "text-[10px] tracking-[0.08em] transition-colors",
                isFav ? "text-red-400" : "text-white/30 hover:text-red-400"
              )}
            >
              {isFav ? "已收藏" : "收藏"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="markdown-body text-[14px] leading-relaxed text-white/65"
          style={{ ["--accent-color" as string]: accentColor }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
          {streaming && <span className="cursor-blink" style={{ ["--accent-color" as string]: accentColor }} />}
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```
Expected: 零错误。

- [ ] **Step 3: 提交**

```bash
git add src/components/shared/ResultCard.tsx
git commit -m "feat: rewrite ResultCard with react-markdown rendering + streaming cursor + accent bar"
```

---

### Task 3: 共享组件重写 — SubjectCard / ModeSelector / InputPanel / ExperimentCard

**Files:**
- Modify: `src/components/shared/SubjectCard.tsx`
- Modify: `src/components/shared/ModeSelector.tsx`
- Modify: `src/components/shared/InputPanel.tsx`
- Modify: `src/components/experiment/ExperimentCard.tsx`

- [ ] **Step 1: 重写 SubjectCard.tsx 为 Lando 纵向卡片**

```tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Globe, Atom, FlaskConical, type LucideIcon } from "lucide-react";
import type { Subject } from "@/types";
import { cn } from "@/lib/utils";

const subjectMeta: Record<Subject, { name: string; color: string; Icon: LucideIcon; desc: string; enName: string }> = {
  yuwen: { name: "语 文", color: "#a78bfa", Icon: BookOpen, desc: "现代文学鉴赏 · 古文精读 · 作文辅导", enName: "Chinese" },
  math: { name: "数 学", color: "#60a5fa", Icon: Calculator, desc: "智能解题 · 数学史故事 · 考点分析", enName: "Math" },
  english: { name: "英 语", color: "#34d399", Icon: Globe, desc: "语法精讲 · 作文指导 · 满分大纲", enName: "English" },
  physics: { name: "物 理", color: "#c084fc", Icon: Atom, desc: "交互式实验 · 物理学家故事", enName: "Physics" },
  chemistry: { name: "化 学", color: "#f0a040", Icon: FlaskConical, desc: "交互式实验 · 化学家故事", enName: "Chemistry" },
};

export default function SubjectCard({ subject }: { subject: Subject }) {
  const meta = subjectMeta[subject];

  return (
    <Link href={`/${subject}`}>
      <motion.div
        className="content-card p-6 cursor-pointer group relative overflow-hidden h-full"
        whileHover={{ y: -2 }}
        style={{ ["--accent-color" as string]: meta.color }}
      >
        {/* Top gradient glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${meta.color}0D, transparent)` }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Label */}
          <div
            className="text-[10px] tracking-[0.2em] font-bold mb-4"
            style={{ color: meta.color }}
          >
            {meta.name}
          </div>

          {/* Description */}
          <p className="text-[13px] leading-relaxed text-white/40 mb-6 flex-1">
            {meta.desc}
          </p>

          {/* English decorative */}
          <p className="text-[10px] tracking-[0.1em] text-white/10 font-light italic">
            {meta.enName}
          </p>
        </div>

        {/* Bottom accent bar — expands on hover */}
        <div
          className="absolute bottom-0 left-0 h-[3px] transition-all duration-300 ease-out group-hover:w-full"
          style={{ background: meta.color, width: "0%" }}
        />
      </motion.div>
    </Link>
  );
}

export { subjectMeta };
```

- [ ] **Step 2: 重写 ModeSelector.tsx 为 Lando underline 样式**

```tsx
"use client";
import { cn } from "@/lib/utils";

interface ModeOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: ModeOption<T>[];
  value: T;
  onChange: (v: T) => void;
}

export default function ModeSelector<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex gap-0 border-b border-white/[0.06]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-6 py-3 text-[12px] tracking-[0.08em] font-medium transition-all duration-200 border-b-[2px] -mb-[1px]",
            value === opt.value
              ? "text-white border-current"
              : "text-white/20 border-transparent hover:text-white/40"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: 重写 InputPanel.tsx 为 Lando 单行输入**

```tsx
"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  placeholder?: string;
  onSubmit: (input: string) => void;
  loading?: boolean;
  disabled?: boolean;
  maxLength?: number;
  accentColor?: string;
}

export default function InputPanel({
  placeholder = "请输入你想了解的内容...",
  onSubmit,
  loading = false,
  disabled = false,
  maxLength = 500,
  accentColor = "#a78bfa",
}: Props) {
  const [input, setInput] = useState("");

  function handleSubmit() {
    if (!input.trim() || loading || disabled) return;
    onSubmit(input.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-3 items-stretch">
      <div className="flex-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={1}
          className={cn(
            "w-full h-full bg-[#0d0d1a] border border-white/[0.06] rounded-[4px] px-5 py-4",
            "text-white/65 placeholder-white/15",
            "focus:outline-none focus:border-white/15",
            "resize-none transition-all duration-200 text-[13px] tracking-[0.02em]",
          )}
          style={{ ["--accent-color" as string]: accentColor }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || disabled || !input.trim()}
        className={cn(
          "px-8 rounded-[4px] font-bold text-[12px] tracking-[0.1em] flex items-center gap-2 transition-all duration-200",
          "disabled:opacity-30 disabled:cursor-not-allowed text-[#0a0a0f]",
        )}
        style={{ background: loading ? `${accentColor}80` : accentColor }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        发 送
      </button>
    </div>
  );
}
```

- [ ] **Step 4: 重写 ExperimentCard.tsx 为 Lando 风格**

```tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Zap, Waves, Camera, Flame, Beaker, TestTube, Droplet, type LucideIcon } from "lucide-react";
import type { Experiment } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  sun: Sun, zap: Zap, waves: Waves, camera: Camera,
  flame: Flame, beaker: Beaker, "test-tube": TestTube, droplet: Droplet,
};

interface Props {
  experiment: Experiment;
  color: string;
  href: string;
}

export default function ExperimentCard({ experiment, color, href }: Props) {
  const Icon = iconMap[experiment.icon] || Beaker;

  return (
    <Link href={href}>
      <motion.div
        className="content-card p-6 cursor-pointer group h-full"
        whileHover={{ y: -2 }}
        style={{ ["--accent-color" as string]: color }}
      >
        <div className="flex items-start gap-5">
          <div
            className="p-3 rounded-[4px] flex-shrink-0"
            style={{ background: `${color}0D` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold mb-1.5 text-white/80 tracking-[0.03em]">
              {experiment.name}
            </h3>
            <p className="text-[12px] text-white/30 mb-3 leading-relaxed">
              {experiment.description}
            </p>
            <span
              className="text-[10px] tracking-[0.1em] font-bold"
              style={{ color }}
            >
              {experiment.scientist}
            </span>
          </div>
        </div>

        {/* Bottom accent bar on hover */}
        <div
          className="h-[3px] mt-5 transition-all duration-300 ease-out group-hover:w-full rounded-full"
          style={{ background: color, width: "0%" }}
        />
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 5: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: 提交**

```bash
git add src/components/shared/SubjectCard.tsx src/components/shared/ModeSelector.tsx src/components/shared/InputPanel.tsx src/components/experiment/ExperimentCard.tsx
git commit -m "feat: rewrite SubjectCard/ModeSelector/InputPanel/ExperimentCard in Lando style"
```

---

### Task 4: SpotlightCursor + Navbar + ThreeParticles 更新

**Files:**
- Create: `src/components/three/SpotlightCursor.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/three/ThreeParticles.tsx`

- [ ] **Step 1: 创建 SpotlightCursor.tsx**

```tsx
"use client";
import { useState, useEffect, useCallback } from "react";

interface Props {
  color?: string;
  size?: number;
}

export default function SpotlightCursor({ color = "#a78bfa", size = 300 }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => setVisible(false), []);
  const handleMouseEnter = useCallback(() => setVisible(true), []);

  useEffect(() => {
    const hero = document.getElementById("hero-area");
    if (!hero) return;

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);
    hero.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
      hero.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  return (
    <div
      className="fixed pointer-events-none z-0 transition-opacity duration-500"
      style={{
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}0F 0%, ${color}03 40%, transparent 70%)`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
```

- [ ] **Step 2: 重写 Navbar.tsx 为 Lando 极简导航**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import HistoryDrawer from "@/components/shared/HistoryDrawer";
import FavoriteDrawer from "@/components/shared/FavoriteDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#a78bfa]" />
            <span className="text-[14px] font-bold tracking-[0.08em] text-white">
              GLUT AING
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setHistoryOpen(true)}
              className="text-[10px] tracking-[0.12em] font-medium text-white/30 hover:text-white/60 transition-colors"
            >
              历史
            </button>
            <button
              onClick={() => setFavOpen(true)}
              className="text-[10px] tracking-[0.12em] font-medium text-white/30 hover:text-white/60 transition-colors"
            >
              收藏
            </button>
          </div>
        </div>
      </nav>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <FavoriteDrawer open={favOpen} onClose={() => setFavOpen(false)} />
    </>
  );
}
```

- [ ] **Step 3: 更新 ThreeParticles.tsx 支持视差滚动**

```tsx
"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ color = "#a78bfa", scrollY = 0 }: { color?: string; scrollY?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003;
      pointsRef.current.rotation.x += 0.0001;
      // Parallax: slow upward drift on scroll
      pointsRef.current.position.y = scrollY * 0.0003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={color} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

interface Props {
  color?: string;
  scrollY?: number;
}

export default function ThreeParticles({ color, scrollY = 0 }: Props) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        dpr={[1, 1]}
        gl={{ alpha: true, antialias: false }}
      >
        <Particles color={color} scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: 提交**

```bash
git add src/components/three/SpotlightCursor.tsx src/components/layout/Navbar.tsx src/components/three/ThreeParticles.tsx
git commit -m "feat: add SpotlightCursor + Lando Navbar + parallax ThreeParticles"
```

---

### Task 5: 首页重写

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 重写 page.tsx 为 Lando Hero 风格**

```tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SubjectCard from "@/components/shared/SubjectCard";
import SpotlightCursor from "@/components/three/SpotlightCursor";
import type { Subject } from "@/types";

const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), { ssr: false });

const subjects: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

const heroChars = ["探", "索", " · ", "知", "识", " · ", "宇", "宙"];

function HeroTitle() {
  return (
    <div className="mb-4">
      <motion.div
        className="flex flex-wrap items-baseline gap-x-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
        }}
      >
        {heroChars.map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[56px] md:text-[72px] font-[900] tracking-[0.04em] leading-[1.1] text-white"
            style={{
              borderBottom: char !== " · " && char !== " " ? "4px solid" : "none",
              borderColor:
                i < 2 ? "#a78bfa" : i < 5 ? "#60a5fa" : i < 8 ? "#34d399" : "transparent",
              paddingBottom: char !== " · " ? "4px" : "0",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-[20px] md:text-[24px] font-[300] italic tracking-[-0.02em] text-white mt-2"
      >
        Universe
      </motion.p>
    </div>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeBackground />

      {/* Hero area with spotlight */}
      <div id="hero-area" className="relative">
        <SpotlightCursor color="#a78bfa" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-12 md:pt-28 md:pb-20">
          <HeroTitle />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="text-[13px] md:text-[14px] text-white/30 tracking-[0.04em] leading-relaxed max-w-[440px] mb-16"
          >
            AI 驱动的互动学习体验，覆盖语文、数学、英语、物理、化学五大学科。让每一位中小学生感受知识的魅力。
          </motion.p>
        </div>
      </div>

      {/* Subject cards grid */}
      <motion.div
        className="max-w-6xl mx-auto px-6 md:px-12 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {subjects.map((subject) => (
          <motion.div
            key={subject}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SubjectCard subject={subject} />
          </motion.div>
        ))}
      </motion.div>

      {/* Footer tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1.5 }}
        className="text-center text-[10px] tracking-[0.15em] text-white pb-12"
      >
        POWERED BY DEEPSEEK AI · GLUT 三下乡
      </motion.p>
    </div>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译 + dev 测试**

```bash
npx tsc --noEmit && npm run dev
```
访问 `http://localhost:3000` 确认：标题逐字淡入、聚光灯跟踪鼠标、5 张学科卡片 hover 光晕。

- [ ] **Step 3: 提交**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite homepage with Lando Hero + character reveal + spotlight cursor"
```

---

### Task 6: 语文 + 数学 + 英语页面重写

**Files:**
- Modify: `src/app/yuwen/page.tsx`
- Modify: `src/app/math/page.tsx`
- Modify: `src/app/english/page.tsx`

- [ ] **Step 1: 重写 yuwen/page.tsx**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ResultCard from "@/components/shared/ResultCard";
import ModeSelector from "@/components/shared/ModeSelector";
import InputPanel from "@/components/shared/InputPanel";
import HookList from "@/components/shared/HookList";
import type { YuwenMode, HistoryItem, EssayHook } from "@/types";
import { generateId } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#a78bfa";

const modeOptions = [
  { value: "modern" as const, label: "现代文学" },
  { value: "classical" as const, label: "古文学习" },
  { value: "essay" as const, label: "作文 HELP" },
];

export default function YuwenPage() {
  const [mode, setMode] = useState<YuwenMode>("modern");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { addHistory, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHooks(null);
    setStreaming(true);

    try {
      const res = await fetch("/api/yuwen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError({ message: json.error, code: json.code });
        setStreaming(false);
        setLoading(false);
        return;
      }

      const json = await res.json();
      setStreaming(false);

      if (mode === "essay" && json.data.hooks?.length) {
        setHooks(json.data.hooks);
      } else if (json.data.raw) {
        setResult(json.data.raw);
      }

      const item: HistoryItem = {
        id: generateId(),
        subject: "yuwen",
        mode,
        input,
        output: json.data.raw || "",
        timestamp: Date.now(),
      };
      setCurrentItem(item);
      addHistory(item);
    } catch {
      setError({ message: "网络错误" });
      setStreaming(false);
    } finally {
      setLoading(false);
    }
  }, [mode, addHistory]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 语 文</p>

        {/* Title */}
        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">
            语 文
          </h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">Chinese</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          现代文学鉴赏 · 古文精读 · 作文辅导。选择学习模式，开启深度语文之旅。
        </p>

        <ModeSelector options={modeOptions} value={mode} onChange={setMode} />

        <div className="mt-8">
          <InputPanel
            placeholder={
              mode === "essay"
                ? "输入作文主题..."
                : mode === "classical"
                  ? "输入古文篇名..."
                  : "输入文章篇名..."
            }
            onSubmit={handleSubmit}
            loading={loading}
            accentColor={ACCENT}
          />
        </div>

        {loading && <div className="mt-8"><SkeletonLoader /></div>}

        {result && currentItem && (
          <div className="mt-10">
            <ResultCard
              content={result}
              item={currentItem}
              isFav={favorites.some((f) => f.id === currentItem.id)}
              onToggleFavorite={() => toggleFavorite(currentItem)}
              accentColor={ACCENT}
              streaming={streaming}
            />
          </div>
        )}

        {hooks && <div className="mt-10"><HookList hooks={hooks} /></div>}

        {error && (
          <ErrorToast
            message={error.message}
            code={error.code}
            onRetry={() => {}}
            onDismiss={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 重写 math/page.tsx（相似结构，无模式选择）**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ResultCard from "@/components/shared/ResultCard";
import InputPanel from "@/components/shared/InputPanel";
import type { HistoryItem } from "@/types";
import { generateId } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#60a5fa";

export default function MathPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { addHistory, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStreaming(true);

    try {
      const res = await fetch("/api/math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError({ message: json.error, code: json.code });
        setStreaming(false);
        setLoading(false);
        return;
      }

      const json = await res.json();
      setStreaming(false);
      setResult(json.data.raw);

      const item: HistoryItem = {
        id: generateId(),
        subject: "math",
        input,
        output: json.data.raw || "",
        timestamp: Date.now(),
      };
      setCurrentItem(item);
      addHistory(item);
    } catch {
      setError({ message: "网络错误" });
      setStreaming(false);
    } finally {
      setLoading(false);
    }
  }, [addHistory]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 数 学</p>

        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">
            数 学
          </h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">Math</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          智能解题 · 数学史故事 · 考点分析。输入题目，获取完整分析和解答过程。
        </p>

        <InputPanel
          placeholder="输入数学题目..."
          onSubmit={handleSubmit}
          loading={loading}
          accentColor={ACCENT}
        />

        {loading && <div className="mt-8"><SkeletonLoader /></div>}

        {result && currentItem && (
          <div className="mt-10">
            <ResultCard
              content={result}
              item={currentItem}
              isFav={favorites.some((f) => f.id === currentItem.id)}
              onToggleFavorite={() => toggleFavorite(currentItem)}
              accentColor={ACCENT}
              streaming={streaming}
            />
          </div>
        )}

        {error && (
          <ErrorToast
            message={error.message}
            code={error.code}
            onRetry={() => {}}
            onDismiss={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 重写 english/page.tsx（与 yuwen 相同结构，英语模式）**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ResultCard from "@/components/shared/ResultCard";
import ModeSelector from "@/components/shared/ModeSelector";
import InputPanel from "@/components/shared/InputPanel";
import HookList from "@/components/shared/HookList";
import type { EnglishMode, HistoryItem, EssayHook } from "@/types";
import { generateId } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#34d399";

const modeOptions = [
  { value: "grammar" as const, label: "语法指导" },
  { value: "essay" as const, label: "作文指导" },
];

export default function EnglishPage() {
  const [mode, setMode] = useState<EnglishMode>("grammar");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [outline, setOutline] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { addHistory, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHooks(null);
    setOutline(null);
    setGuidance(null);
    setStreaming(true);

    try {
      const res = await fetch("/api/english", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError({ message: json.error, code: json.code });
        setStreaming(false);
        setLoading(false);
        return;
      }

      const json = await res.json();
      setStreaming(false);

      if (mode === "essay") {
        if (json.data.outline) setOutline(json.data.outline);
        if (json.data.guidance) setGuidance(json.data.guidance);
        if (json.data.hooks?.length) setHooks(json.data.hooks);
      } else if (json.data.raw) {
        setResult(json.data.raw);
      }

      const item: HistoryItem = {
        id: generateId(),
        subject: "english",
        mode,
        input,
        output: json.data.raw || "",
        timestamp: Date.now(),
      };
      setCurrentItem(item);
      addHistory(item);
    } catch {
      setError({ message: "网络错误" });
      setStreaming(false);
    } finally {
      setLoading(false);
    }
  }, [mode, addHistory]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 英 语</p>

        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">
            英 语
          </h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">English</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          语法精讲 · 作文指导 · 满分大纲。选择学习模式，获取专业英语辅导。
        </p>

        <ModeSelector options={modeOptions} value={mode} onChange={setMode} />

        <div className="mt-8">
          <InputPanel
            placeholder={mode === "essay" ? "输入文体和主题..." : "输入英文句子或中文语法描述..."}
            onSubmit={handleSubmit}
            loading={loading}
            accentColor={ACCENT}
          />
        </div>

        {loading && <div className="mt-8"><SkeletonLoader /></div>}

        {outline && (
          <div className="mt-10">
            <div className="content-card p-6 accent-left" style={{ ["--accent-color" as string]: ACCENT }}>
              <h3 className="text-[12px] tracking-[0.1em] font-bold mb-3" style={{ color: ACCENT }}>作文大纲</h3>
              <div className="markdown-body text-[14px] text-white/65" style={{ ["--accent-color" as string]: ACCENT }}>
                {outline}
              </div>
            </div>
          </div>
        )}

        {guidance && (
          <div className="mt-4">
            <div className="content-card p-6 accent-left" style={{ ["--accent-color" as string]: ACCENT }}>
              <h3 className="text-[12px] tracking-[0.1em] font-bold mb-3" style={{ color: ACCENT }}>写作指导</h3>
              <div className="markdown-body text-[14px] text-white/65" style={{ ["--accent-color" as string]: ACCENT }}>
                {guidance}
              </div>
            </div>
          </div>
        )}

        {result && currentItem && (
          <div className="mt-10">
            <ResultCard
              content={result}
              item={currentItem}
              isFav={favorites.some((f) => f.id === currentItem.id)}
              onToggleFavorite={() => toggleFavorite(currentItem)}
              accentColor={ACCENT}
              streaming={streaming}
            />
          </div>
        )}

        {hooks && <div className="mt-10"><HookList hooks={hooks} /></div>}

        {error && (
          <ErrorToast
            message={error.message}
            code={error.code}
            onRetry={() => {}}
            onDismiss={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: 提交**

```bash
git add src/app/yuwen/page.tsx src/app/math/page.tsx src/app/english/page.tsx
git commit -m "feat: rewrite yuwen/math/english pages in Lando style with markdown + streaming"
```

---

### Task 7: 物理 + 化学列表页重写

**Files:**
- Modify: `src/app/physics/page.tsx`
- Modify: `src/app/chemistry/page.tsx`

- [ ] **Step 1: 重写 physics/page.tsx**

```tsx
"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ExperimentCard from "@/components/experiment/ExperimentCard";
import { PHYSICS_EXPERIMENTS } from "@/lib/experiments";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#c084fc";

export default function PhysicsPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 物 理</p>

        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">
            物 理
          </h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">Physics</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          交互式实验 · 物理学家的故事。点击实验卡片，进入沉浸式学习体验。
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {PHYSICS_EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ExperimentCard experiment={exp} color={ACCENT} href={`/physics/${exp.id}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 重写 chemistry/page.tsx（同结构，色不同）**

```tsx
"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ExperimentCard from "@/components/experiment/ExperimentCard";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#f0a040";

export default function ChemistryPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">课程 / 化 学</p>

        <div className="mb-2">
          <h2 className="text-[48px] md:text-[56px] font-[900] tracking-[0.04em] leading-[1.1] text-white">
            化 学
          </h2>
          <p className="text-[18px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">Chemistry</p>
        </div>
        <p className="text-[13px] text-white/30 tracking-[0.04em] mb-10 max-w-[380px]">
          交互式实验 · 化学家的故事。点击实验卡片，进入沉浸式学习体验。
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {CHEMISTRY_EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ExperimentCard experiment={exp} color={ACCENT} href={`/chemistry/${exp.id}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: 提交**

```bash
git add src/app/physics/page.tsx src/app/chemistry/page.tsx
git commit -m "feat: rewrite physics/chemistry list pages in Lando style with scroll reveal"
```

---

### Task 8: HookCard + HookList + ErrorToast + SkeletonLoader Lando 调整

**Files:**
- Modify: `src/components/shared/HookCard.tsx`
- Modify: `src/components/shared/HookList.tsx`
- Modify: `src/components/shared/ErrorToast.tsx`
- Modify: `src/components/shared/SkeletonLoader.tsx`

- [ ] **Step 1: 更新 HookCard.tsx（Lando 卡片 + 底部色条）**

```tsx
import type { EssayHook } from "@/types";

interface Props {
  hook: EssayHook;
  index: number;
}

const styleColorMap: Record<string, string> = {
  "温情": "#f472b6", "励志": "#fbbf24", "哲理": "#a78bfa", "幽默": "#34d399",
  "悬念": "#f87171", "诗意": "#60a5fa", "对比": "#fb923c", "反问": "#c084fc",
  "排比": "#4ade80", "叙事": "#f0a040",
};

export default function HookCard({ hook, index }: Props) {
  const color = Object.entries(styleColorMap).find(([k]) => hook.styleTag.includes(k))?.[1] || "#a78bfa";

  return (
    <div className="content-card p-5 group transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.12em] text-white/20 font-bold">#{index + 1}</span>
        <span
          className="px-2 py-0.5 rounded-[2px] text-[10px] tracking-[0.08em] font-bold"
          style={{ background: `${color}15`, color }}
        >
          {hook.styleTag}
        </span>
      </div>
      <p className="text-[13px] text-white/70 leading-relaxed mb-3">{hook.hookText}</p>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/25">{hook.reason}</p>
        <span className="text-[11px] font-bold" style={{ color }}>{hook.clickBaitScore}/10</span>
      </div>
      <div
        className="h-[2px] mt-4 transition-all duration-300 ease-out group-hover:w-full rounded-full"
        style={{ background: color, width: "0%" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: 更新 HookList.tsx（调整容器样式）**

```tsx
"use client";
import { motion } from "framer-motion";
import HookCard from "./HookCard";
import type { EssayHook } from "@/types";
import { Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

interface Props {
  hooks: EssayHook[];
  accentColor?: string;
}

export default function HookList({ hooks, accentColor = "#a78bfa" }: Props) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const text = hooks.map((h, i) => `【${i + 1}】${h.styleTag}\n${h.hookText}`).join("\n\n");
    await copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[12px] tracking-[0.12em] font-bold text-white/40 uppercase">
          爆款开头结尾 Hook
        </h3>
        <button
          onClick={handleCopyAll}
          className="text-[10px] tracking-[0.08em] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
        >
          <Copy className="w-3 h-3" />
          {copiedAll ? "已复制全部" : "一键复制"}
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
```

- [ ] **Step 3: 更新 ErrorToast.tsx（Lando 风格）**

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export default function ErrorToast({ message, code, onRetry, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const brandMessage = code === "NO_API_KEY"
    ? "API Key 未配置，请在 .env.local 中设置 DEEPSEEK_API_KEY"
    : code === "TIMEOUT"
    ? "AI 响应超时，请稍后重试"
    : message;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mt-6 content-card p-5 flex items-start gap-4"
        style={{ borderColor: "rgba(248,113,113,0.2)" }}
      >
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-red-300/80 leading-relaxed flex-1">{brandMessage}</p>
        <div className="flex items-center gap-3 flex-shrink-0">
          {onRetry && (
            <button onClick={onRetry} className="text-[10px] tracking-[0.08em] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> 重试
            </button>
          )}
          <button onClick={onDismiss} className="text-white/20 hover:text-white/40 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: 更新 SkeletonLoader.tsx（Lando 风格）**

```tsx
"use client";
import { motion } from "framer-motion";

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content-card p-6 animate-pulse"
    >
      <div className="w-24 h-3 bg-white/[0.04] rounded-sm mb-6" />
      <div className="space-y-3">
        <div className="w-full h-3 bg-white/[0.03] rounded-sm" />
        <div className="w-4/5 h-3 bg-white/[0.03] rounded-sm" />
        <div className="w-3/5 h-3 bg-white/[0.03] rounded-sm" />
        <div className="w-full h-3 bg-white/[0.03] rounded-sm mt-4" />
        <div className="w-2/3 h-3 bg-white/[0.03] rounded-sm" />
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 5: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: 提交**

```bash
git add src/components/shared/HookCard.tsx src/components/shared/HookList.tsx src/components/shared/ErrorToast.tsx src/components/shared/SkeletonLoader.tsx
git commit -m "feat: Lando-style HookCard/HookList/ErrorToast/SkeletonLoader"
```

---

### Task 9: 流式 AI — deepseek.ts + 5 个 API Routes

**Files:**
- Modify: `src/lib/deepseek.ts`
- Modify: `src/app/api/yuwen/route.ts`
- Modify: `src/app/api/math/route.ts`
- Modify: `src/app/api/english/route.ts`
- Modify: `src/app/api/physics/route.ts`
- Modify: `src/app/api/chemistry/route.ts`

- [ ] **Step 1: 为 deepseek.ts 添加流式方法**

在 `src/lib/deepseek.ts` 末尾追加：

```ts
export async function* callDeepSeekStream(systemPrompt: string, userMessage: string): AsyncGenerator<string> {
  const config = getConfig();
  if (!config) {
    throw new Error("NO_API_KEY");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const res = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error ${res.status}: ${err}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") return;

        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // skip unparseable chunks
        }
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") throw e;
      if (e.name === "AbortError") throw new Error("TIMEOUT");
    }
    throw new Error("AI_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}
```

- [ ] **Step 2: 更新 yuwen API Route 支持流式**

将 `src/app/api/yuwen/route.ts` 替换为：

```ts
import { NextRequest } from "next/server";
import { callDeepSeekStream } from "@/lib/deepseek";
import { yuwenPrompt } from "@/lib/prompts";
import type { YuwenRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: YuwenRequest = await req.json();
    if (!body.mode || !body.input) {
      return new Response(JSON.stringify({ error: "缺少必填字段", code: "INVALID_REQUEST" }), { status: 400 });
    }
    if (body.input.length > 500) {
      return new Response(JSON.stringify({ error: "输入过长", code: "INVALID_REQUEST" }), { status: 400 });
    }

    const { system, user } = yuwenPrompt(body.mode, body.input);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let full = "";
          for await (const chunk of callDeepSeekStream(system, user)) {
            full += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, full })}\n\n`));
          controller.close();
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI_ERROR";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "服务异常", code: "AI_ERROR" }), { status: 500 });
  }
}
```

- [ ] **Step 3: 同理更新 math/english/physics/chemistry API Routes**

math → 用 `mathPrompt(body.question)`
english → 用 `englishPrompt(body.mode, body.input)`
physics → 用 `experimentPrompt(body.experimentName, body.scientist)`
chemistry → 同 physics

每个文件结构同 Step 2，仅替换 prompt 调用。

- [ ] **Step 4: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: 提交**

```bash
git add src/lib/deepseek.ts src/app/api/yuwen/route.ts src/app/api/math/route.ts src/app/api/english/route.ts src/app/api/physics/route.ts src/app/api/chemistry/route.ts
git commit -m "feat: add streaming SSE support to all API routes + callDeepSeekStream"
```

---

### Task 10: R3F 实验场景 — ExperimentCanvas 替换 + 5 个 3D 场景

**Files:**
- Create: `src/components/experiment/RefractionScene.tsx`
- Create: `src/components/experiment/CircuitScene.tsx`
- Create: `src/components/experiment/BuoyancyScene.tsx`
- Create: `src/components/experiment/LensScene.tsx`
- Create: `src/components/experiment/ChemistryLabScene.tsx`
- Modify: `src/components/experiment/ExperimentCanvas.tsx`

- [ ] **Step 1: 创建 RefractionScene.tsx（光的折射）**

```tsx
"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function LaserBeam({ prismRotation }: { prismRotation: number }) {
  return (
    <group>
      {/* Incoming laser */}
      <mesh position={[-2.5, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      {/* Refracted beam */}
      <mesh position={[0.3, -0.2 * Math.sin(prismRotation), 0]} rotation={[0, 0, prismRotation * 0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 8]} />
        <meshBasicMaterial color="#ff8844" />
      </mesh>
      {/* Prism */}
      <mesh rotation={[0, 0, prismRotation]}>
        <coneGeometry args={[0.5, 1.2, 3]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} metalness={0} />
      </mesh>
    </group>
  );
}

export default function RefractionScene() {
  const [prismRotation, setPrismRotation] = useState(0);

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <LaserBeam prismRotation={prismRotation} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        onChange={() => {
          // Read rotation from controls for prism
        }}
      />
    </Canvas>
  );
}
```

- [ ] **Step 2: 创建 CircuitScene.tsx（电路连接）**

```tsx
"use client";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, DragControls } from "@react-three/drei";
import * as THREE from "three";

function DraggableWire({ startPos, endPos, color = "#ffaa00" }: { startPos: [number, number, number]; endPos: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={ref} position={[(startPos[0] + endPos[0]) / 2, (startPos[1] + endPos[1]) / 2, 0]}>
      <boxGeometry args={[Math.abs(endPos[0] - startPos[0]) || 0.05, 0.03, 0.03]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function CircuitScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />

      {/* Battery */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[-2, 0.5, 0.2]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#cc3333" />
      </mesh>

      {/* Bulb */}
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffff88" emissive="#ffff44" emissiveIntensity={0.5} />
      </mesh>

      {/* Wire lines */}
      <mesh position={[-1, 0.3, 0]}>
        <boxGeometry args={[2, 0.04, 0.04]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      <mesh position={[1, 0.3, 0]}>
        <boxGeometry args={[2, 0.04, 0.04]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4, 0.04, 0.04]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

- [ ] **Step 3: 创建 BuoyancyScene.tsx（浮力实验）**

```tsx
"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function WaterTank({ objectY }: { objectY: number }) {
  return (
    <group>
      {/* Tank */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshPhysicalMaterial color="#4488cc" transparent opacity={0.25} roughness={0.05} />
      </mesh>
      {/* Water surface */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 0.9]} />
        <meshBasicMaterial color="#6699dd" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Floating object — height depends on Y */}
      <mesh position={[0, Math.max(objectY, -0.2), 0.3]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#f0a040" />
      </mesh>
    </group>
  );
}

export default function BuoyancyScene() {
  const [objectY, setObjectY] = useState(0);

  return (
    <Canvas camera={{ position: [0, 0.5, 4], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} />
      <WaterTank objectY={objectY} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

- [ ] **Step 4: 创建 LensScene.tsx（凸透镜成像）**

```tsx
"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CandleAndLens() {
  return (
    <group>
      {/* Candle */}
      <mesh position={[-2, -0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#f5e6ca" />
      </mesh>
      {/* Flame */}
      <mesh position={[-2, 0.3, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      {/* Lens */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 32]} />
        <meshPhysicalMaterial color="#ccccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Screen */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <meshStandardMaterial color="#333344" />
      </mesh>
      {/* Projected image on screen */}
      <mesh position={[2, 0, 0.03]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#ffff88" />
      </mesh>
    </group>
  );
}

export default function LensScene() {
  return (
    <Canvas camera={{ position: [0, 0.3, 5], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.7} />
      <CandleAndLens />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

- [ ] **Step 5: 创建 ChemistryLabScene.tsx（化学实验通用：烧杯+酒精灯+试管）**

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function LabEquipment() {
  return (
    <group>
      {/* Alcohol lamp */}
      <mesh position={[-0.8, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      <mesh position={[-0.8, -0.1, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ff6600" />
      </mesh>

      {/* Beaker */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.8, 16, 1, true]} />
        <meshPhysicalMaterial color="#aaddff" transparent opacity={0.2} roughness={0.05} side={2} />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.28, 0.25, 0.3, 16]} />
        <meshStandardMaterial color="#4488ff" transparent opacity={0.4} />
      </mesh>

      {/* Test tube */}
      <mesh position={[0.8, -0.2, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
        <meshPhysicalMaterial color="#ccddff" transparent opacity={0.25} roughness={0.05} />
      </mesh>

      {/* Iron stand */}
      <mesh position={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0.9, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
}

export default function ChemistryLabScene() {
  return (
    <Canvas camera={{ position: [0, 0.2, 4], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <directionalLight position={[-2, 2, 2]} intensity={0.3} />
      <LabEquipment />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
```

- [ ] **Step 6: 重写 ExperimentCanvas.tsx 为场景路由**

```tsx
"use client";
import dynamic from "next/dynamic";

const RefractionScene = dynamic(() => import("./RefractionScene"), { ssr: false });
const CircuitScene = dynamic(() => import("./CircuitScene"), { ssr: false });
const BuoyancyScene = dynamic(() => import("./BuoyancyScene"), { ssr: false });
const LensScene = dynamic(() => import("./LensScene"), { ssr: false });
const ChemistryLabScene = dynamic(() => import("./ChemistryLabScene"), { ssr: false });

interface Props {
  experimentId: string;
  color: string;
}

export default function ExperimentCanvas({ experimentId, color }: Props) {
  const sceneClass = "w-full h-72 md:h-96 rounded-[4px] overflow-hidden content-card";

  switch (experimentId) {
    case "light-refraction":
      return (
        <div className={sceneClass}>
          <RefractionScene />
        </div>
      );
    case "electric-circuit":
      return (
        <div className={sceneClass}>
          <CircuitScene />
        </div>
      );
    case "buoyancy":
      return (
        <div className={sceneClass}>
          <BuoyancyScene />
        </div>
      );
    case "convex-lens":
      return (
        <div className={sceneClass}>
          <LensScene />
        </div>
      );
    // Chemistry experiments (all use the same lab scene for now)
    case "acid-base":
    case "oxygen-prep":
    case "flame-test":
    case "water-electrolysis":
      return (
        <div className={sceneClass}>
          <ChemistryLabScene />
        </div>
      );
    default:
      return (
        <div className={`${sceneClass} flex items-center justify-center`}>
          <p className="text-white/20 text-[12px] tracking-[0.08em]">3D 实验场景</p>
        </div>
      );
  }
}
```

- [ ] **Step 7: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: 提交**

```bash
git add src/components/experiment/
git commit -m "feat: replace Canvas2D with R3F experiment scenes (5 scenes + router)"
```

---

### Task 11: 物理 + 化学实验详情页重写

**Files:**
- Modify: `src/app/physics/[experimentId]/page.tsx`
- Modify: `src/app/chemistry/[experimentId]/page.tsx`

- [ ] **Step 1: 重写 physics/[experimentId]/page.tsx**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ExperimentCanvas from "@/components/experiment/ExperimentCanvas";
import ResultCard from "@/components/shared/ResultCard";
import { PHYSICS_EXPERIMENTS } from "@/lib/experiments";
import { Beaker } from "lucide-react";
import type { HistoryItem } from "@/types";
import { generateId } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const ACCENT = "#c084fc";

export default function PhysicsExperimentPage() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const experiment = PHYSICS_EXPERIMENTS.find((e) => e.id === experimentId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { addHistory, favorites, toggleFavorite } = useHistory();
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const loadExperiment = useCallback(async () => {
    if (!experiment) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setStreaming(true);

    try {
      const res = await fetch("/api/physics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentName: experiment.name, scientist: experiment.scientist }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError({ message: json.error, code: json.code });
        setStreaming(false);
        return;
      }
      const text = json.data.raw;
      setResult(text);
      setStreaming(false);

      const item: HistoryItem = {
        id: generateId(),
        subject: "physics",
        input: experiment.name,
        output: text || "",
        timestamp: Date.now(),
      };
      setCurrentItem(item);
      addHistory(item);
    } catch {
      setError({ message: "网络错误" });
      setStreaming(false);
    } finally {
      setLoading(false);
    }
  }, [experiment, addHistory]);

  if (!experiment) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-white/20 text-[12px] tracking-[0.08em]">实验未找到</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color={ACCENT} />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-[10px] tracking-[0.15em] text-white/20 mb-8">
          课程 / 物理 / {experiment.name}
        </p>

        <div className="mb-2">
          <h2 className="text-[40px] md:text-[48px] font-[900] tracking-[0.04em] leading-[1.1] text-white">
            {experiment.name}
          </h2>
          <p className="text-[16px] font-[300] italic tracking-[-0.02em] text-white/20 mt-1">
            {experiment.scientist}
          </p>
        </div>

        <div className="mt-8">
          <ExperimentCanvas experimentId={experimentId} color={ACCENT} />
        </div>

        <div className="mt-6">
          <button
            onClick={loadExperiment}
            disabled={loading}
            className="content-card px-8 py-3 text-[12px] tracking-[0.1em] font-bold transition-all hover:border-white/15 flex items-center gap-3"
            style={{ color: ACCENT }}
          >
            <Beaker className="w-4 h-4" />
            {loading ? "加载中..." : "AI 实验指导"}
          </button>
        </div>

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && currentItem && (
          <div className="mt-10">
            <ResultCard
              content={result}
              item={currentItem}
              isFav={favorites.some((f) => f.id === currentItem.id)}
              onToggleFavorite={() => toggleFavorite(currentItem)}
              accentColor={ACCENT}
              streaming={streaming}
            />
          </div>
        )}

        {error && (
          <ErrorToast
            message={error.message}
            code={error.code}
            onRetry={loadExperiment}
            onDismiss={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 同理重写 chemistry/[experimentId]/page.tsx（ACCENT = "#f0a040"，其余同结构）**

- [ ] **Step 3: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: 提交**

```bash
git add src/app/physics/\[experimentId\]/page.tsx src/app/chemistry/\[experimentId\]/page.tsx
git commit -m "feat: rewrite experiment detail pages in Lando style with R3F canvas"
```

---

### Task 12: 全局过渡动画 + 收尾打磨

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: 为 layout.tsx 添加页面过渡**

```tsx
"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import ApiKeyBanner from "@/components/layout/ApiKeyBanner";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main className="pt-14">
          <ApiKeyBanner />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 更新 Footer.tsx**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8 text-center">
      <p className="text-[10px] tracking-[0.15em] text-white/10">
        POWERED BY DEEPSEEK AI · 桂林理工大学 三下乡 · GLUT AING EDUCATION
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: 最终验证**

```bash
npx tsc --noEmit && npm run build
```
Expected: TypeScript 零错误，Next.js build 成功。

- [ ] **Step 4: 提交**

```bash
git add src/app/layout.tsx src/components/layout/Footer.tsx
git commit -m "feat: add page transitions + Lando footer"
```

---

### Task 13: 流式前端消费 + HistoryDrawer/FavoriteDrawer 更新

**Files:**
- Modify: `src/app/yuwen/page.tsx`（已在 Task 6 写入，但 fetch 仍需接流式）
- Modify: `src/components/shared/HistoryDrawer.tsx`
- Modify: `src/components/shared/FavoriteDrawer.tsx`

- [ ] **Step 1: 为各页面添加流式 fetch consumer**

在 yuwen/math/english/physics/chemistry 页面中，将 fetch 逻辑改为消费 SSE stream。以 yuwen 为例，替换 handleSubmit 中的 fetch 部分：

```tsx
// Inside handleSubmit, replace the fetch block:
const res = await fetch("/api/yuwen", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ mode, input }),
});

if (!res.ok) {
  const json = await res.json();
  setError({ message: json.error, code: json.code });
  setStreaming(false);
  setLoading(false);
  return;
}

// SSE streaming reader
const reader = res.body?.getReader();
if (!reader) { setLoading(false); return; }

const decoder = new TextDecoder();
let fullText = "";
setResult("");

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  const lines = chunk.split("\n");

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const data = line.slice(6);
    try {
      const parsed = JSON.parse(data);
      if (parsed.error) {
        setError({ message: parsed.error });
        break;
      }
      if (parsed.done) {
        setStreaming(false);
        fullText = parsed.full || fullText;
      } else if (parsed.delta) {
        fullText += parsed.delta;
        setResult(fullText);
      }
    } catch { /* skip */ }
  }
}

setStreaming(false);
// ... rest of history saving logic
```

- [ ] **Step 2: 更新 HistoryDrawer.tsx 和 FavoriteDrawer.tsx 为 Lando 抽屉**

```tsx
// HistoryDrawer.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import Link from "next/link";
import type { HistoryItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

import { useHistory } from "@/hooks/useHistory";

export default function HistoryDrawer({ open, onClose }: Props) {
  const { history, clearHistory } = useHistory();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-80 drawer-glass z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h3 className="text-[12px] tracking-[0.15em] font-bold text-white/60 uppercase">历史记录</h3>
              <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {history.length === 0 ? (
                <p className="text-[12px] text-white/15 text-center mt-20">暂无历史记录</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div key={item.id} className="content-card p-4">
                      <div className="text-[10px] tracking-[0.1em] text-white/20 mb-1.5">{formatDate(item.timestamp)}</div>
                      <p className="text-[12px] text-white/50 truncate">{item.input}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

FavoriteDrawer 同理——替换结构即可。

- [ ] **Step 3: 验证构建**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: 提交**

```bash
git add src/components/shared/HistoryDrawer.tsx src/components/shared/FavoriteDrawer.tsx
git commit -m "feat: Lando-style drawers + streaming frontend consumers"
```

---

## 总结

13 个 Task，预期 4-5 小时完成。每个 Task 独立可验证。按顺序执行。

**Task 依赖图：**
```
1 (deps+CSS)
 └→ 2 (ResultCard)
     └→ 3 (shared components)
         └→ 4 (Spotlight+Navbar+Particles)
             └→ 5 (Homepage)
                 └→ 6 (yuwen/math/english)
                     └→ 7 (physics/chemistry list)
                         └→ 8 (HookCard etc.)
                             └→ 9 (streaming API)
                                 └→ 10 (R3F scenes)
                                     └→ 11 (experiment detail)
                                         └→ 12 (layout transitions)
                                             └→ 13 (streaming consumers + drawers)
```
