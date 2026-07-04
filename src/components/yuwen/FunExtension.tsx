"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Gamepad2, Library, Dice5, Loader2 } from "lucide-react";
import type { CharacterInfo } from "@/types";

/* ===================================================
   本地初始数据 — 首次加载用，点随机后换网络数据
   =================================================== */
const INIT_STORIES = [
  { title: "📜 范仲淹与《岳阳楼记》", content: "范仲淹是北宋著名的政治家、文学家。他写下千古名篇《岳阳楼记》时，其实并未亲临岳阳楼，而是根据好友滕子京寄来的一幅画和书信，凭借想象写成的。文中'先天下之忧而忧，后天下之乐而乐'成为传世名句，表达了作者以天下为己任的博大胸怀，也是中考常考的名句。" },
  { title: "🏛️ 欧阳修与《醉翁亭记》", content: "欧阳修是北宋文坛领袖，'唐宋八大家'之一。他因支持范仲淹改革被贬到滁州做太守，在滁州琅琊山建造了醉翁亭，写下了《醉翁亭记》。文中'醉翁之意不在酒，在乎山水之间也'流传千古——有趣的是，写这篇文章时欧阳修才40岁，却自称'苍颜白发'的醉翁，其实是一种自嘲和豁达的人生态度。" },
];

const INIT_CHARS: CharacterInfo[] = [
  { char: "焉", pinyin: "yān", definition: "文言文中常见的兼词，相当于'于之'（在这里/在那里）；也可作疑问代词，表示'哪里''怎么'", words: ["焉能", "心不在焉", "不入虎穴焉得虎子"] },
  { char: "乎", pinyin: "hū", definition: "文言语气词，可表疑问（吗/呢）、感叹（啊）或介词（相当于'于'）", words: ["不亦乐乎", "在乎", "出乎意料", "满不在乎"] },
  { char: "乃", pinyin: "nǎi", definition: "文言文中常用虚词，可作副词（于是、才、竟然）或判断动词（是、就是）", words: ["乃至", "乃至于", "此乃"] },
  { char: "遂", pinyin: "suì", definition: "文言文中表示承接关系的连词，意思是'于是''就'，常用来连接先后发生的事件", words: ["遂心", "遂愿", "半身不遂", "功成名遂"] },
  { char: "尝", pinyin: "cháng", definition: "文言文中作副词时意为'曾经'，如'未尝''尝闻'；现代汉语中意为品尝、尝试", words: ["未尝", "尝试", "品尝", "浅尝辄止"] },
];

const INIT_IDIOMS = [
  { idiom: "心旷神怡", pinyin: "xīn kuàng shén yí", meaning: "心境开阔，精神愉快。出自范仲淹《岳阳楼记》，形容看到美好景色或获得知识后的愉悦心情" },
  { idiom: "豁然开朗", pinyin: "huò rán kāi lǎng", meaning: "形容眼前一下子变得开阔明亮，也比喻突然领悟了某个道理。出自陶渊明《桃花源记》" },
  { idiom: "温故知新", pinyin: "wēn gù zhī xīn", meaning: "温习旧的知识，能够有新的理解和体会。出自《论语·为政》，是中考常考成语" },
  { idiom: "水落石出", pinyin: "shuǐ luò shí chū", meaning: "水落下去，石头就露出来。比喻事情的真相完全显露。出自欧阳修《醉翁亭记》" },
  { idiom: "百废俱兴", pinyin: "bǎi fèi jù xīng", meaning: "许多被废置的事业都兴办起来。出自范仲淹《岳阳楼记》，形容各项事业蓬勃发展的景象" },
];

/* ===================================================
   网络获取结果类型
   =================================================== */
interface StoryItem { title: string; content: string; }
interface GameItem extends CharacterInfo { memoryTip?: string; }
interface IdiomItem { idiom: string; pinyin: string; meaning: string; source?: string; example?: string; }

type FunTab = "story" | "game" | "idiom";

/* ═══════════════════════════════════════════════════
   🎲 网络随机获取
   ═══════════════════════════════════════════════════ */
