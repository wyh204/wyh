# GLUT Aing Education 前端重设计 Spec

> 基于 Lando Norris 官网设计语言，对全部 8 个页面进行视觉重设计，修复 markdown 噪音问题，增加流式 AI 响应和 R3F 实验器材交互。

**设计参考：** landonorris.com — 暗色基底 + 单一高亮色 + 大间距编排 + 极简交互

---

## 一、全局设计系统

### 1.1 色彩

| 用途 | 色值 |
|------|------|
| 页面背景 | `#0a0a0f` |
| 卡片背景 | `#0d0d1a` |
| 边框 | `rgba(255,255,255,0.06)` |
| 正文 | `rgba(255,255,255,0.65)` |
| 次要文字 | `rgba(255,255,255,0.35)` |
| 标签/面包屑 | `rgba(255,255,255,0.2)` |
| 语文 | `#a78bfa` |
| 数学 | `#60a5fa` |
| 英语 | `#34d399` |
| 物理 | `#c084fc` |
| 化学 | `#f0a040` |

原则：每个页面只出现一个学科色作为高亮，其余全部用中性色。

### 1.2 字体（几何现代 · 字重对比）

**零额外字体下载，纯系统字体的设计感。**

- **大标题（Hero/页面名）**：系统黑体 `font-weight: 900`，`letter-spacing: 0.04em`，与英文轻斜体混排
  - 中文词用 900 粗体 + 底部 4px 学科色底线
  - 英文装饰词用 300 细斜体 + 低透明度（如 "Universe" "Chinese"）
  - 同一行内 900 vs 300 字重对比制造张力
- **学科竖排标签**：`font-family: monospace`，`writing-mode: vertical-rl`，`letter-spacing: 0.2em`，侧边栏式排列
- **导航/面包屑**：`font-size: 10px`，`letter-spacing: 0.12em`，全大写
- **正文/AI 回答**：系统 sans-serif，`font-size: 14px`，`line-height: 1.8`，`font-weight: 400`
- **标签**：`font-size: 10-12px`，`letter-spacing: 0.15em`，`font-weight: 700`

### 1.3 间距

- 页面水平 padding：`48px`（桌面）/ `24px`（移动）
- 区块垂直间距：大区块 80px+，小区块 24-32px
- 卡片内 padding：`24px`
- 标题与正文间距：`16px`

### 1.4 圆角与边框

- 卡片：`border-radius: 4px`（微圆角，接近直角）
- 按钮：`border-radius: 4px`
- 输入框：`border-radius: 4px`
- 边框统一：`1px solid rgba(255,255,255,0.06)`
- 高亮色条：`3px` 宽，左侧或底部，用学科色

### 1.5 毛玻璃

- 保留但弱化：`backdrop-filter: blur(12px)` + `rgba(255,255,255,0.02)` 背景
- 仅用于 Navbar 和抽屉面板
- 内容卡片不再使用强毛玻璃，改用纯色 `#0d0d1a`

---

## 二、动效系统（6 项）

### 2.1 字显动画（首页 Hero）
- 大标题每个字用 Framer Motion `staggerChildren: 0.03`
- 每个字从 `opacity: 0, y: 24, filter: blur(4px)` → `opacity: 1, y: 0, filter: blur(0)`
- duration: 0.5s，ease: easeOut

### 2.2 卡片 Hover 光晕
- 学科卡片 hover：底部 `3px` 色条从 0 宽度 expand 到 100%，transition 0.3s
- 卡片边缘出现 `box-shadow: 0 0 20px <学科色 8%>`
- 卡片背景从 `#0d0d1a` 微亮到 `#111122`

### 2.3 光标聚光灯
- 首页 Hero 区域监听 `mousemove`
- 渲染一个 300px 径向渐变圆跟随鼠标：`radial-gradient(circle, <学科色 6%>, transparent 70%)`
- 鼠标离开 Hero 区域后 0.5s 淡出

### 2.4 滚动视差
- ThreeParticles 背景 `y` 偏移 = `scrollY * 0.3`
- 学科卡片进入视口时 Framer Motion `whileInView` 触发：`opacity: 0→1, y: 24→0`
- stagger 0.1s per card

