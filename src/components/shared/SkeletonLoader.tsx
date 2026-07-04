"use client";
import { motion } from "framer-motion";

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-6 animate-pulse"
    >
      <div className="w-24 h-3 bg-[#F0E8F8] rounded-full mb-6" />
      <div className="space-y-3">
        <div className="w-full h-3 bg-[#F5F0FA] rounded-full" />
        <div className="w-4/5 h-3 bg-[#F5F0FA] rounded-full" />
        <div className="w-3/5 h-3 bg-[#F5F0FA] rounded-full" />
        <div className="w-full h-3 bg-[#F5F0FA] rounded-full mt-4" />
        <div className="w-2/3 h-3 bg-[#F5F0FA] rounded-full" />
      </div>
    </motion.div>
  );
}
