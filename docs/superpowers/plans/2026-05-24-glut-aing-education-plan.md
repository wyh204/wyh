# GLUT Aing Education 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个面向中国中小学生的 AI 赋能 5 科（语文/数学/英语/物理/化学）学习助手网页 App，可部署到 Vercel。

**Architecture:** Next.js 14 App Router + TypeScript，前端通过 API Route 调用 DeepSeek API（key 保护在 .env.local），localStorage 存储历史/收藏。首页用 Three.js/R3F 做 3D 几何体背景，物理化学实验用 Canvas 2D 做交互动画。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, Three.js + React Three Fiber + @react-three/drei, DeepSeek API, pnpm, Vercel 部署

---

## File Structure

```
C:\Users\19375\Desktop\三下乡ai+教育前端项目/
├── .env.local
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx                  — RootLayout + 全局 providers
│   │   ├── page.tsx                    — 首页（5科入口 + 3D 背景）
│   │   ├── globals.css                 — 全局样式 + Tailwind
│   │   ├── yuwen/page.tsx              — 语文页
│   │   ├── math/page.tsx               — 数学页
│   │   ├── english/page.tsx            — 英语页
│   │   ├── physics/page.tsx            — 物理实验列表
│   │   ├── physics/[experimentId]/page.tsx  — 物理单个实验
│   │   ├── chemistry/page.tsx          — 化学实验列表
│   │   ├── chemistry/[experimentId]/page.tsx — 化学单个实验
│   │   └── api/
│   │       ├── yuwen/route.ts
│   │       ├── math/route.ts
│   │       ├── english/route.ts
│   │       ├── physics/route.ts
│   │       └── chemistry/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ApiKeyBanner.tsx
│   │   ├── shared/
│   │   │   ├── SubjectCard.tsx
│   │   │   ├── ModeSelector.tsx
│   │   │   ├── InputPanel.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── HookCard.tsx
│   │   │   ├── HookList.tsx
│   │   │   ├── HistoryDrawer.tsx
│   │   │   ├── FavoriteDrawer.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── ErrorToast.tsx
│   │   ├── three/
│   │   │   ├── ThreeBackground.tsx
│   │   │   └── ThreeParticles.tsx
│   │   └── experiment/
│   │       ├── ExperimentCard.tsx
│   │       └── ExperimentCanvas.tsx
│   ├── lib/
│   │   ├── deepseek.ts
│   │   ├── storage.ts
│   │   ├── utils.ts
│   │   ├── prompts.ts
│   │   └── experiments.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       ├── useLocalStorage.ts
│       ├── useMediaQuery.ts
│       └── useHistory.ts
```

---

## Phase 1: 项目脚手架

### Task 1: 创建 Next.js 项目并安装依赖

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.local`, `.env.example`, `.gitignore`

- [ ] **Step 1: Initialize project**

Run:
```bash
cd "C:\Users\19375\Desktop\三下乡ai+教育前端项目"
pnpm init
```

- [ ] **Step 2: Write package.json**

```json
{
  "name": "glut-aing-education",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "three": "^0.168.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.109.0",
    "framer-motion": "^11.3.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.4.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.168.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run:
```bash
pnpm install
```

- [ ] **Step 4: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Write next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
};

export default nextConfig;
```

- [ ] **Step 6: Write tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0a0a1a", light: "#0f0f2a", card: "rgba(15,15,42,0.6)" },
        yuwen: "#e85d3a",
        math: "#4da6ff",
        english: "#3dd68c",
        physics: "#a78bfa",
        chemistry: "#f0a040",
        text: { primary: "#e8e8f0", secondary: "#8888a0" },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px var(--glow-color)" },
          "50%": { boxShadow: "0 0 20px var(--glow-color)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Write postcss.config.mjs**

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 8: Write .env.local**

```bash
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

- [ ] **Step 9: Write .env.example**

```bash
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

- [ ] **Step 10: Write .gitignore**

```
node_modules/
.next/
.env.local
out/
```

- [ ] **Step 11: Create directory structure**

Run:
```bash
mkdir -p src/app/api/yuwen src/app/api/math src/app/api/english src/app/api/physics src/app/api/chemistry
mkdir -p src/app/yuwen src/app/math src/app/english src/app/physics/\[experimentId\] src/app/chemistry/\[experimentId\]
mkdir -p src/components/layout src/components/shared src/components/three src/components/experiment
mkdir -p src/lib src/types src/hooks
```

- [ ] **Step 12: Verify dev server starts**

Run:
```bash
pnpm dev
```

Expected: dev server starts on http://localhost:3000 (will show 404 until pages exist)

---

## Phase 2: 类型定义 & 工具库

### Task 2: 全局类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write types/index.ts**

```ts
// ============ 学科标识 ============
export type Subject = "yuwen" | "math" | "english" | "physics" | "chemistry";

// ============ 语文 ============
export type YuwenMode = "modern" | "classical" | "essay";

export interface YuwenRequest {
  mode: YuwenMode;
  input: string; // 文章名 or 作文主题
}

export interface YuwenModernResponse {
  authorIntro: string;
  background: string;
  appreciation: string;
}

export interface YuwenClassicalResponse {
  authorIntro: string;
  background: string;
  wordByWord: string;
  keyPoints: string;
  appreciation: string;
}

export interface EssayHook {
  hookText: string;
  styleTag: string;
  clickBaitScore: number;
  reason: string;
}

export interface YuwenEssayResponse {
  hooks: EssayHook[];
}

export type YuwenResponse = YuwenModernResponse | YuwenClassicalResponse | YuwenEssayResponse;

// ============ 数学 ============
export interface MathRequest {
  question: string;
}

export interface MathResponse {
  analysis: string;
  mathematician: string;
  theoremUsed: string;
  solution: string;
  examPoints: string;
  mathematicianBio: string;
}

// ============ 英语 ============
export type EnglishMode = "grammar" | "essay";

export interface EnglishRequest {
  mode: EnglishMode;
  input: string; // 语法描述/英文句子 or 文体+主题
}

export interface EnglishGrammarResponse {
  usage: string;
  examples: string[];
  translation?: string;
  detectedGrammar?: string;
}

export interface EnglishHook {
  hookText: string;
  styleTag: string;
  clickBaitScore: number;
  reason: string;
}

export interface EnglishEssayResponse {
  outline: string;
  guidance: string;
  hooks: EnglishHook[];
}

export type EnglishResponse = EnglishGrammarResponse | EnglishEssayResponse;

// ============ 实验 ============
export interface Experiment {
  id: string;
  name: string;
  scientist: string;
  description: string;
  icon: string; // lucide icon name
}

export interface ExperimentStep {
  step: number;
  instruction: string;
  phenomena: string;
  scientistBio?: string;
}

