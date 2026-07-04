"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import type { FavoriteItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onRemove: (id: string) => void;
}

export default function FavoriteDrawer({ open, onClose, favorites, onRemove }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3D3D4E]/25 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-80 drawer-glass z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b-2 border-[#F0E8F8]">
              <h3 className="text-[13px] tracking-[0.1em] font-bold text-[#6B6B7B]">❤️ 我的收藏</h3>
              <button type="button" onClick={onClose} aria-label="关闭"
                className="text-[#B0A0C0] hover:text-[#6B6B7B] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length === 0 ? (
                <p className="text-[13px] text-[#CCC0D8] text-center mt-20">暂无收藏</p>
              ) : (
                <div className="space-y-2">
                  {favorites.map((item) => (
                    <div key={item.id} className="content-card p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] tracking-[0.08em] text-[#B0A0C0] mb-1.5">{formatDate(item.timestamp)}</div>
                        <p className="text-[13px] text-[#6B6B7B] truncate font-medium">{item.input}</p>
                      </div>
                      <button type="button" onClick={() => onRemove(item.id)} aria-label="移除收藏"
                        className="text-[#B0A0C0] hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
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