### 2.5 AI 流式打字
- API 改为 `stream: true`，SSE 流式返回
- 前端逐 token 追加显示
- 光标闪烁动画 `|` 直到流结束
- 左侧色条高度随内容增长

### 2.6 页面过渡
- Next.js `Link` 点击 → 150ms 粒子淡出 + 新页从下往上滑入 10px
- 使用 Framer Motion `AnimatePresence` + `layoutTransition`

---

## 三、页面重设计

### 3.1 首页 `/`

```
┌─────────────────────────────────────────┐
│ NAVBAR：GLUT AING         历史  收藏    │
├─────────────────────────────────────────┤
│                                         │
│                                           │
│   探 索 · 知 识 · 宇 宙                   │  ← 900 粗体黑体 + 底部 4px 色条
│   Universe                               │  ← 300 细斜体英文装饰
│                                           │
│   AI 驱动的互动学习体验...                 │  ← 光标聚光灯区域
│                                         │
│   ┌────────┐ ┌────────┐ ┌────────┐      │
│   │ 语 文  │ │ 数 学  │ │ 英 语  │      │  ← hover 光晕
│   │        │ │        │ │        │      │
│   │────────│ │────────│ │────────│      │
│   └────────┘ └────────┘ └────────┘      │
│   ┌────────┐ ┌────────┐                 │
│   │ 物 理  │ │ 化 学  │                 │
│   │        │ │        │                 │
│   └────────┘ └────────┘                 │
│                                         │
│   3D 粒子背景 · 视差滚动                  │
└─────────────────────────────────────────┘
```

变化点：
- 标题改为 Lando 式的超大编排体
- 学科卡片改为纵向矩形，每张含学科色渐变顶部 + 底部色条
- 描述文字一行小字
- 五张卡片以 5 列 flex 排列（桌面），2+2+1 换行（移动）

### 3.2 语文 `/yuwen`

```
┌─────────────────────────────────────────┐
│ 课程 / 语 文                             │  ← 面包屑
│                                         │
│ 语 文                                    │  ← 56px 标题
│ Chinese                                 │  ← 英文装饰
│                                         │
│ 现代文学鉴赏 · 古文精读 · 作文辅导         │
│                                         │
│ ─── 现代文学  ─── 古文学习  ─── 作文HELP  │  ← underline 模式切换
│                                         │
│ ┌──────────────────────────────┐ [发送] │  ← 输入框 + 按钮
│ └──────────────────────────────┘         │
│                                         │
│ ┃ AI 回 答                   复制 收藏  │  ← 左侧 3px 色条
│ ┃                                      │
│ ┃ 【作者介绍】                           │  ← Markdown 渲染
│ ┃ 鲁迅（1881-1936）...                   │
│ ┃                                      │
│ ┃ 【写作背景】                           │
│ ┃ ...                                  │
│ └────────────────────────────────────── │
│                                         │
│ 3D 粒子轻量背景                          │
└─────────────────────────────────────────┘
```

变化点：
- 模式选择从 tab/button 改为 underline 式
- 输入框单行 + 右侧发送按钮，Lando 式极简
- 结果卡左侧学科色条 + markdown 富文本渲染
- `react-markdown` + `remark-gfm` 渲染 AI 回答

### 3.3 数学 `/math`

结构同语文，去掉模式选择（数学只有一个模式），标题改为"数 学 / Math"，色条用 `#60a5fa`。

### 3.4 英语 `/english`

结构同语文，模式切换：语法指导 / 作文指导，色条用 `#34d399`。

### 3.5 物理列表 `/physics`