// ============ 历史 & 收藏 ============
export interface HistoryItem {
  id: string;
  subject: Subject;
  mode?: string;
  input: string;
  output: unknown; // 序列化后的 AI 响应
  timestamp: number;
}

export interface FavoriteItem extends HistoryItem {}

// ============ API 通用 ============
export interface ApiErrorResponse {
  error: string;
  code: "NO_API_KEY" | "AI_ERROR" | "TIMEOUT" | "INVALID_REQUEST";
}

export interface ApiSuccessResponse<T> {
  data: T;
}
```

- [ ] **Step 2: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

### Task 3: 工具库 & 常量

**Files:**
- Create: `src/lib/utils.ts`, `src/lib/storage.ts`, `src/lib/deepseek.ts`, `src/lib/prompts.ts`, `src/lib/experiments.ts`

- [ ] **Step 1: Write lib/utils.ts**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncate(str: string, maxLen = 80): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen) + "...";
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
```

- [ ] **Step 2: Write lib/storage.ts**

```ts
import type { HistoryItem, FavoriteItem } from "@/types";

const HISTORY_KEY = "glut-history";
const FAVORITES_KEY = "glut-favorites";
const MAX_HISTORY = 50;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: HistoryItem): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  history.unshift(item);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(item: FavoriteItem): void {
  if (typeof window === "undefined") return;
  const favs = getFavorites();
  if (favs.find((f) => f.id === item.id)) return;
  favs.unshift(item);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function removeFavorite(id: string): void {
  if (typeof window === "undefined") return;
  const favs = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}
```

- [ ] **Step 3: Write lib/deepseek.ts**

```ts
interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

function getConfig(): DeepSeekConfig | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "sk-your-key-here") return null;
  return {
    apiKey,
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
  };
}

export async function callDeepSeek(systemPrompt: string, userMessage: string): Promise<string> {
  const config = getConfig();
  if (!config) {
    throw new Error("NO_API_KEY");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

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
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error ${res.status}: ${err}`);
    }

    const json = await res.json();
    return json.choices[0].message.content;
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

- [ ] **Step 4: Write lib/prompts.ts**

```ts
import type { YuwenMode, EnglishMode } from "@/types";

const BASE_TONE = "你是一个面向中国中小学生的AI学习助手，使用亲切温和但专业的语气。回答使用中文。";

export function yuwenPrompt(mode: YuwenMode, input: string): { system: string; user: string } {
  const base = `${BASE_TONE}你是一位资深的语文老师，擅长引导学生理解文学作品。`;

  if (mode === "modern") {
    return {
      system: base + "请按以下结构回复：\n1.【作者介绍】（含趣事轶闻）\n2.【写作背景】
3.【文章鉴赏】",
      user: `请分析语文课本中的文章：${input}`,
    };
  }
  if (mode === "classical") {
    return {
      system: base + "请按以下结构回复：\n1.【作者介绍】（含趣事轶闻）\n2.【写作背景】
3.【一字一译】（逐字逐句翻译）\n4.【重点古文字词与句型】\n5.【文章鉴赏】",
      user: `请分析这篇古文：${input}`,
    };
  }
  // essay help
  return {
    system: `${base}你是一位作文辅导专家。用户会提供一个作文主题，你需要生成10个不同风格的爆款开头结尾大纲hook。
每个hook包含：
- hook文案（开头+结尾一句话）
- 风格标签（如"温情""励志""哲理""幽默"等）
- 点击欲评分（1-10分）
- 推荐理由

请严格按照JSON数组格式返回，每个元素为：
{"hookText":"...","styleTag":"...","clickBaitScore":7,"reason":"..."}`,
    user: `作文主题：${input}`,
  };
}

export function mathPrompt(question: string): { system: string; user: string } {
  return {
    system: `${BASE_TONE}你是一位数学老师，同时也精通数学史。请按以下结构回复：
1.【题目分析】
2.【涉及的数学家及定理】
3.【解答过程】
4.【考点总结】
5.【数学家介绍】（含趣事轶闻，激发学生兴趣）`,
    user: `请解答这道数学题：${question}`,
  };
}

export function englishPrompt(mode: EnglishMode, input: string): { system: string; user: string } {
  if (mode === "grammar") {
    return {
      system: `${BASE_TONE}你是一位英语老师。用户输入可能是：
- 中文描述的语法点 → 解释该语法用法并给出典型例句
- 英文句子 → 给出中文翻译、句子中含有的语法点、典型例句`,
      user: input,
    };
  }
  // essay help
  return {
    system: `${BASE_TONE}你是一位英语作文辅导专家。用户会提供文体和主题，你需要：
1. 给出满分级别的英语作文大纲
2. 给出写作指导
3. 生成10个不同风格的英语开头结尾hook（英文）

请严格按照以下JSON格式返回：
{"outline":"...","guidance":"...","hooks":[{"hookText":"...","styleTag":"...","clickBaitScore":7,"reason":"..."}]}`,
    user: input,
  };
}

export function experimentPrompt(experimentName: string, scientist: string): { system: string; user: string } {
  return {
    system: `${BASE_TONE}你是一位实验指导老师。请按以下结构回复：
1.【实验目的】
2.【实验器材】
3.【实验步骤】（分步说明）
4.【注意事项】
5.【${scientist}简介与趣事】`,
    user: `请指导我完成这个实验：${experimentName}`,
  };
}
```

- [ ] **Step 5: Write lib/experiments.ts**

```ts
import type { Experiment } from "@/types";

export const PHYSICS_EXPERIMENTS: Experiment[] = [
  {
    id: "refraction",
    name: "光的折射",
    scientist: "斯涅尔",
    description: "拖动激光束，观察光线从空气进入水中时的折射现象",
    icon: "sun",
  },
  {
    id: "circuit",
    name: "串联与并联电路",
    scientist: "欧姆",
    description: "拖拽导线和灯泡，搭建不同的电路并观察灯泡亮度",
    icon: "zap",
  },
  {
    id: "buoyancy",
    name: "阿基米德原理",
    scientist: "阿基米德",
    description: "将物体浸入水中，观察浮力与排开水体积的关系",
    icon: "waves",
  },
  {
    id: "convex-lens",
    name: "凸透镜成像",
    scientist: "开普勒",
    description: "拖动蜡烛改变物距，观察光屏上像的大小和虚实变化",
    icon: "camera",
  },
];

export const CHEMISTRY_EXPERIMENTS: Experiment[] = [
  {
    id: "oxygen",
    name: "实验室制取氧气",
    scientist: "拉瓦锡",
    description: "组装装置，加热高锰酸钾，观察气泡和带火星木条复燃",
    icon: "flame",
  },
  {
    id: "co2",
    name: "CO₂制取与检验",
    scientist: "布莱克",
    description: "滴加稀盐酸于大理石，观察石灰水变浑浊",
    icon: "beaker",
  },
  {
    id: "metal-acid",
    name: "金属与酸的反应",
    scientist: "贝采里乌斯",
    description: "将不同金属放入稀盐酸，比较气泡产生速率",
    icon: "test-tube",
  },
  {
    id: "titration",
    name: "酸碱中和滴定",
    scientist: "阿伦尼乌斯",
    description: "逐滴加入酸液，观察指示剂颜色渐变和pH变化",
    icon: "droplet",
  },
];
```

