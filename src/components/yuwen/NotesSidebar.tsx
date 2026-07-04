"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Edit3, Bookmark } from "lucide-react";
import type { StudyNote } from "@/types";

const STORAGE_KEY = "yuwen_study_notes";
const COLORS = ["#FF7B5C", "#5BA4E6", "#6DBE6D", "#B39DDB", "#FFCC4D"];

interface Props {
  open: boolean;
  onClose: () => void;
  accentColor?: string;
  currentText?: string; // 当前正在学习的课文名
}

export function loadNotes(): StudyNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: StudyNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function NotesSidebar({ open, onClose, accentColor = "#FF7B5C", currentText }: Props) {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    setNotes(loadNotes());
  }, [open]);

  function handleAdd() {
    if (!newNote.trim()) return;
    const note: StudyNote = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      content: newNote.trim(),
      timestamp: Date.now(),
      relatedText: currentText,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setNewNote("");
  }

  function handleDelete(id: string) {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  }

  function handleStartEdit(note: StudyNote) {
    setEditingId(note.id);
    setEditContent(note.content);
  }

  function handleSaveEdit() {
    if (!editingId || !editContent.trim()) return;
    const updated = notes.map((n) =>
      n.id === editingId ? { ...n, content: editContent.trim() } : n
    );
    setNotes(updated);
    saveNotes(updated);
    setEditingId(null);
    setEditContent("");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3D3D4E]/20 z-[60]"
            onClick={onClose}
          />

          {/* 侧边栏 */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 drawer-glass z-[70] flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-5 border-b-2 border-[#F0E8F8]">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" style={{ color: accentColor }} />
                <h3 className="text-[14px] font-bold text-[#3D3D4E]" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>
                  ✏️ 学习笔记
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-[#F5F0FA] flex items-center justify-center text-[#B0A0C0] hover:text-[#6B6B7B] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 输入区 */}
            <div className="p-4 border-b border-[#F5F0FA]">
              {currentText && (
                <p className="text-[11px] text-[#B0A0C0] mb-2 font-medium">📖 当前学习: {currentText}</p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="写下你的学习心得..."
                  className="flex-1 bg-white border-2 border-[#E8E0F0] rounded-xl px-3 py-2 text-[13px] text-[#3D3D4E] placeholder-[#B0A0C0] focus:outline-none focus:border-[#FFB09C] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newNote.trim()}
                  className="px-3 py-2 rounded-xl text-white text-[12px] font-bold transition-all duration-200 disabled:opacity-30 hover:scale-105 active:scale-95"
                  style={{ background: accentColor }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 笔记列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              {notes.length === 0 ? (
                <div className="text-center mt-16">
                  <span className="text-4xl">📝</span>
                  <p className="text-[13px] text-[#CCC0D8] mt-3">还没有笔记哦～</p>
                  <p className="text-[11px] text-[#CCC0D8] mt-1">记录你的学习心得吧！</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-[#E8E0F0] rounded-2xl p-4 group"
                      style={{ borderLeftColor: note.color, borderLeftWidth: "4px" }}
                    >
                      {editingId === note.id ? (
                        <div>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-[#FFFDF9] border border-[#E8E0F0] rounded-xl px-3 py-2 text-[13px] text-[#3D3D4E] resize-none focus:outline-none focus:border-[#FFB09C]"
                            rows={3}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="text-[11px] font-bold text-white px-3 py-1 rounded-lg"
                              style={{ background: accentColor }}
                            >
                              保存
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-[11px] font-bold text-[#B0A0C0] px-3 py-1 rounded-lg bg-[#F5F0FA]"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[13px] text-[#4D4D5E] leading-relaxed">{note.content}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[10px] text-[#B0A0C0]">
                              {new Date(note.timestamp).toLocaleString("zh-CN", {
                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                              })}
                              {note.relatedText && ` · ${note.relatedText}`}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(note)}
                                className="w-6 h-6 rounded-full bg-[#F5F0FA] flex items-center justify-center text-[#B0A0C0] hover:text-[#6B6B7B] transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(note.id)}
                                className="w-6 h-6 rounded-full bg-[#F5F0FA] flex items-center justify-center text-[#B0A0C0] hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className="p-3 border-t border-[#F5F0FA] text-center">
              <p className="text-[10px] text-[#CCC0D8]">
                📌 笔记保存在本地浏览器中
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
