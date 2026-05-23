"use client";
import Link from "next/link";
import { BookOpen } from "lucide-react";
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
          <Link href="/" className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#a78bfa]" />
            <span className="text-[14px] font-bold tracking-[0.08em] text-white">
              GLUT AING
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <button type="button" onClick={() => setHistoryOpen(true)}
              className="text-[10px] tracking-[0.12em] font-medium text-white/30 hover:text-white/60 transition-colors">
              历史
            </button>
            <button type="button" onClick={() => setFavOpen(true)}
              className="text-[10px] tracking-[0.12em] font-medium text-white/30 hover:text-white/60 transition-colors">
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
