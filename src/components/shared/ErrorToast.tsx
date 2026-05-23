"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export default function ErrorToast({ message, code, onRetry, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const brandMessage = code === "NO_API_KEY"
    ? "API Key 未配置，请在 .env.local 中设置 DEEPSEEK_API_KEY"
    : code === "TIMEOUT"
    ? "AI 响应超时，请稍后重试"
    : message;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mt-6 content-card p-5 flex items-start gap-4"
        style={{ borderColor: "rgba(248,113,113,0.2)" }}
      >
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-red-300/80 leading-relaxed flex-1">{brandMessage}</p>
        <div className="flex items-center gap-3 flex-shrink-0">
          {onRetry && (
            <button type="button" onClick={onRetry} className="text-[10px] tracking-[0.08em] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> 重试
            </button>
          )}
          <button type="button" onClick={onDismiss} className="text-white/20 hover:text-white/40 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
