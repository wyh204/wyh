"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { BookOpen } from "lucide-react";
import SubjectCard from "@/components/shared/SubjectCard";
import type { Subject } from "@/types";

const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), { ssr: false });

const subjects: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      <ThreeBackground />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <BookOpen className="w-10 h-10 text-physics" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-physics via-english to-chemistry bg-clip-text text-transparent">
            GLUT Aing Education
          </h1>
        </div>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          AI 赋能教育 · 让学习更智慧
        </p>
        <p className="text-text-secondary/50 text-sm mt-2">
          选择你想学习的科目，开启 AI 辅助学习之旅
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-5xl w-full"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {subjects.map((subject) => (
          <motion.div
            key={subject}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          >
            <SubjectCard subject={subject} />
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-xs text-text-secondary/50"
      >
        Powered by DeepSeek AI · 桂林理工大学 三下乡
      </motion.p>
    </div>
  );
}
