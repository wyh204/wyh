"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import type { HistoryItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onToggleFavorite: (item: HistoryItem) => void;
  onClearAll: () => void;
  isFavorite: (id: string) => boolean;
}

export default function HistoryDrawer({ open, onClose, history, onClearAll }: Props) {
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
                  <button type="button" onClick={onClearAll} className="text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button type="button" onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
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
