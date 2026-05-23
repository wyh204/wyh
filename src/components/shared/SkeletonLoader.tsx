"use client";
import { motion } from "framer-motion";

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content-card p-6 animate-pulse"
    >
      <div className="w-24 h-3 bg-white/[0.04] rounded-sm mb-6" />
      <div className="space-y-3">
        <div className="w-full h-3 bg-white/[0.03] rounded-sm" />
        <div className="w-4/5 h-3 bg-white/[0.03] rounded-sm" />
        <div className="w-3/5 h-3 bg-white/[0.03] rounded-sm" />
        <div className="w-full h-3 bg-white/[0.03] rounded-sm mt-4" />
        <div className="w-2/3 h-3 bg-white/[0.03] rounded-sm" />
      </div>
    </motion.div>
  );
}
