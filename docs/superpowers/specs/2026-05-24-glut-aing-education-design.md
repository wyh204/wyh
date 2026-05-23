# GLUT Aing Education — 产品与技术设计规格

> 日期：2026-05-24  
> 状态：已确认  
> 项目：三下乡 — AI赋能教育

---

## 一、产品概览

**产品名**：GLUT Aing Education  
**定位**：AI 赋能中小学 5 科学习助手  
**目标用户**：中国中小学生（小学高年级 ~ 初中）  
**部署目标**：Vercel 一键部署  
**本地路径**：`C:\Users\19375\Desktop\三下乡ai+教育前端项目`

### 用户核心流程

```
首页（5 科入口 + 3D 背景）
  ├─ 语文 → 输入框 + 模式选择 → AI 分析 → 结果（复制/收藏/历史）
  ├─ 数学 → 输入题目 → AI 解答 + 数学家故事 → 结果
  ├─ 英语 → 输入框 + 模式选择 → AI 指导 → 结果
  ├─ 物理 → 4 实验卡片 → 点击进入 → Canvas 2D 交互实验 + AI + 物理学家故事
  └─ 化学 → 4 实验卡片 → 点击进入 → Canvas 2D 交互实验 + AI + 化学家故事
```

---

## 二、视觉设计规范

### 2.1 整体风格

**"赛博书院"** — 传统文化与现代科技融合，深色主题，各学科独立配色。

### 2.2 色彩体系

| 用途 | 色值 |
|------|------|
| 背景底色 | #0a0a1a ~ #0f0f2a（深蓝黑） |
| 语文主题色 | 朱砂红 #e85d3a |
| 数学主题色 | 天蓝 #4da6ff |
| 英语主题色 | 翡翠绿 #3dd68c |
| 物理主题色 | 紫罗兰 #a78bfa |
| 化学主题色 | 橙金 #f0a040 |
| 文本主色 | #e8e8f0 |
| 卡片背景 | rgba(15, 15, 42, 0.6) + backdrop-blur |

### 2.3 3D 特效方案

| 页面 | 3D 内容 | 技术 |
|------|---------|------|
| 首页背景 | 缓慢旋转几何体（正十二面体、环面结），每个发光对应学科色 | Three.js + React Three Fiber |
| 5 科入口卡片 | 3D tilt 跟随鼠标，hover 浮起 + 边缘发光 | Framer Motion + CSS 3D transform |
| 学科页面背景 | 轻量浮动粒子 + 学科色光晕轨道 | Three.js 降级版 |
| 实验页面背景 | 浅层 3D 粒子 | Three.js 降级版 |

**3D 性能保护**：
- 移动端减少几何体数量（桌面 8→手机 3）
- 检测低端设备 → 切换纯 CSS 动画
- 离开首页销毁主 3D 场景，学科页只用轻量粒子
- 3D Canvas 异步加载，不阻塞首屏

### 2.4 字体

- 使用系统字体栈：`-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif`
- 不加载外部字体，保证首屏速度

### 2.5 响应式断点

| 断点 | 布局 |
|------|------|
| 桌面（≥1024px） | 卡片 3-5 列，内容双栏 |
| 平板（768-1023px） | 卡片 2-3 列 |
| 手机（<768px） | 单列堆叠，全宽卡片 |

### 2.6 动效

- 页面过渡：Framer Motion `AnimatePresence`
- 卡片入场：stagger + spring 弹性
- 背景粒子：CSS animation 或轻量 Canvas
- AI 结果：打字机逐字出现效果

---

## 三、功能详细规格

### 3.1 通用功能

| 功能 | 说明 |
|------|------|
| 复制 | 每条 AI 结果有复制按钮，一键复制到剪贴 |
| 收藏 | 收藏按钮（心形图标），存入 localStorage |
| 历史记录 | 自动保存到 localStorage，侧栏/抽屉查看 |
| API Key 提示 | `.env.local` 无 key 时，页面顶部显示红色 banner："API Key 未配置，请联系管理员"，不崩溃 |
| 加载状态 | AI 调用期间显示 skeleton loader + 脉冲动画 |
| 错误处理 | 网络错误/超时/AI 返回异常时 toast 提示 + 重试按钮 |

