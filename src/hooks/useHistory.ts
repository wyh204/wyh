"use client";
import { useCallback, useState } from "react";
import type { HistoryItem, FavoriteItem, Subject } from "@/types";
import { generateId } from "@/lib/utils";
import {
  getHistory,
  addHistory,
  clearHistory,
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/lib/storage";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const refresh = useCallback(() => {
    setHistory(getHistory());
    setFavorites(getFavorites());
  }, []);

  const save = useCallback(
    (subject: Subject, input: string, output: unknown, mode?: string) => {
      const item: HistoryItem = {
        id: generateId(),
        subject,
        mode,
        input,
        output,
        timestamp: Date.now(),
      };
      addHistory(item);
      refresh();
      return item;
    },
    [refresh],
  );

  const toggleFavorite = useCallback(
    (item: HistoryItem) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id);
      } else {
        addFavorite(item);
      }
      refresh();
    },
    [refresh],
  );

  const clearAll = useCallback(() => {
    clearHistory();
    refresh();
  }, [refresh]);

  const removeFav = useCallback((id: string) => {
    removeFavorite(id);
    refresh();
  }, [refresh]);

  return { history, favorites, save, toggleFavorite, clearAll, removeFav, refresh, isFavorite };
}