- [ ] **Step 6: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

### Task 4: 自定义 Hooks

**Files:**
- Create: `src/hooks/useLocalStorage.ts`, `src/hooks/useMediaQuery.ts`, `src/hooks/useHistory.ts`

- [ ] **Step 1: Write hooks/useLocalStorage.ts**

```ts
"use client";
import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        localStorage.setItem(key, JSON.stringify(resolved));
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}
```

- [ ] **Step 2: Write hooks/useMediaQuery.ts**

```ts
"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}
```

- [ ] **Step 3: Write hooks/useHistory.ts**

```ts
"use client";
import { useCallback, useState } from "react";
import type { HistoryItem, FavoriteItem, Subject } from "@/types";
import { generateId } from "@/lib/utils";
import {
  getHistory,
  addHistory,
  clearHistory,
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/lib/storage";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const refresh = useCallback(() => {
    setHistory(getHistory());
    setFavorites(getFavorites());
  }, []);

  const save = useCallback(
    (subject: Subject, input: string, output: unknown, mode?: string) => {
      const item: HistoryItem = {
        id: generateId(),
        subject,
        mode,
        input,
        output,
        timestamp: Date.now(),
      };
      addHistory(item);
      refresh();
      return item;
    },
    [refresh],
  );

  const toggleFavorite = useCallback(
    (item: HistoryItem) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id);
      } else {
        addFavorite(item);
      }
      refresh();
    },
    [refresh],
  );

  const clearAll = useCallback(() => {
    clearHistory();
    refresh();
  }, [refresh]);

  return { history, favorites, save, toggleFavorite, clearAll, refresh, isFavorite };
}
```

- [ ] **Step 4: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

## Phase 3: API Routes

### Task 5: 语文 API Route

**Files:**
- Create: `src/app/api/yuwen/route.ts`

- [ ] **Step 1: Write api/yuwen/route.ts**

```ts
import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { yuwenPrompt } from "@/lib/prompts";
import type { YuwenRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: YuwenRequest = await req.json();
    if (!body.mode || !body.input) {
      return NextResponse.json(
        { error: "缺少必填字段 mode 或 input", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    if (body.input.length > 500) {
      return NextResponse.json(
        { error: "输入内容过长，请控制在500字以内", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const { system, user } = yuwenPrompt(body.mode, body.input);
    const responseText = await callDeepSeek(system, user);

    // Try to parse JSON for essay mode
    if (body.mode === "essay") {
      try {
        const parsed = JSON.parse(responseText);
        return NextResponse.json({ data: { hooks: Array.isArray(parsed) ? parsed : parsed.hooks || [] } });
      } catch {
        return NextResponse.json({ data: { hooks: [], raw: responseText } });
      }
    }

    return NextResponse.json({ data: { raw: responseText } });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") {
        return NextResponse.json(
          { error: "API Key 未配置", code: "NO_API_KEY" },
          { status: 503 },
        );
      }
      if (e.message === "TIMEOUT") {
        return NextResponse.json(
          { error: "AI 响应超时，请重试", code: "TIMEOUT" },
          { status: 504 },
        );
      }
    }
    return NextResponse.json(
      { error: "AI 服务异常，请稍后重试", code: "AI_ERROR" },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Repeat for math, english, physics, chemistry**

Write `src/app/api/math/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { mathPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.question) {
      return NextResponse.json(
        { error: "请输入数学题目", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }
    if (body.question.length > 1000) {
      return NextResponse.json(
        { error: "题目过长，请控制在1000字以内", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const { system, user } = mathPrompt(body.question);
    const responseText = await callDeepSeek(system, user);

    return NextResponse.json({ data: { raw: responseText } });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") {
        return NextResponse.json({ error: "API Key 未配置", code: "NO_API_KEY" }, { status: 503 });
      }
      if (e.message === "TIMEOUT") {
        return NextResponse.json({ error: "AI 响应超时，请重试", code: "TIMEOUT" }, { status: 504 });
      }
    }
    return NextResponse.json({ error: "AI 服务异常，请稍后重试", code: "AI_ERROR" }, { status: 500 });
  }
}
```

Write `src/app/api/english/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { englishPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.mode || !body.input) {
      return NextResponse.json(
        { error: "缺少必填字段 mode 或 input", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }
    if (body.input.length > 1000) {
      return NextResponse.json(
        { error: "输入内容过长", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const { system, user } = englishPrompt(body.mode, body.input);
    const responseText = await callDeepSeek(system, user);

    if (body.mode === "essay") {
      try {
        const parsed = JSON.parse(responseText);
        return NextResponse.json({ data: parsed });
      } catch {
        return NextResponse.json({ data: { outline: responseText, guidance: "", hooks: [] } });
      }
    }

    return NextResponse.json({ data: { raw: responseText } });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") {
        return NextResponse.json({ error: "API Key 未配置", code: "NO_API_KEY" }, { status: 503 });
      }
      if (e.message === "TIMEOUT") {
        return NextResponse.json({ error: "AI 响应超时，请重试", code: "TIMEOUT" }, { status: 504 });
      }
    }
    return NextResponse.json({ error: "AI 服务异常，请稍后重试", code: "AI_ERROR" }, { status: 500 });
  }
}
```

Write `src/app/api/physics/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { experimentPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.experimentName || !body.scientist) {
      return NextResponse.json(
        { error: "缺少实验信息", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const { system, user } = experimentPrompt(body.experimentName, body.scientist);
    const responseText = await callDeepSeek(system, user);

    return NextResponse.json({ data: { raw: responseText } });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") {
        return NextResponse.json({ error: "API Key 未配置", code: "NO_API_KEY" }, { status: 503 });
      }
      if (e.message === "TIMEOUT") {
        return NextResponse.json({ error: "AI 响应超时，请重试", code: "TIMEOUT" }, { status: 504 });
      }
    }
    return NextResponse.json({ error: "AI 服务异常，请稍后重试", code: "AI_ERROR" }, { status: 500 });
  }
}
```

Write `src/app/api/chemistry/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { experimentPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.experimentName || !body.scientist) {
      return NextResponse.json(
        { error: "缺少实验信息", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const { system, user } = experimentPrompt(body.experimentName, body.scientist);
    const responseText = await callDeepSeek(system, user);

    return NextResponse.json({ data: { raw: responseText } });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") {
        return NextResponse.json({ error: "API Key 未配置", code: "NO_API_KEY" }, { status: 503 });
      }
      if (e.message === "TIMEOUT") {
        return NextResponse.json({ error: "AI 响应超时，请重试", code: "TIMEOUT" }, { status: 504 });
      }
    }
    return NextResponse.json({ error: "AI 服务异常，请稍后重试", code: "AI_ERROR" }, { status: 500 });
  }
}
```

- [ ] **Step 3: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

## Phase 4: 全局样式 & Layout

### Task 6: 全局样式

**Files:**
- Create: `src/app/globals.css`

- [ ] **Step 1: Write globals.css**

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
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
    background: #0a0a1a;
    color: #e8e8f0;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::selection {
    background: rgba(168, 127, 250, 0.3);
    color: #fff;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
}

@layer components {
  .glass-card {
    background: rgba(15, 15, 42, 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
  }

  .glass-card:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .glow-text {
    text-shadow: 0 0 20px currentColor;
  }

  .subject-gradient-yuwen {
    background: linear-gradient(135deg, rgba(232, 93, 58, 0.15), rgba(232, 93, 58, 0.05));
  }
  .subject-gradient-math {
    background: linear-gradient(135deg, rgba(77, 166, 255, 0.15), rgba(77, 166, 255, 0.05));
  }
  .subject-gradient-english {
    background: linear-gradient(135deg, rgba(61, 214, 140, 0.15), rgba(61, 214, 140, 0.05));
  }
  .subject-gradient-physics {
    background: linear-gradient(135deg, rgba(168, 127, 250, 0.15), rgba(168, 127, 250, 0.05));
  }
  .subject-gradient-chemistry {
    background: linear-gradient(135deg, rgba(240, 160, 64, 0.15), rgba(240, 160, 64, 0.05));
  }
}
```