```
┌─────────────────────────────────────────┐
│ 课程 / 物 理                             │
│                                         │
│ 物 理                                    │
│ Physics                                 │
│                                         │
│ 交互式实验 · 物理学家的故事               │
│                                         │
│ ┌──────────────────┐ ┌──────────────┐   │
│ │                  │ │              │   │  ← 实验卡片 2x2 grid
│ │   光的折射实验    │ │ 电路连接实验  │   │     hover 微光
│ │                  │ │              │   │
│ │ ──────────────── │ │ ──────────── │   │
│ └──────────────────┘ └──────────────┘   │
│ ┌──────────────────┐ ┌──────────────┐   │
│ │ 浮力探究实验     │ │ 凸透镜成像    │   │
│ └──────────────────┘ └──────────────┘   │
└─────────────────────────────────────────┘
```

### 3.6 物理实验详情 `/physics/[experimentId]`

```
┌─────────────────────────────────────────┐
│ 课程 / 物理 / 光的折射实验                │
│                                         │
│ 光的折射实验                             │
│ 斯涅尔 · 物理学家                        │
│                                         │
│ ┌──────────────────────────────────────┐ │
│ │                                      │ │
│ │        R3F 3D 交互实验区              │ │  ← 可拖拽 3D 器材
│ │    ┌──┐      ┌───┐                   │ │
│ │    │激光│ ──→ │棱镜│ ──→ 折射光线     │ │
│ │    └──┘      └───┘                   │ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
│                                         │
│ [AI 实验指导]                            │
│                                         │
│ ┃ AI 回 答                              │  ← 流式打字
│ ┃ 【实验目的】...                        │
└─────────────────────────────────────────┘
```

变化点：
- `ExperimentCanvas` 重写为 R3F 场景
- Canvas 2D 占位彻底移除
- 每个实验有独立 3D 场景和可拖拽器材

### 3.7 化学 `/chemistry` + `/chemistry/[experimentId]`

结构同物理，色条用 `#f0a040`。

---

## 四、技术实现要点

