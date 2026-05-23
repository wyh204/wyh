import type { HistoryItem, FavoriteItem } from "@/types";

const HISTORY_KEY = "glut-history";
const FAVORITES_KEY = "glut-favorites";
const MAX_HISTORY = 50;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: HistoryItem): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  history.unshift(item);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(item: FavoriteItem): void {
  if (typeof window === "undefined") return;
  const favs = getFavorites();
  if (favs.find((f) => f.id === item.id)) return;
  favs.unshift(item);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function removeFavorite(id: string): void {
  if (typeof window === "undefined") return;
  const favs = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}