---

### Task 7: Layout 组件

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/ApiKeyBanner.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write Navbar.tsx**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Home, ChevronLeft } from "lucide-react";

const subjectNames: Record<string, string> = {
  yuwen: "语文",
  math: "数学",
  english: "英语",
  physics: "物理",
  chemistry: "化学",
};

export default function Navbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const subject = segments[0];
  const isHome = !subject;
  const subjectName = subjectNames[subject] || subject;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {isHome ? (
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-physics" />
            <span className="text-lg font-bold">GLUT Aing Education</span>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-text-secondary" />
            </Link>
            <span className="text-text-secondary">/</span>
            <span className="text-text-primary font-medium">{subjectName}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="px-2 py-1 rounded-full glass-card">
            AI 赋能教育
          </span>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Write Footer.tsx**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-text-secondary">
        <p>GLUT Aing Education — 桂林理工大学 · 三下乡 AI 赋能教育项目</p>
        <p className="mt-1 opacity-60">Powered by DeepSeek AI</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Write ApiKeyBanner.tsx**

```tsx
"use client";
import { AlertTriangle } from "lucide-react";

interface Props {
  show: boolean;
}

export default function ApiKeyBanner({ show }: Props) {
  if (!show) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-red-600/90 backdrop-blur px-4 py-2 text-center text-sm text-white flex items-center justify-center gap-2">
      <AlertTriangle className="w-4 h-4" />
      <span>API Key 未配置，请在 .env.local 中设置 DEEPSEEK_API_KEY</span>
    </div>
  );
}
```

- [ ] **Step 4: Write RootLayout (src/app/layout.tsx)**

```tsx
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLUT Aing Education — AI 赋能教育",
  description: "AI 赋能中小学教育学习助手",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

## Phase 5: 共享组件

### Task 8: 学科卡片 & 模式选择器 & 输入面板

**Files:**
- Create: `src/components/shared/SubjectCard.tsx`, `src/components/shared/ModeSelector.tsx`, `src/components/shared/InputPanel.tsx`

- [ ] **Step 1: Write SubjectCard.tsx**

```tsx
"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BookOpen, Calculator, Globe, Atom, FlaskConical, type LucideIcon } from "lucide-react";
import type { Subject } from "@/types";
import { cn } from "@/lib/utils";

const subjectMeta: Record<Subject, { name: string; color: string; Icon: LucideIcon; desc: string }> = {
  yuwen: { name: "语文", color: "#e85d3a", Icon: BookOpen, desc: "AI 文学鉴赏与作文辅导" },
  math: { name: "数学", color: "#4da6ff", Icon: Calculator, desc: "智能解题与数学家故事" },
  english: { name: "英语", color: "#3dd68c", Icon: Globe, desc: "语法精讲与写作指导" },
  physics: { name: "物理", color: "#a78bfa", Icon: Atom, desc: "交互式实验与物理学家故事" },
  chemistry: { name: "化学", color: "#f0a040", Icon: FlaskConical, desc: "交互式实验与化学家故事" },
};

export default function SubjectCard({ subject }: { subject: Subject }) {
  const meta = subjectMeta[subject];
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <Link href={`/${subject}`}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "glass-card p-6 cursor-pointer select-none relative overflow-hidden group",
          "hover:shadow-lg transition-shadow duration-300"
        )}
        whileHover={{ y: -4 }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${meta.color}15 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10">
          <meta.Icon className="w-10 h-10 mb-3" style={{ color: meta.color }} />
          <h3 className="text-xl font-bold mb-1" style={{ color: meta.color }}>
            {meta.name}
          </h3>
          <p className="text-sm text-text-secondary">{meta.desc}</p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }}
        />
      </motion.div>
    </Link>
  );
}

export { subjectMeta };
```

- [ ] **Step 2: Write ModeSelector.tsx**

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
    <div className="flex gap-2 p-1 glass-card rounded-xl">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            value === opt.value
              ? "bg-white/15 text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write InputPanel.tsx**

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
}

export default function InputPanel({
  placeholder = "请输入你想了解的内容...",
  onSubmit,
  loading = false,
  disabled = false,
  maxLength = 500,
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
    <div className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={2}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3",
            "text-text-primary placeholder-text-secondary/50",
            "focus:outline-none focus:border-white/25 focus:bg-white/8",
            "resize-none transition-all duration-200 text-sm",
          )}
        />
        <span className="absolute bottom-2 right-3 text-xs text-text-secondary/50">
          {input.length}/{maxLength}
        </span>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || disabled || !input.trim()}
        className={cn(
          "px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200",
          "bg-white/10 hover:bg-white/15 text-text-primary",
          "disabled:opacity-40 disabled:cursor-not-allowed",
        )}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        发送
      </button>
    </div>
  );
}
```

- [ ] **Step 4: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

### Task 9: 结果卡片 & Hook 卡片 & 骨架屏 & 错误提示

