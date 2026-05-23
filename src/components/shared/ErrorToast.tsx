"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export default function ErrorToast({ message, code, onRetry, onDismiss }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 max-w-sm glass-card border-red-500/30 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-red-400">{message}</p>
              {code && <p className="text-xs text-text-secondary mt-1">错误代码: {code}</p>}
            </div>
            <button onClick={onDismiss} className="text-text-secondary hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              重试
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