### 3.2 语文板块 (`/yuwen`)

**模式一：现代文学学习**
- 输入：文章篇章名称
- AI 输出：作者介绍（含趣事）+ 写作背景 + 文章鉴赏

**模式二：古文学习**
- 输入：古文篇章名称
- AI 输出：作者介绍（含趣事）+ 写作背景 + 一字一译 + 重点古文字/句型 + 文章鉴赏

**模式三：考试作文 Help**
- 输入：作文主题
- AI 输出：10 个不同风格的爆款开头结尾大纲 hook  
  每个 hook 含：hook 文案、风格标签、点击欲评分（1-10）、推荐理由

### 3.3 数学板块 (`/math`)

- 输入：数学题目（文字/LaTeX）
- AI 输出：
  1. 题目分析
  2. 判断涉及哪位数学家定理/结果
  3. 具体分析 + 解答过程
  4. 考点指出
  5. 涉及公式的数学家介绍 + 趣事

### 3.4 英语板块 (`/english`)

**模式一：语法指导**
- 输入中文 → 输出：语法用法 + 典型例句
- 输入英文句子 → 输出：翻译 + 含有的语法 + 典型例句

**模式二：作文指导**
- 输入：文体 + 主题
- AI 输出：满分作文大纲 + 写作指导 + 10 个不同风格开头结尾 hook  
  每个 hook 含：文案、风格标签、点击欲评分、推荐理由

### 3.5 物理板块 (`/physics`)

**4 个实验**（最终确认）：

| # | 实验 | 科学家 | Canvas 交互 |
|---|------|--------|-------------|
| 1 | 光的折射 | 斯涅尔 | 拖动激光入射角，实时看折射光线偏折 |
| 2 | 串联与并联电路 | 欧姆 | 拖拽导线/灯泡/开关，灯泡亮灭 |
| 3 | 阿基米德原理（浮力） | 阿基米德 | 拖物体入水，水位上升 + 浮力示数变化 |
| 4 | 凸透镜成像 | 开普勒 | 拖动蜡烛位置，实像/虚像实时变化 |

**交互流程**：
- 首页卡片墙 → 点击实验 → 进入实验页
- Canvas 2D 动画展示实验过程，用户可拖拽/点击操作
- AI 实时生成步骤说明
- 展示涉及的物理学家简介 + 趣事

### 3.6 化学板块 (`/chemistry`)

**4 个实验**（最终确认）：

| # | 实验 | 科学家 | Canvas 交互 |
|---|------|--------|-------------|
| 1 | 实验室制取氧气 | 拉瓦锡 | 点击组装装置→加热→气泡+带火星木条复燃 |
| 2 | CO₂制取与检验 | 布莱克 | 点击组装→滴加稀盐酸→石灰水变浑浊 |
| 3 | 金属与酸的反应 | 贝采里乌斯 | 拖锌/铁/铜入稀盐酸，气泡速率差异 |
| 4 | 酸碱中和滴定 | 阿伦尼乌斯 | 逐滴滴加酸液，指示剂颜色渐变+pH变化 |

**交互流程**：同物理板块结构，展示化学家简介 + 趣事

---

## 四、技术架构

### 4.1 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript（严格模式） |
| UI 库 | Tailwind CSS 4 + shadcn/ui |
| 动画 | Framer Motion |
| 3D | Three.js + React Three Fiber + @react-three/drei |
| AI 接口 | DeepSeek API（OpenAI 兼容格式） |
| 本地存储 | localStorage |
| 部署 | Vercel |
| 包管理 | pnpm |

### 4.2 路由结构

```
/                          → 首页（5 科入口 + 3D 几何体背景）
/yuwen                     → 语文（输入框 + 模式选择 + 结果展示）
/math                      → 数学（输入框 + 结果展示）
/english                   → 英语（输入框 + 模式选择 + 结果展示）
/physics                   → 物理（4 实验卡片墙）
/physics/[experimentId]    → 物理单个实验（Canvas 2D 交互 + AI 步骤）
/chemistry                 → 化学（4 实验卡片墙）
/chemistry/[experimentId]  → 化学单个实验（Canvas 2D 交互 + AI 步骤）
```