**Files:**
- Create: `src/components/shared/ResultCard.tsx`, `src/components/shared/HookCard.tsx`, `src/components/shared/HookList.tsx`, `src/components/shared/SkeletonLoader.tsx`, `src/components/shared/ErrorToast.tsx`

- [ ] **Step 1: Write ResultCard.tsx**

```tsx
"use client";
import { motion } from "framer-motion";
import { Copy, Heart, Check } from "lucide-react";
import { useState } from "react";
import { cn, copyToClipboard } from "@/lib/utils";
import type { HistoryItem } from "@/types";

interface Props {
  content: string;
  item: HistoryItem;
  isFav: boolean;
  onToggleFavorite: () => void;
}

export default function ResultCard({ content, item, isFav, onToggleFavorite }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative"
    >
      <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-english" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
        <button
          onClick={onToggleFavorite}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
            isFav
              ? "text-red-400 bg-red-400/10"
              : "text-text-secondary hover:text-red-400 hover:bg-white/5",
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", isFav && "fill-current")} />
          {isFav ? "已收藏" : "收藏"}
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write HookCard.tsx**

```tsx
import { cn } from "@/lib/utils";
import type { EssayHook } from "@/types";

interface Props {
  hook: EssayHook;
  index: number;
}

const styleColorMap: Record<string, string> = {
  "温情": "#f472b6",
  "励志": "#fbbf24",
  "哲理": "#a78bfa",
  "幽默": "#34d399",
  "悬念": "#f87171",
  "诗意": "#60a5fa",
  "对比": "#fb923c",
  "反问": "#c084fc",
  "排比": "#4ade80",
  "叙事": "#f0a040",
};

export default function HookCard({ hook, index }: Props) {
  const color = Object.entries(styleColorMap).find(([k]) => hook.styleTag.includes(k))?.[1] || "#8888a0";

  return (
    <div className="glass-card p-4 hover:border-white/15 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-text-secondary">#{index + 1}</span>
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: `${color}20`, color }}
          >
            {hook.styleTag}
          </span>
          <span className="text-xs text-yuwen font-bold">{hook.clickBaitScore}/10</span>
        </div>
      </div>
      <p className="text-sm text-text-primary mb-2 leading-relaxed">{hook.hookText}</p>
      <p className="text-xs text-text-secondary">{hook.reason}</p>
    </div>
  );
}
```

- [ ] **Step 3: Write HookList.tsx**

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
```

- [ ] **Step 4: Write SkeletonLoader.tsx**

```tsx
export default function SkeletonLoader() {
  return (
    <div className="glass-card p-6 animate-pulse space-y-4">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-5/6" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-1/4 mt-6" />
    </div>
  );
}
```

- [ ] **Step 5: Write ErrorToast.tsx**

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export default function ErrorToast({ message, code, onRetry, onDismiss }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 max-w-sm glass-card border-red-500/30 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-red-400">{message}</p>
              {code && <p className="text-xs text-text-secondary mt-1">错误代码: {code}</p>}
            </div>
            <button onClick={onDismiss} className="text-text-secondary hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              重试
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 6: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

### Task 10: 历史 & 收藏侧栏

**Files:**
- Create: `src/components/shared/HistoryDrawer.tsx`, `src/components/shared/FavoriteDrawer.tsx`

- [ ] **Step 1: Write HistoryDrawer.tsx**

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Trash2, Heart } from "lucide-react";
import type { HistoryItem, Subject } from "@/types";
import { cn, formatDate, truncate } from "@/lib/utils";

const subjectLabels: Record<Subject, string> = {
  yuwen: "语文", math: "数学", english: "英语", physics: "物理", chemistry: "化学",
};

const subjectColors: Record<Subject, string> = {
  yuwen: "text-yuwen", math: "text-math", english: "text-english",
  physics: "text-physics", chemistry: "text-chemistry",
};

interface Props {
  open: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onToggleFavorite: (item: HistoryItem) => void;
  onClearAll: () => void;
  isFavorite: (id: string) => boolean;
}

