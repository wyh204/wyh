"use client";
import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import { useState } from "react";
import HistoryDrawer from "@/components/shared/HistoryDrawer";
import FavoriteDrawer from "@/components/shared/FavoriteDrawer";
import { useHistory } from "@/hooks/useHistory";
import type { HistoryItem } from "@/types";

export default function Navbar() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const { history, favorites, toggleFavorite, clearAll, removeFav } = useHistory();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          {/* Logo — 童趣版 */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #FF7B5C 0%, #FFB09C 100%)",
                boxShadow: "0 3px 12px rgba(255, 123, 92, 0.25)",
              }}
            >
              <span className="text-lg">📚</span>
            </div>
            <span
              className="text-[14px] font-bold tracking-[0.08em] text-[#3D3D4E] group-hover:text-[#FF7B5C] transition-colors duration-200"
              style={{ fontFamily: "var(--font-cartoon), 'ZCOOL KuaiLe', sans-serif" }}
            >
              GLUT AING
            </span>
          </Link>

          {/* 操作按钮 — 浅色版 */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] tracking-[0.06em] font-bold
                         text-[#8B8B9B] hover:text-[#FF7B5C] hover:bg-[#FFF0EB] transition-all duration-200"
            >
              <Clock className="w-3.5 h-3.5" />
              历史
            </button>
            <button
              type="button"
              onClick={() => setFavOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] tracking-[0.06em] font-bold
                         text-[#8B8B9B] hover:text-[#FF7B5C] hover:bg-[#FFF0EB] transition-all duration-200"
            >
              <Heart className="w-3.5 h-3.5" />
              收藏
            </button>
          </div>
        </div>
      </nav>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onToggleFavorite={(item: HistoryItem) => toggleFavorite(item)}
        onClearAll={clearAll}
        isFavorite={(id: string) => favorites.some((f) => f.id === id)}
      />
      <FavoriteDrawer
        open={favOpen}
        onClose={() => setFavOpen(false)}
        favorites={favorites}
        onRemove={removeFav}
      />
    </>
  );
}
