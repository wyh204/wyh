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
