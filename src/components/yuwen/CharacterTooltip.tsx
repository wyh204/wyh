"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CharacterInfo } from "@/types";

/* ===================================================
   演示用生字数据（实际可从 AI 响应中解析）
   =================================================== */
const DEMO_CHARACTERS: Record<string, CharacterInfo> = {
  "焉": { char: "焉", pinyin: "yān", definition: "文言文中常见的兼词，相当于'于之'；也可作疑问代词'哪里''怎么'", words: ["焉能", "心不在焉", "焉知", "不入虎穴焉得虎子"], strokeCount: 11, radical: "灬" },
  "乎": { char: "乎", pinyin: "hū", definition: "文言语气词，可表疑问（吗/呢）、感叹（啊）或介词（相当于'于'）", words: ["不亦乐乎", "在乎", "出乎意料", "神乎其神"], strokeCount: 5, radical: "丿" },
  "愠": { char: "愠", pinyin: "yùn", definition: "生气、恼怒。出自《论语》'人不知而不愠，不亦君子乎'", words: ["愠怒", "愠色", "面有愠色", "不愠不火"], strokeCount: 12, radical: "忄" },
  "罔": { char: "罔", pinyin: "wǎng", definition: "迷惑、无、没有。出自《论语》'学而不思则罔，思而不学则殆'", words: ["罔然", "置若罔闻", "迷罔", "欺罔"], strokeCount: 8, radical: "罒" },
  "谪": { char: "谪", pinyin: "zhé", definition: "古代官员被降职或流放。常见于《岳阳楼记》'滕子京谪守巴陵郡'", words: ["贬谪", "谪居", "谪迁", "谪戍"], strokeCount: 14, radical: "讠" },
};

interface Props {
  text: string;
  accentColor?: string;
}

export default function CharacterTooltip({ text, accentColor = "#FF7B5C" }: Props) {
  const [activeChar, setActiveChar] = useState<string | null>(null);

  // 找出文本中匹配的生字
  const knownChars = Object.keys(DEMO_CHARACTERS);

  function renderTextWithHighlight(text: string) {
    const segments: { char: string; hasInfo: boolean }[] = [];
    for (const ch of text) {
      segments.push({ char: ch, hasInfo: knownChars.includes(ch) });
    }
    return segments.map((seg, i) =>
      seg.hasInfo ? (
        <span
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            setActiveChar(activeChar === seg.char ? null : seg.char);
          }}
          className="relative inline cursor-pointer select-none transition-all duration-200 rounded px-0.5"
          style={{
            backgroundColor: activeChar === seg.char ? `${accentColor}25` : "transparent",
            borderBottom: `2px dashed ${accentColor}60`,
            color: accentColor,
            fontWeight: "bold",
          }}
        >
          {seg.char}
          <AnimatePresence>
            {activeChar === seg.char && DEMO_CHARACTERS[seg.char] && (
              <CharPopover charInfo={DEMO_CHARACTERS[seg.char]} accentColor={accentColor} onClose={() => setActiveChar(null)} />
            )}
          </AnimatePresence>
        </span>
      ) : (
        <span key={i}>{seg.char}</span>
      )
    );
  }

  return (
    <div className="text-[15px] leading-[2] text-[#4D4D5E]">
      <p className="text-[11px] text-[#B0A0C0] mb-2 font-medium">
        💡 点击带<span className="font-bold" style={{ color: accentColor, borderBottom: `2px dashed ${accentColor}60` }}>虚线</span>的字词查看详情
      </p>
      {renderTextWithHighlight(text)}
    </div>
  );
}

/* ===================================================
   生字弹窗
   =================================================== */
function CharPopover({
  charInfo,
  accentColor,
  onClose,
}: {
  charInfo: CharacterInfo;
  accentColor: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-5 shadow-xl min-w-[200px] max-w-[260px]"
        style={{ borderColor: `${accentColor}40` }}
      >
        {/* 大字展示 */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[56px] leading-none font-bold" style={{ color: accentColor, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
            {charInfo.char}
          </span>
          <div>
            <p className="text-[18px] font-bold text-[#3D3D4E]">{charInfo.pinyin}</p>
            <p className="text-[11px] text-[#B0A0C0]">
              部首: {charInfo.radical} · {charInfo.strokeCount} 画
            </p>
          </div>
        </div>

        {/* 释义 */}
        <p className="text-[13px] text-[#6B6B7B] mb-3 leading-relaxed">
          📖 {charInfo.definition}
        </p>

        {/* 组词 */}
        <div>
          <p className="text-[11px] text-[#B0A0C0] mb-1.5 font-bold">📝 组词</p>
          <div className="flex flex-wrap gap-1.5">
            {charInfo.words.map((w) => (
              <span
                key={w}
                className="px-2.5 py-1 bg-[#FFF0EB] rounded-xl text-[12px] font-bold"
                style={{ color: accentColor }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F5F0FA] flex items-center justify-center text-[#B0A0C0] hover:text-[#6B6B7B] transition-colors text-xs"
        >
          ✕
        </button>
      </div>

      {/* 小三角 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 w-3 h-3 bg-white border-r-2 border-b-2 border-[#E8E0F0] rotate-45" />
    </motion.div>
  );
}