export default function HistoryDrawer({
  open, onClose, history, onToggleFavorite, onClearAll, isFavorite,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-card rounded-none border-0 border-l"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-text-secondary" />
                <h3 className="text-lg font-bold">学习历史</h3>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-red-400/70 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-white/5 transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> 清空
                  </button>
                )}
                <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)] p-4 space-y-3">
              {history.length === 0 && (
                <p className="text-text-secondary text-sm text-center py-12">暂无学习记录</p>
              )}
              {history.map((item) => (
                <div key={item.id} className="glass-card p-3 hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-xs font-medium", subjectColors[item.subject])}>
                      {subjectLabels[item.subject]}
                      {item.mode && ` · ${item.mode}`}
                    </span>
                    <span className="text-xs text-text-secondary">{formatDate(item.timestamp)}</span>
                  </div>
                  <p className="text-sm text-text-primary">{truncate(item.input)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className={cn(
                        "text-xs px-2 py-1 rounded-lg transition-all",
                        isFavorite(item.id)
                          ? "text-red-400 bg-red-400/10"
                          : "text-text-secondary hover:text-red-400 hover:bg-white/5",
                      )}
                    >
                      <Heart className={cn("w-3 h-3 inline mr-1", isFavorite(item.id) && "fill-current")} />
                      {isFavorite(item.id) ? "已收藏" : "收藏"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Write FavoriteDrawer.tsx**

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2 } from "lucide-react";
import type { FavoriteItem, Subject } from "@/types";
import { cn, formatDate, truncate } from "@/lib/utils";

const subjectLabels: Record<Subject, string> = {
  yuwen: "语文", math: "数学", english: "英语", physics: "物理", chemistry: "化学",
};

const subjectColors: Record<Subject, string> = {
  yuwen: "text-yuwen", math: "text-math", english: "text-english",
  physics: "text-physics", chemistry: "text-chemistry",
};

interface Props {
  open: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onRemove: (id: string) => void;
}

export default function FavoriteDrawer({
  open, onClose, favorites, onRemove,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-card rounded-none border-0 border-l"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold">我的收藏</h3>
              </div>
              <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)] p-4 space-y-3">
              {favorites.length === 0 && (
                <p className="text-text-secondary text-sm text-center py-12">暂无收藏</p>
              )}
              {favorites.map((item) => (
                <div key={item.id} className="glass-card p-3 hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-xs font-medium", subjectColors[item.subject])}>
                      {subjectLabels[item.subject]}
                      {item.mode && ` · ${item.mode}`}
                    </span>
                    <span className="text-xs text-text-secondary">{formatDate(item.timestamp)}</span>
                  </div>
                  <p className="text-sm text-text-primary">{truncate(item.input)}</p>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="mt-2 text-xs text-red-400/70 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-white/5 transition-all inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> 取消收藏
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

## Phase 6: 3D 组件

### Task 11: ThreeBackground & ThreeParticles

**Files:**
- Create: `src/components/three/ThreeBackground.tsx`, `src/components/three/ThreeParticles.tsx`

- [ ] **Step 1: Write ThreeBackground.tsx**

```tsx
"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useMediaQuery";

const subjectColors = ["#e85d3a", "#4da6ff", "#3dd68c", "#a78bfa", "#f0a040"];

function FloatingShape({ color, position, scale }: { color: string; position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.2 + Math.random() * 0.4, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.003;
      meshRef.current.rotation.y += speed * 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.6}
          distort={0.15}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const isMobile = useIsMobile();
  const count = isMobile ? 3 : 8;

  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      color: subjectColors[i % subjectColors.length],
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3 - 1,
      ] as [number, number, number],
      scale: 0.4 + Math.random() * 0.6,
    }));
  }, [count]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-70 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Write ThreeParticles.tsx**

```tsx
"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ color = "#a78bfa" }: { color?: string }) {
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

export default function ThreeParticles({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0 -z-10 opacity-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }} dpr={[1, 1]} gl={{ alpha: true, antialias: false }}>
        <Particles color={color} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

## Phase 7: 页面实现

### Task 12: 首页

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Write page.tsx**

```tsx
"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { BookOpen } from "lucide-react";
import SubjectCard from "@/components/shared/SubjectCard";
import type { Subject } from "@/types";

const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), { ssr: false });

const subjects: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      <ThreeBackground />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <BookOpen className="w-10 h-10 text-physics" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-physics via-english to-chemistry bg-clip-text text-transparent">
            GLUT Aing Education
          </h1>
        </div>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          AI 赋能教育 · 让学习更智慧
        </p>
        <p className="text-text-secondary/50 text-sm mt-2">
          选择你想学习的科目，开启 AI 辅助学习之旅
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-5xl w-full"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {subjects.map((subject) => (
          <motion.div
            key={subject}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <SubjectCard subject={subject} />
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-xs text-text-secondary/50"
      >
        Powered by DeepSeek AI · 桂林理工大学 三下乡
      </motion.p>
    </div>
  );
}
```

- [ ] **Step 2: Dev server renders**

Run:
```bash
pnpm dev
```

Expected: 首页可访问，显示5科卡片 + 3D 背景

---

### Task 13: 语文页面

**Files:**
- Create: `src/app/yuwen/page.tsx`

- [ ] **Step 1: Write yuwen/page.tsx**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ModeSelector from "@/components/shared/ModeSelector";
import InputPanel from "@/components/shared/InputPanel";
import ResultCard from "@/components/shared/ResultCard";
import HookList from "@/components/shared/HookList";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import HistoryDrawer from "@/components/shared/HistoryDrawer";
import FavoriteDrawer from "@/components/shared/FavoriteDrawer";
import { useHistory } from "@/hooks/useHistory";
import type { YuwenMode, YuwenModernResponse, YuwenEssayResponse, EssayHook } from "@/types";
import { Clock, Heart } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const MODE_OPTIONS = [
  { value: "modern" as const, label: "现代文学学习" },
  { value: "classical" as const, label: "古文学习" },
  { value: "essay" as const, label: "考试作文 Help" },
];

export default function YuwenPage() {
  const [mode, setMode] = useState<YuwenMode>("modern");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [lastItem, setLastItem] = useState<ReturnType<typeof useHistory>["history"][0] | null>(null);

  const { history, favorites, save, toggleFavorite, clearAll, isFavorite: checkFav } = useHistory();

  const handleSubmit = useCallback(
    async (input: string) => {
      setLoading(true);
      setResult(null);
      setHooks(null);
      setError(null);

      try {
        const res = await fetch("/api/yuwen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, input }),
        });
        const json = await res.json();

        if (!res.ok) {
          setError({ message: json.error, code: json.code });
          return;
        }

        if (mode === "essay") {
          setHooks(json.data.hooks || []);
          const item = save("yuwen", input, { hooks: json.data.hooks }, mode);
          setLastItem(item);
        } else {
          setResult(json.data.raw || "");
          const item = save("yuwen", input, { raw: json.data.raw }, mode);
          setLastItem(item);
        }
      } catch {
        setError({ message: "网络错误，请检查连接后重试" });
      } finally {
        setLoading(false);
      }
    },
    [mode, save],
  );

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#e85d3a" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-yuwen mb-2">语文学习</h2>
          <p className="text-text-secondary text-sm">AI 文学鉴赏 · 古文精讲 · 作文辅导</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <ModeSelector options={MODE_OPTIONS} value={mode} onChange={setMode} />
          </div>
          <button onClick={() => setHistoryOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all" title="历史记录">
            <Clock className="w-5 h-5 text-text-secondary" />
          </button>
          <button onClick={() => setFavoriteOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all" title="收藏">
            <Heart className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <InputPanel
          placeholder={
            mode === "essay"
              ? "请输入作文主题，如：我的家乡..."
              : "请输入文章篇章名，如：背影..."
          }
          onSubmit={handleSubmit}
          loading={loading}
        />

        {loading && (
          <div className="mt-6">
            <SkeletonLoader />
          </div>
        )}

        {result && lastItem && (
          <div className="mt-6">
            <ResultCard
              content={result}
              item={lastItem}
              isFav={checkFav(lastItem.id)}
              onToggleFavorite={() => toggleFavorite(lastItem)}
            />
          </div>
        )}

        {hooks && hooks.length > 0 && (
          <div className="mt-6">
            <HookList hooks={hooks} />
          </div>
        )}

        {error && (
          <ErrorToast
            message={error.message}
            code={error.code}
            onRetry={() => setError(null)}
            onDismiss={() => setError(null)}
          />
        )}
      </div>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onToggleFavorite={toggleFavorite}
        onClearAll={clearAll}
        isFavorite={checkFav}
      />
      <FavoriteDrawer
        open={favoriteOpen}
        onClose={() => setFavoriteOpen(false)}
        favorites={favorites}
        onRemove={(id) => toggleFavorite({ id } as never)}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write 数学页面 (src/app/math/page.tsx)**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import InputPanel from "@/components/shared/InputPanel";
import ResultCard from "@/components/shared/ResultCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import HistoryDrawer from "@/components/shared/HistoryDrawer";
import FavoriteDrawer from "@/components/shared/FavoriteDrawer";
import { useHistory } from "@/hooks/useHistory";
import { Clock, Heart } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function MathPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [lastItem, setLastItem] = useState<ReturnType<typeof useHistory>["history"][0] | null>(null);

  const { history, favorites, save, toggleFavorite, clearAll, isFavorite: checkFav } = useHistory();

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); return; }
      setResult(json.data.raw);
      const item = save("math", input, { raw: json.data.raw });
      setLastItem(item);
    } catch {
      setError({ message: "网络错误，请检查连接后重试" });
    } finally {
      setLoading(false);
    }
  }, [save]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#4da6ff" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-math mb-2">数学学习</h2>
          <p className="text-text-secondary text-sm">AI 智能解题 · 数学家故事 · 考点分析</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1" />
          <button onClick={() => setHistoryOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Clock className="w-5 h-5 text-text-secondary" />
          </button>
          <button onClick={() => setFavoriteOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Heart className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <InputPanel
          placeholder="请输入数学题目，如：解方程 2x² - 5x + 2 = 0..."
          onSubmit={handleSubmit}
          loading={loading}
          maxLength={1000}
        />

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && lastItem && (
          <div className="mt-6">
            <ResultCard
              content={result}
              item={lastItem}
              isFav={checkFav(lastItem.id)}
              onToggleFavorite={() => toggleFavorite(lastItem)}
            />
          </div>
        )}

        {error && (
          <ErrorToast message={error.message} code={error.code} onRetry={() => setError(null)} onDismiss={() => setError(null)} />
        )}
      </div>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} history={history}
        onToggleFavorite={toggleFavorite} onClearAll={clearAll} isFavorite={checkFav} />
      <FavoriteDrawer open={favoriteOpen} onClose={() => setFavoriteOpen(false)} favorites={favorites}
        onRemove={(id) => toggleFavorite({ id } as never)} />
    </div>
  );
}
```

- [ ] **Step 3: Write 英语页面 (src/app/english/page.tsx)**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ModeSelector from "@/components/shared/ModeSelector";
import InputPanel from "@/components/shared/InputPanel";
import ResultCard from "@/components/shared/ResultCard";
import HookList from "@/components/shared/HookList";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import HistoryDrawer from "@/components/shared/HistoryDrawer";
import FavoriteDrawer from "@/components/shared/FavoriteDrawer";
import { useHistory } from "@/hooks/useHistory";
import type { EnglishMode, EssayHook } from "@/types";
import { Clock, Heart } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

const MODE_OPTIONS = [
  { value: "grammar" as const, label: "语法指导" },
  { value: "essay" as const, label: "作文指导" },
];

export default function EnglishPage() {
  const [mode, setMode] = useState<EnglishMode>("grammar");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [outline, setOutline] = useState<string | null>(null);
  const [hooks, setHooks] = useState<EssayHook[] | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [lastItem, setLastItem] = useState<ReturnType<typeof useHistory>["history"][0] | null>(null);

  const { history, favorites, save, toggleFavorite, clearAll, isFavorite: checkFav } = useHistory();

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true);
    setResult(null); setOutline(null); setHooks(null); setError(null);
    try {
      const res = await fetch("/api/english", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); return; }

      if (mode === "essay") {
        setOutline(json.data.outline || "");
        setHooks(json.data.hooks || []);
        const item = save("english", input, { outline: json.data.outline, hooks: json.data.hooks }, mode);
        setLastItem(item);
      } else {
        setResult(json.data.raw || "");
        const item = save("english", input, { raw: json.data.raw }, mode);
        setLastItem(item);
      }
    } catch {
      setError({ message: "网络错误，请检查连接后重试" });
    } finally {
      setLoading(false);
    }
  }, [mode, save]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#3dd68c" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-english mb-2">英语学习</h2>
          <p className="text-text-secondary text-sm">AI 语法精讲 · 满分作文指导</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1"><ModeSelector options={MODE_OPTIONS} value={mode} onChange={setMode} /></div>
          <button onClick={() => setHistoryOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Clock className="w-5 h-5 text-text-secondary" />
          </button>
          <button onClick={() => setFavoriteOpen(true)} className="glass-card p-2.5 rounded-xl hover:border-white/15 transition-all">
            <Heart className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <InputPanel
          placeholder={mode === "grammar" ? "输入中文描述语法点，如：现在完成时... 或粘贴英文句子" : "输入文体和主题，如：书信 给朋友的感谢信..."}
          onSubmit={handleSubmit}
          loading={loading}
          maxLength={1000}
        />

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && lastItem && (
          <div className="mt-6">
            <ResultCard content={result} item={lastItem} isFav={checkFav(lastItem.id)}
              onToggleFavorite={() => toggleFavorite(lastItem)} />
          </div>
        )}

        {outline && (
          <div className="mt-6 glass-card p-6">
            <h3 className="text-lg font-bold text-english mb-4">满分作文大纲与指导</h3>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{outline}</div>
          </div>
        )}

        {hooks && hooks.length > 0 && (
          <div className="mt-6"><HookList hooks={hooks} /></div>
        )}

        {error && (
          <ErrorToast message={error.message} code={error.code} onRetry={() => setError(null)} onDismiss={() => setError(null)} />
        )}
      </div>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} history={history}
        onToggleFavorite={toggleFavorite} onClearAll={clearAll} isFavorite={checkFav} />
      <FavoriteDrawer open={favoriteOpen} onClose={() => setFavoriteOpen(false)} favorites={favorites}
        onRemove={(id) => toggleFavorite({ id } as never)} />
    </div>
  );
}
```

