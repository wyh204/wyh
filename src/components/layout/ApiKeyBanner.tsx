"use client";
import { AlertTriangle } from "lucide-react";

interface Props {
  show: boolean;
}

export default function ApiKeyBanner({ show }: Props) {
  if (!show) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-red-600/90 backdrop-blur px-4 py-2 text-center text-sm text-white flex items-center justify-center gap-2">
      <AlertTriangle className="w-4 h-4" />
      <span>API Key 未配置，请在 .env.local 中设置 DEEPSEEK_API_KEY</span>
    </div>
  );
}