共 8 个路由页面。

### 4.3 API Routes（服务端，保护 API Key）

| Route | Method | 用途 |
|-------|--------|------|
| `/api/yuwen` | POST | 语文分析（现代文学/古文/作文Help） |
| `/api/math` | POST | 数学解题 + 数学家故事 |
| `/api/english` | POST | 英语指导（语法/作文） |
| `/api/physics/experiment` | POST | 物理实验 AI 步骤生成 |
| `/api/chemistry/experiment` | POST | 化学实验 AI 步骤生成 |

**安全设计**：
- `DEEPSEEK_API_KEY` 仅写在 `.env.local`，前端代码 0 引用
- 前端调 `/api/*` → 服务端读 `process.env` → 调 DeepSeek → 返回 JSON
- 加入请求体大小限制、超时 60s、错误统一处理

### 4.4 组件树

```
RootLayout
├─ ApiKeyBanner          — 无 key 时全局红条
├─ Navbar                — 顶部导航
├─ [page content]        
└─ Footer                

共享组件：
├─ SubjectCard           — 学科入口卡片（首页，3D tilt）
├─ ModeSelector          — 模式切换 tab（语文/英语）
├─ InputPanel            — 输入框 + 提交按钮
├─ ResultCard            — AI 结果卡片（含复制/收藏按钮）
├─ HookCard              — 作文 hook 结果卡片（含评分/风格标签）
├─ HistoryDrawer         — 历史记录侧栏
├─ FavoriteDrawer        — 收藏列表侧栏
├─ ThreeBackground       — 首页 3D 几何体背景
├─ ThreeParticles        — 学科页轻量粒子背景
├─ ExperimentCard        — 实验封面卡片（物理/化学）
├─ ExperimentCanvas      — Canvas 2D 实验动画
├─ SkeletonLoader        — 加载骨架屏
└─ ErrorToast            — 错误提示
```

### 4.5 数据流

```
用户输入 → 前端 state → fetch("/api/xxx", { body }) 
  → API Route 读 DEEPSEEK_API_KEY 
  → 拼 System Prompt → fetch DeepSeek API 
  → 返回 JSON → 前端渲染 ResultCard
  → localStorage 存历史记录
```

### 4.6 localStorage 设计

| Key | 结构 | 说明 |
|-----|------|------|
| `history` | `{ subject, mode, input, output, timestamp }[]` | 全局历史，最多 50 条 |
| `favorites` | `{ id, subject, mode, input, output, timestamp }[]` | 收藏列表 |
| `physics-progress` | `{ experimentId: { completed, score } }` | 物理实验进度 |
| `chemistry-progress` | `{ experimentId: { completed, score } }` | 化学实验进度 |

### 4.7 环境变量

```bash
# .env.local（唯一需要配置的地方）
DEEPSEEK_API_KEY=sk-xxx
DEEPSEEK_BASE_URL=https://api.deepseek.com  # 可选，默认值
DEEPSEEK_MODEL=deepseek-chat                  # 可选，默认值
```

---

## 五、需要进一步确认的细节

以下标记为 `[待确认]`，将在实现过程中逐一定下：

1. **DeepSeek System Prompt 的精确措辞**（需针对中小学生调整语气和深度）
2. **Canvas 2D 实验的具体交互玩法**（每个实验独立设计）
3. **是否需要在首页展示使用统计/最近学习动态**

---

## 六、范围边界

### 包含
- 5 科 AI 学习功能
- 物理/化学实验 Canvas 2D 交互
- 历史记录/收藏（localStorage）
- 3D 首页背景 + 各页面动效
- 响应式布局（桌面/平板/手机）
- API Key 保护
- Vercel 部署

### 不包含
- 用户登录/注册
- 数据库/后端服务
- WebGL 模型导入
- 卡通角色/吉祥物
- 外部字体
- 国际化
- 视频嵌入