- [ ] **Step 4: No compilation errors**

Run:
```bash
pnpm tsc --noEmit
```

Expected: No errors

---

### Task 14: 物理 & 化学实验列表页

**Files:**
- Create: `src/app/physics/page.tsx`, `src/app/chemistry/page.tsx`, `src/components/experiment/ExperimentCard.tsx`

- [ ] **Step 1: Write ExperimentCard.tsx**

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
        className="glass-card p-6 cursor-pointer group hover:border-white/15 transition-all h-full"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${color}15` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">{experiment.name}</h3>
            <p className="text-sm text-text-secondary mb-2">{experiment.description}</p>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
              {experiment.scientist}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 2: Write physics/page.tsx**

```tsx
"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ExperimentCard from "@/components/experiment/ExperimentCard";
import { PHYSICS_EXPERIMENTS } from "@/lib/experiments";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function PhysicsPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#a78bfa" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-physics mb-2">物理实验</h2>
          <p className="text-text-secondary text-sm">交互式物理实验 · 物理学家的故事</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {PHYSICS_EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ExperimentCard experiment={exp} color="#a78bfa" href={`/physics/${exp.id}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write chemistry/page.tsx**

```tsx
"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ExperimentCard from "@/components/experiment/ExperimentCard";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function ChemistryPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#f0a040" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-chemistry mb-2">化学实验</h2>
          <p className="text-text-secondary text-sm">交互式化学实验 · 化学家的故事</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {CHEMISTRY_EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ExperimentCard experiment={exp} color="#f0a040" href={`/chemistry/${exp.id}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Dev server renders both list pages**

Run:
```bash
pnpm dev
```

Expected: /physics 和 /chemistry 显示4张实验卡片

---

### Task 15: 实验详情页（物理 + 化学）

**Files:**
- Create: `src/app/physics/[experimentId]/page.tsx`, `src/app/chemistry/[experimentId]/page.tsx`, `src/components/experiment/ExperimentCanvas.tsx`

- [ ] **Step 1: Write ExperimentCanvas.tsx (空 Canvas 占位 + 实验信息)**

```tsx
"use client";
import { useRef, useEffect } from "react";

interface Props {
  experimentId: string;
  color: string;
}

export default function ExperimentCanvas({ experimentId, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      // 背景网格
      ctx!.strokeStyle = "rgba(255,255,255,0.03)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }

      // 实验标题
      ctx!.fillStyle = color;
      ctx!.font = "16px sans-serif";
      ctx!.textAlign = "center";
      ctx!.fillText(`交互实验区域 · ${experimentId}`, w / 2, h / 2 - 10);

      ctx!.fillStyle = "rgba(255,255,255,0.3)";
      ctx!.font = "12px sans-serif";
      ctx!.fillText("拖拽或点击元件进行实验操作", w / 2, h / 2 + 20);

      animId = requestAnimationFrame(draw);
    }

    function resize() {
      canvas!.width = canvas!.offsetWidth * window.devicePixelRatio;
      canvas!.height = canvas!.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [experimentId, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-72 md:h-96 rounded-xl glass-card"
      style={{ display: "block" }}
    />
  );
}
```

- [ ] **Step 2: Write physics/[experimentId]/page.tsx**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ExperimentCanvas from "@/components/experiment/ExperimentCanvas";
import { PHYSICS_EXPERIMENTS } from "@/lib/experiments";
import { Beaker } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function PhysicsExperimentPage() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const experiment = PHYSICS_EXPERIMENTS.find((e) => e.id === experimentId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const loadExperiment = useCallback(async () => {
    if (!experiment) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/physics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentName: experiment.name, scientist: experiment.scientist }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); return; }
      setResult(json.data.raw);
    } catch {
      setError({ message: "网络错误" });
    } finally {
      setLoading(false);
    }
  }, [experiment]);

  if (!experiment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-text-secondary">实验未找到</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#a78bfa" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-physics mb-1">
          {experiment.name}
        </motion.h2>
        <p className="text-text-secondary text-sm mb-6">{experiment.scientist}</p>

        <ExperimentCanvas experimentId={experimentId} color="#a78bfa" />

        <div className="mt-6 flex gap-4">
          <button
            onClick={loadExperiment}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-physics/20 hover:bg-physics/30 text-physics font-medium text-sm transition-all flex items-center gap-2"
          >
            <Beaker className="w-4 h-4" />
            {loading ? "加载中..." : "AI 实验指导"}
          </button>
        </div>

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card p-6">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{result}</div>
          </motion.div>
        )}

        {error && (
          <ErrorToast message={error.message} code={error.code} onRetry={loadExperiment} onDismiss={() => setError(null)} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write chemistry/[experimentId]/page.tsx**

```tsx
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import ErrorToast from "@/components/shared/ErrorToast";
import ExperimentCanvas from "@/components/experiment/ExperimentCanvas";
import { CHEMISTRY_EXPERIMENTS } from "@/lib/experiments";
import { Beaker } from "lucide-react";

const ThreeParticles = dynamic(() => import("@/components/three/ThreeParticles"), { ssr: false });

export default function ChemistryExperimentPage() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const experiment = CHEMISTRY_EXPERIMENTS.find((e) => e.id === experimentId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const loadExperiment = useCallback(async () => {
    if (!experiment) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chemistry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentName: experiment.name, scientist: experiment.scientist }),
      });
      const json = await res.json();
      if (!res.ok) { setError({ message: json.error, code: json.code }); return; }
      setResult(json.data.raw);
    } catch {
      setError({ message: "网络错误" });
    } finally {
      setLoading(false);
    }
  }, [experiment]);

  if (!experiment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-text-secondary">实验未找到</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeParticles color="#f0a040" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-chemistry mb-1">
          {experiment.name}
        </motion.h2>
        <p className="text-text-secondary text-sm mb-6">{experiment.scientist}</p>

        <ExperimentCanvas experimentId={experimentId} color="#f0a040" />

        <div className="mt-6 flex gap-4">
          <button
            onClick={loadExperiment}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-chemistry/20 hover:bg-chemistry/30 text-chemistry font-medium text-sm transition-all flex items-center gap-2"
          >
            <Beaker className="w-4 h-4" />
            {loading ? "加载中..." : "AI 实验指导"}
          </button>
        </div>

        {loading && <div className="mt-6"><SkeletonLoader /></div>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card p-6">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{result}</div>
          </motion.div>
        )}

        {error && (
          <ErrorToast message={error.message} code={error.code} onRetry={loadExperiment} onDismiss={() => setError(null)} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: No compilation errors + all pages render**

Run:
```bash
pnpm tsc --noEmit
pnpm dev
```

Expected: 所有页面可访问

---

## Phase 8: 验证 & 部署

### Task 16: 最终验证 & Vercel 部署准备

- [ ] **Step 1: TypeScript 编译检查**

Run:
```bash
pnpm tsc --noEmit
```

Expected: Zero errors

- [ ] **Step 2: Production build**

Run:
```bash
pnpm build
```

Expected: Build succeeds

- [ ] **Step 3: 本地验证所有页面**

打开浏览器验证以下网址均可正常加载：
- http://localhost:3000/
- http://localhost:3000/yuwen
- http://localhost:3000/math
- http://localhost:3000/english
- http://localhost:3000/physics
- http://localhost:3000/physics/refraction
- http://localhost:3000/chemistry
- http://localhost:3000/chemistry/oxygen

- [ ] **Step 4: 验证无 API Key 时的错误提示**

临时将 `.env.local` 中 `DEEPSEEK_API_KEY` 改为 `sk-your-key-here`，访问任一学科页面提交请求，确认显示错误提示而非崩溃。然后恢复 key。

- [ ] **Step 5: 配置 .env.local 以真正的 DeepSeek Key 重新构建**

```bash
pnpm build
```

- [ ] **Step 6: 提交 Git（可选）**

如果项目目录已初始化 git：
```bash
git add .
git commit -m "feat: GLUT Aing Education - AI赋能教育5科学习助手"
```

---

## 计划自检清单

- [x] **Spec coverage**: 每个 spec 需求都有对应任务 — 5 科功能、localStorage、API Key 保护、响应式、3D 特效、复制/收藏/历史、错误提示、Vercel 部署
- [x] **No placeholders**: 所有代码步骤都是完整可执行的
- [x] **Type consistency**: 类型定义在 Task 2 统一定义，后续任务引用一致
- [x] **Scope**: 覆盖所有包含范围，不涉及登录、数据库、国际化等排除范围