async function fetchRandomContent(type: FunTab): Promise<StoryItem | GameItem | IdiomItem> {
  const res = await fetch("/api/yuwen/fun", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "NETWORK_ERROR");
  }

  const json = await res.json();

  if (type === "story") {
    const data = json.data as StoryItem;
    if (!data.title) {
      // 尝试从 content 中提取标题
      const titleMatch = data.content?.match(/《(.+?)》/);
      return { title: titleMatch ? `📜 ${titleMatch[1]}` : "📜 课文背景故事", content: data.content || json.raw || "" };
    }
    return data;
  }

  if (type === "game") {
    const data = json.data as GameItem;
    if (json.raw) {
      // AI 没返回有效 JSON，尝试从文本解析
      const raw = json.raw as string;
      const charMatch = raw.match(/生字[：:]\s*"?(\S)"?/);
      const pyMatch = raw.match(/拼音[：:]\s*(\S+)/);
      return {
        char: charMatch?.[1] || "?",
        pinyin: pyMatch?.[1] || "?",
        definition: raw.slice(0, 60) + "...",
        words: ["点击刷新重试"],
      };
    }
    return data;
  }

  // idiom
  const data = json.data as IdiomItem;
  if (json.raw) {
    const raw = json.raw as string;
    const idMatch = raw.match(/成语[：:]\s*(\S+)/);
    return { idiom: idMatch?.[1] || "?", pinyin: "?", meaning: raw.slice(0, 80) + "..." };
  }
  return data;
}

/* ═══════════════════════════════════════════════════
   组件
   ═══════════════════════════════════════════════════ */
interface Props { accentColor?: string; }