### 4.1 Markdown 渲染
- `npm install react-markdown remark-gfm`
- `ResultCard.tsx`：`<div className="whitespace-pre-wrap">` → `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
- 自定义 components：`h1-h3` 用学科色，`strong` 用学科色，`ul/ol` 正常渲染
- 同时删除 `prompts.ts` 中不再需要的 markdown 格式说明（AI 返回 markdown 直接用）

### 4.2 流式 AI
- `deepseek.ts` 新增 `callDeepSeekStream()` 函数，参数 `{ stream: true }`
- 返回 `AsyncGenerator<string>`，逐 chunk yield delta content
- API Routes 改为 `ReadableStream` 响应，`Content-Type: text/event-stream`
- 前端用 `fetch` + `response.body.getReader()` 读取 SSE
- UI：`ResultCard` 新增 `streaming` 模式

### 4.3 R3F 实验器材

每个实验一个独立 R3F 组件：

| 实验 | 3D 场景 |
|------|---------|
| 光的折射 | 激光束 → 三棱镜 → 折射光线，棱镜可旋转 |
| 电路连接 | 电池 + 导线 + 灯泡，导线头可拖拽连接 |
| 浮力实验 | 水槽 + 物体，物体可拖入水中观察浮力 |
| 凸透镜成像 | 蜡烛 + 凸透镜 + 光屏，蜡烛可拖拽调距 |
| 化学 4 个 | 烧杯/试管/酒精灯/铁架台，器材可拖入实验台 |

技术方案：
- 使用项目已有的 `@react-three/drei` 的 `DragControls` 或手写 `useDrag` hook
- 几何体用 `Box`/`Cylinder`/`Sphere`、`Tube`/`Line` 组合
- 光照：ambient + directional + point light
- 相机：`OrbitControls`（限制缩放范围，防止跑飞）
- 移动端：touch 事件正常支持

### 4.4 动效实现
- 01 字显：Framer Motion `staggerChildren`
- 02 hover：Tailwind `group-hover` + CSS transition
- 03 聚光灯：`onMouseMove` + React state 更新 radial-gradient 位置
- 04 视差：`useScroll` + ThreeParticles 接收 scrollY prop
- 05 打字：流式追加 + CSS blink 光标
- 06 过渡：`AnimatePresence` + `layoutId`

### 4.5 CSS 架构

`globals.css` 大幅简化：
- 移除 `.glass-card` 的强毛玻璃
- 新增 `.content-card`：`bg-[#0d0d1a] border border-[rgba(255,255,255,0.06)] rounded`
- 新增 `.accent-bar`：左侧或底部学科色条
- 移除大量不再使用的 `@apply` 组合

---

## 五、文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 改 | `package.json` | +react-markdown, +remark-gfm |
| 改 | `src/app/globals.css` | 简化为 Lando 风格 CSS |
| 改 | `src/app/page.tsx` | Hero 区重写 + 字显动画 + 聚光灯 |
| 改 | `src/app/yuwen/page.tsx` | Lando 布局 + 流式 |
| 改 | `src/app/math/page.tsx` | Lando 布局 + 流式 |
| 改 | `src/app/english/page.tsx` | Lando 布局 + 流式 |
| 改 | `src/app/physics/page.tsx` | Lando 卡片 + 视差入场 |
| 改 | `src/app/chemistry/page.tsx` | Lando 卡片 + 视差入场 |
| 改 | `src/app/physics/[experimentId]/page.tsx` | +R3F 场景 + 流式 |
| 改 | `src/app/chemistry/[experimentId]/page.tsx` | +R3F 场景 + 流式 |
| 改 | `src/components/shared/ResultCard.tsx` | Markdown 渲染 + 流式模式 |
| 改 | `src/components/shared/SubjectCard.tsx` | Lando 纵向卡片 + hover 光晕 |
| 改 | `src/components/shared/ModeSelector.tsx` | Lando underline 样式 |
| 改 | `src/components/shared/InputPanel.tsx` | Lando 单行输入 + 发送按钮 |
| 改 | `src/components/experiment/ExperimentCard.tsx` | Lando 卡片 + hover 光晕 |
| 重写 | `src/components/experiment/ExperimentCanvas.tsx` | → R3F 场景组件 |
| 新增 | `src/components/experiment/RefractionScene.tsx` | 光的折射 R3F |
| 新增 | `src/components/experiment/CircuitScene.tsx` | 电路连接 R3F |
| 新增 | `src/components/experiment/BuoyancyScene.tsx` | 浮力实验 R3F |
| 新增 | `src/components/experiment/LensScene.tsx` | 凸透镜成像 R3F |
| 新增 | `src/components/experiment/ChemistryLabScene.tsx` | 化学通用实验 R3F |
| 新增 | `src/components/three/SpotlightCursor.tsx` | 光标聚光灯组件 |
| 改 | `src/lib/deepseek.ts` | +callDeepSeekStream() |
| 改 | `src/app/api/yuwen/route.ts` | 流式 SSE 支持 |
| 改 | `src/app/api/math/route.ts` | 流式 SSE 支持 |
| 改 | `src/app/api/english/route.ts` | 流式 SSE 支持 |
| 改 | `src/app/api/physics/route.ts` | 流式 SSE 支持 |
| 改 | `src/app/api/chemistry/route.ts` | 流式 SSE 支持 |
| 改 | `src/components/layout/Navbar.tsx` | Lando 极简导航 |
| 改 | `src/components/shared/HookCard.tsx` | Lando 风格调整 |
| 改 | `src/components/shared/HookList.tsx` | Lando 网格 |
| 不改 | `src/lib/storage.ts` | 保持不变 |
| 不改 | `src/hooks/` | 保持不变 |
| 不改 | `src/types/` | 可能需要新增 streaming 相关类型 |

---

## 六、不变更项

- localStorage 存储逻辑
- 路由结构
- API 密钥管理
- 类型系统主体
- Tailwind 配置
- Next.js 配置

---

## 七、验收标准

1. AI 回答中无裸露 `**` `*` 符号，层级排版正确
2. AI 回答以流式逐字出现，不等待完整响应
3. 物理 4 个实验各有可拖拽 3D 器材
4. 化学 4 个实验各有可拖拽 3D 器材
5. 首页 Lando 风格标题 + 6 项动效全部生效
6. 8 个页面视觉风格统一
7. 移动端布局不炸
8. `npm run build` TypeScript 零错误
9. `npm run dev` 正常启动
