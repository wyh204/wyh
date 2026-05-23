"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, ChevronLeft } from "lucide-react";

const subjectNames: Record<string, string> = {
  yuwen: "语文",
  math: "数学",
  english: "英语",
  physics: "物理",
  chemistry: "化学",
};

export default function Navbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const subject = segments[0];
  const isHome = !subject;
  const subjectName = subjectNames[subject] || subject;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {isHome ? (
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-physics" />
            <span className="text-lg font-bold">GLUT Aing Education</span>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-text-secondary" />
            </Link>
            <span className="text-text-secondary">/</span>
            <span className="text-text-primary font-medium">{subjectName}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="px-2 py-1 rounded-full glass-card">AI 赋能教育</span>
        </div>
      </div>
    </nav>
  );
}