export default function FunExtension({ accentColor = "#FF7B5C" }: Props) {
  const [tab, setTab] = useState<FunTab>("story");
  const [expandedStory, setExpandedStory] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // ─── 各标签当前展示的数据 ───
  const [storyData, setStoryData] = useState<StoryItem>(INIT_STORIES[0]);
  const [gameData, setGameData] = useState<GameItem>(INIT_CHARS[0]);
  const [idiomData, setIdiomData] = useState<IdiomItem>(INIT_IDIOMS[0]);

  // ─── 加载 & 错误状态 ───
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spinBtn, setSpinBtn] = useState(false);

  /* ═══════════════════════════════════════════════
     🎲 随机刷新 — 不切换标签，从网络拉取当前标签内容
     ═══════════════════════════════════════════════ */
  const handleRandomRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSpinBtn(true);
    setExpandedStory(false);
    setFlippedCards(new Set());

    try {
      const result = await fetchRandomContent(tab);

      if (tab === "story") setStoryData(result as StoryItem);
      else if (tab === "game") setGameData(result as GameItem);
      else setIdiomData(result as IdiomItem);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      setError(msg === "TIMEOUT" ? "哎呀，新知识点迷路啦，再点一次试试吧~" : "哎呀，新知识点迷路啦，再点一次试试吧~");
    } finally {
      setLoading(false);
      setTimeout(() => setSpinBtn(false), 400);
    }
  }, [tab]);

  function toggleCard(index: number) {
    const next = new Set(flippedCards);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setFlippedCards(next);
  }

  return (
    <div className="mt-8 bg-white border-2 border-[#E8E0F0] rounded-2xl overflow-hidden shadow-sm">
      {/* ─── 标题栏 + 🎲 按钮 ─── */}
      <div className="flex items-center gap-2 px-6 py-4 border-b-2 border-[#F5F0FA]" style={{ background: `${accentColor}08` }}>
        <span className="text-xl">🎪</span>
        <h3 className="text-[16px] font-bold tracking-[0.05em] flex-1" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
          趣味拓展
        </h3>

        {/* 🎲 随机刷新按钮 */}
        <motion.button
          type="button"
          onClick={handleRandomRefresh}
          disabled={loading}
          whileHover={!loading ? { scale: 1.12, rotate: 15 } : {}}
          whileTap={!loading ? { scale: 0.9, rotate: -30 } : {}}
          animate={spinBtn ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
          transition={spinBtn ? { duration: 0.5, ease: "easeInOut" } : { duration: 0.2 }}
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-colors duration-200"
          style={{
            borderColor: loading || spinBtn ? accentColor : "#E8E0F0",
            background: loading || spinBtn ? `${accentColor}15` : "#FFFFFF",
            color: loading || spinBtn ? accentColor : "#B0A0C0",
            opacity: loading ? 0.7 : 1,
          }}
          title="随机刷新"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Dice5 className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* ─── 子标签 — 不切换 ─── */}
      <div className="flex border-b-2 border-[#F5F0FA] bg-[#FFFDF9]">
        {([
          { key: "story" as const, label: "📖 背景故事" },
          { key: "game" as const, label: "🎮 生字小游戏" },
          { key: "idiom" as const, label: "📚 成语积累" },
        ]).map((t) => (
          <button
            key={t.key} type="button" onClick={() => { setTab(t.key); setError(null); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-bold tracking-[0.04em] transition-all duration-200"
            style={{ color: tab === t.key ? accentColor : "#B0A0C0", borderBottom: tab === t.key ? `3px solid ${accentColor}` : "3px solid transparent", background: tab === t.key ? `${accentColor}08` : "transparent" }}
          >
            <span className="text-sm">{t.label.slice(0, 2)}</span>{t.label.slice(3)}
          </button>
        ))}
      </div>

      {/* ─── 内容区 ─── */}
      <div className="p-5">
        {/* 加载提示 */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 flex items-center justify-center gap-2 py-3 rounded-2xl" style={{ background: `${accentColor}08` }}>
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: accentColor }} />
              <span className="text-[13px] font-medium" style={{ color: accentColor }}>🤖 正在拉取新知识点...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 flex items-center justify-between py-3 px-4 rounded-2xl bg-red-50 border border-red-200">
              <span className="text-[13px] font-medium text-red-500">😢 {error}</span>
              <button type="button" onClick={handleRandomRefresh} className="text-[12px] font-bold text-red-500 hover:text-red-600 px-3 py-1 rounded-lg bg-red-100">🔄 重试</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ---- 背景故事 ---- */}
          {tab === "story" && (
            <motion.div
              key={`story-${storyData.title}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-[#FFFDF9] border border-[#F0E8F8] rounded-2xl overflow-hidden"
            >
              <button type="button" onClick={() => setExpandedStory(!expandedStory)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-[#FFF0EB] transition-colors">
                <span className="text-[14px] font-bold text-[#4D4D5E]">{storyData.title}</span>
                <span className="text-sm transition-transform duration-200" style={{ transform: expandedStory ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </button>
              <AnimatePresence>
                {expandedStory && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-4 pb-4 text-[14px] leading-[1.8] text-[#6B6B7B]">{storyData.content}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ---- 生字小游戏 ---- */}
          {tab === "game" && (
            <motion.div
              key={`game-${gameData.char}`}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="text-[12px] text-[#B0A0C0] mb-4 font-medium">🎯 翻牌识生字：点击生字卡查看拼音和释义</p>

              {/* 生字卡片 — 只显示大字，不塞任何解释文字 */}
              <div className="flex justify-center mb-4">
                <motion.button type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={() => toggleCard(0)}
                  className="w-28 h-28 rounded-2xl border-2 flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: flippedCards.has(0) ? accentColor : "#E8E0F0", background: flippedCards.has(0) ? `${accentColor}10` : "#FFFFFF" }}>
                  <span className="text-[48px] font-bold leading-none" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>{gameData.char}</span>
                </motion.button>
              </div>

              {/* 翻牌后 — 拼音/释义/组词/记忆方法全部在卡片下方展示 */}
              <AnimatePresence>
                {flippedCards.has(0) && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="space-y-3 bg-[#FFFDF9] border border-[#F0E8F8] rounded-2xl p-4">
                    {/* 拼音 + 释义 */}
                    <div className="text-center">
                      <p className="text-[18px] font-bold" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>{gameData.pinyin}</p>
                      <p className="text-[13px] text-[#6B6B7B] mt-1 leading-relaxed">{gameData.definition}</p>
                    </div>
                    {/* 组词 */}
                    {gameData.words && gameData.words.length > 0 && (
                      <div>
                        <p className="text-[10px] text-[#B0A0C0] mb-2 font-bold">📝 组词</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {gameData.words.map((w) => (
                            <span key={w} className="px-3 py-1.5 rounded-xl text-[12px] font-bold" style={{ background: `${accentColor}10`, color: accentColor }}>{w}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* 记忆方法 */}
                    {gameData.memoryTip && (
                      <p className="text-center text-[11px] text-[#8B8B9B] border-t border-[#F0E8F8] pt-2">💡 {gameData.memoryTip}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ---- 成语积累 ---- */}
          {tab === "idiom" && (
            <motion.div
              key={`idiom-${idiomData.idiom}`}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-[#FFFDF9] border border-[#F0E8F8] rounded-2xl p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">📖</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[16px] font-bold" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>{idiomData.idiom}</span>
                    <span className="text-[11px] text-[#B0A0C0]">{idiomData.pinyin}</span>
                  </div>
                  <p className="text-[14px] text-[#6B6B7B] leading-relaxed mb-2">📝 {idiomData.meaning}</p>
                  {idiomData.source && <p className="text-[11px] text-[#8B8B9B] mb-1">📚 出处：{idiomData.source}</p>}
                  {idiomData.example && <p className="text-[11px] text-[#8B8B9B] italic">💬 {idiomData.example}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 底部再随机 ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 text-center">
          <button type="button" onClick={handleRandomRefresh} disabled={loading}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#B0A0C0] hover:text-[#6B6B7B] font-medium transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Dice5 className="w-3.5 h-3.5" />}
            {loading ? "正在加载..." : "再随机一个 🎲"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
