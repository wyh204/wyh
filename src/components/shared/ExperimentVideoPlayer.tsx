"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";

/* ================================================================
   全屏教学实验视频播放器 — 用B站公开教育视频
   ================================================================ */

const VIDEO_URLS: Record<string, string> = {
  refraction: "https://wuli.wkepu.com/3.html",
  "boiling-water": "https://wuli.wkepu.com/19.html",
  buoyancy: "https://wuli.wkepu.com/10.html",
  "convex-lens": "https://wuli.wkepu.com/4.html",
  "solution-prep": "https://chemcollective.org/vlab/vlab.php",
  oxygen: "https://chemcollective.org/vlab/vlab.php",
  "ph-test": "https://chemcollective.org/vlab/vlab.php",
  titration: "https://chemcollective.org/activities/type_page/1",
};

const FALLBACK: Record<string, { emoji: string; title: string }> = {
  refraction: { emoji: "🔦", title: "光的折射实验" },
  "boiling-water": { emoji: "🔥", title: "水的沸腾实验" },
  buoyancy: { emoji: "🧊", title: "阿基米德原理" },
  "convex-lens": { emoji: "🔍", title: "凸透镜成像" },
  "solution-prep": { emoji: "🧪", title: "配制一定溶质质量分数的溶液" },
  oxygen: { emoji: "💨", title: "制取氧气" },
  "ph-test": { emoji: "🎨", title: "用pH试纸测溶液酸碱性" },
  titration: { emoji: "🧪", title: "酸碱中和滴定" },
};

interface Props { experimentId: string; accentColor?: string; }

export default function ExperimentVideoPlayer({ experimentId, accentColor = "#B39DDB" }: Props) {
  const [loadFailed, setLoadFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const url = VIDEO_URLS[experimentId] || "";
  const isBilibili = url.includes("bilibili.com");
  const bvMatch = isBilibili ? url.match(/BV[a-zA-Z0-9]+/) : null;
  const embedUrl = bvMatch
    ? `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1&autoplay=0&danmaku=0`
    : url;
  const fallback = FALLBACK[experimentId];

  return (
    <div ref={containerRef} className="w-full rounded-2xl overflow-hidden border-2 border-[#E8E0F0] bg-black">
      {!loadFailed && embedUrl ? (
        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen"
            onError={() => setLoadFailed(true)}
            title={fallback?.title || "实验视频"}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <span className="text-6xl mb-4">{fallback?.emoji || "🎬"}</span>
          <p className="text-[18px] font-bold mb-2">{fallback?.title || "教学实验视频"}</p>
          <p className="text-[13px] text-white/60 mb-6">观看实验操作演示视频，理解科学原理</p>
          <div className="flex items-center gap-3">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-2xl text-[13px] font-bold text-white transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
              📺 在新窗口打开视频
            </a>
            {loadFailed && (
              <button onClick={() => setLoadFailed(false)}
                className="px-4 py-2.5 rounded-2xl text-[13px] font-bold border-2 border-white/20 text-white/80">
                🔄 重试加载
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
