"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Play, Pause } from "lucide-react";

interface Props {
  text: string;
  accentColor?: string;
}

export default function ReadingButton({ text, accentColor = "#FF7B5C" }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function handleToggle() {
    if (isPlaying) {
      setIsPlaying(false);
      setShowHint(false);
    } else {
      setIsPlaying(true);
      setShowHint(true);
      // 模拟朗读：3秒后自动停止
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-bold tracking-[0.05em]
                   bg-white border-2 text-[#4D4D5E] transition-all duration-200 shadow-sm"
        style={{
          borderColor: isPlaying ? accentColor : "#E8E0F0",
          color: isPlaying ? accentColor : "#4D4D5E",
        }}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            <span>暂停朗读 ⏸️</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>🔊 朗读课文</span>
          </>
        )}
      </motion.button>

      {/* 占位提示 */}
      <AnimatePresence>
        {showHint && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-[#B0A0C0] bg-[#FFFDF9] px-3 py-1.5 rounded-xl border border-[#F0E8F8] whitespace-nowrap"
          >
            🎵 音频播放功能即将上线～
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
