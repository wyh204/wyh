"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Heart, BookOpen, Sparkles, TrendingUp, Zap } from "lucide-react";
import { getHistory, getFavorites } from "@/lib/storage";
import { subjectMeta } from "@/components/shared/SubjectCard";
import type { Subject, HistoryItem } from "@/types";

const SUBJECTS: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

/* ============ 统计卡片 ============ */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
  delay: number;
}) {
  return (
    <motion.div
      className="glass-panel p-5 flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -3 }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: bgColor }}
      >
        <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[#B0A0C0] font-bold tracking-[0.06em] mb-0.5">{label}</p>
        <p
          className="text-[26px] font-extrabold tracking-[-0.02em]"
          style={{ color, fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ============ 学科分布柱状图 ============ */
function SubjectBarChart({ history }: { history: HistoryItem[] }) {
  const counts = SUBJECTS.map((s) => ({
    subject: s,
    count: history.filter((h) => h.subject === s).length,
  }));
  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.45 }}
    >
      <h3
        className="text-[14px] font-bold text-[#3D3D4E] mb-5 flex items-center gap-2"
        style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
      >
        <TrendingUp className="w-4 h-4 text-[#FF7B5C]" strokeWidth={2.5} />
        学科使用分布
      </h3>
      <div className="space-y-3">
        {counts.map(({ subject, count }, i) => {
          const meta = subjectMeta[subject];
          const pct = (count / maxCount) * 100;
          return (
            <div key={subject} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center shrink-0">{meta.emoji}</span>
              <span
                className="text-[12px] font-bold w-10 shrink-0"
                style={{ color: meta.color }}
              >
                {meta.name.slice(0, 2)}
              </span>
              <div className="flex-1 h-5 bg-[#F5F0FA] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${meta.color}, ${meta.colorLight})`,
                    width: `${pct}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                />
              </div>
              <span className="text-[12px] font-bold text-[#6B6B7B] w-9 text-right shrink-0">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ============ 最近动态时间线 ============ */
function RecentTimeline({ history }: { history: HistoryItem[] }) {
  const recent = history.slice(0, 8);

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.45 }}
    >
      <h3
        className="text-[14px] font-bold text-[#3D3D4E] mb-4 flex items-center gap-2"
        style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
      >
        <Zap className="w-4 h-4 text-[#FFCC4D]" strokeWidth={2.5} />
        最近动态
      </h3>
      {recent.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-3xl">📭</span>
          <p className="text-[13px] text-[#B0A0C0] mt-2 font-medium">暂无学习记录</p>
          <p className="text-[11px] text-[#CCC0D8] mt-0.5">去前台体验一下各学科功能吧 ~</p>
        </div>
      ) : (
        <div className="space-y-0">
          {recent.map((item, i) => {
            const meta = subjectMeta[item.subject];
            const time = new Date(item.timestamp);
            const timeStr = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
            return (
              <motion.div
                key={item.id}
                className="flex items-start gap-3 py-3 border-b border-[#F0E8F8] last:border-b-0"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-lg"
                  style={{ background: meta.colorBg }}
                >
                  {meta.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: meta.color, background: meta.colorBg }}
                    >
                      {meta.name}
                    </span>
                    {item.mode && (
                      <span className="text-[10px] text-[#B0A0C0] font-medium">{item.mode}</span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#6B6B7B] mt-1 truncate max-w-[300px] font-medium">
                    {typeof item.input === "string" ? item.input.slice(0, 60) : JSON.stringify(item.input).slice(0, 60)}
                  </p>
                </div>
                <span className="text-[10px] text-[#B0A0C0] shrink-0 mt-1 font-medium">{timeStr}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ============ 主页面 ============ */
export default function AdminDashboard() {
  const [stats, setStats] = useState({ history: 0, favorites: 0, subjects: 0, todayActivity: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const h = getHistory();
    const f = getFavorites();
    const activeSubjects = new Set(h.map((item) => item.subject)).size;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = h.filter((item) => item.timestamp >= today.getTime()).length;
    setHistory(h);
    setStats({
      history: h.length,
      favorites: f.length,
      subjects: activeSubjects,
      todayActivity: todayCount,
    });
  }, []);

  const statCards = [
    { icon: BookOpen, label: "总学习次数", value: stats.history, color: "#FF7B5C", bgColor: "#FFF0EB" },
    { icon: Heart, label: "收藏总数", value: stats.favorites, color: "#6DBE6D", bgColor: "#EDF8ED" },
    { icon: Sparkles, label: "活跃学科", value: `${stats.subjects}/5`, color: "#B39DDB", bgColor: "#F5F0FA" },
    { icon: Clock, label: "今日动态", value: stats.todayActivity, color: "#5BA4E6", bgColor: "#EBF4FF" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* 标题区 */}
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
          📊 数据看板
        </h1>
        <p className="text-[13px] text-[#8B8B9B] mt-1 font-medium">
          学习数据一览 · 掌握平台动态
        </p>
      </motion.div>

      {/* 统计卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={0.1 + i * 0.08} />
        ))}
      </div>

      {/* 图表 + 时间线 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <SubjectBarChart history={history} />
        </div>
        <div className="lg:col-span-3">
          <RecentTimeline history={history} />
        </div>
      </div>
    </div>
  );
}
