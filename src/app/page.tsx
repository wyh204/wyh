"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SubjectCard from "@/components/shared/SubjectCard";
import SpotlightCursor from "@/components/three/SpotlightCursor";
import type { Subject } from "@/types";

const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), { ssr: false });

const subjects: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

const heroChars = [
  { char: "探", color: "#a78bfa" },
  { char: "索", color: "#a78bfa" },
  { char: " · ", color: "transparent" },
  { char: "知", color: "#60a5fa" },
  { char: "识", color: "#60a5fa" },
  { char: " · ", color: "transparent" },
  { char: "宇", color: "#34d399" },
  { char: "宙", color: "#34d399" },
];

function HeroTitle() {
  return (
    <div className="mb-4">
      <motion.div
        className="flex flex-wrap items-baseline gap-x-1"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
        }}
      >
        {heroChars.map((item, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[56px] md:text-[72px] font-[900] tracking-[0.04em] leading-[1.1] text-white"
            style={{
              borderBottom: item.color !== "transparent" ? "4px solid" : "none",
              borderColor: item.color !== "transparent" ? item.color : undefined,
              paddingBottom: item.color !== "transparent" ? "4px" : "0",
            }}
          >
            {item.char}
          </motion.span>
        ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-[20px] md:text-[24px] font-[300] italic tracking-[-0.02em] text-white mt-2"
      >
        Universe
      </motion.p>
    </div>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <ThreeBackground />

      <div id="hero-area" className="relative">
        <SpotlightCursor color="#a78bfa" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-12 md:pt-28 md:pb-20">
          <HeroTitle />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="text-[13px] md:text-[14px] text-white/30 tracking-[0.04em] leading-relaxed max-w-[440px] mb-16"
          >
            AI 驱动的互动学习体验，覆盖语文、数学、英语、物理、化学五大学科。让每一位中小学生感受知识的魅力。
          </motion.p>
        </div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-6 md:px-12 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {subjects.map((subject) => (
          <motion.div
            key={subject}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SubjectCard subject={subject} />
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1.5 }}
        className="text-center text-[10px] tracking-[0.15em] text-white pb-12"
      >
        POWERED BY DEEPSEEK AI · GLUT 三下乡
      </motion.p>
    </div>
  );
}
