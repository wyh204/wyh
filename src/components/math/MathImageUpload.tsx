"use client";
import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, RotateCcw, Image, Loader2 } from "lucide-react";
import type { MathImageState, ImageUploadStatus } from "@/types";

interface Props {
  accentColor?: string;
  onImageSubmit: (base64: string, fileName: string) => void;
  disabled?: boolean;
}

export default function MathImageUpload({
  accentColor = "#5BA4E6",
  onImageSubmit,
  disabled = false,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageState, setImageState] = useState<MathImageState>({
    status: "idle",
    file: null,
    previewUrl: null,
    recognizedText: null,
  });

  // ═══ 选择图片 ═══
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证类型
    if (!file.type.startsWith("image/")) {
      setImageState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "请选择图片文件哦～",
      }));
      return;
    }

    // 验证大小 (最大10MB)
    if (file.size > 10 * 1024 * 1024) {
      setImageState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "图片太大啦，请选择小于10MB的图片～",
      }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageState({
      status: "selected",
      file,
      previewUrl,
      recognizedText: null,
    });
  }

  // ═══ 确认上传 ═══
  function handleConfirm() {
    if (!imageState.file) return;

    setImageState((prev) => ({ ...prev, status: "uploading" }));

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      onImageSubmit(base64, imageState.file!.name);

      // 保留预览，但标记为已识别
      setImageState((prev) => ({ ...prev, status: "recognized" }));
    };
    reader.onerror = () => {
      setImageState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "哎呀，图片读取失败了，再试一次吧～",
      }));
    };
    reader.readAsDataURL(imageState.file);
  }

  // ═══ 重新拍照 ═══
  function handleRetake() {
    if (imageState.previewUrl) {
      URL.revokeObjectURL(imageState.previewUrl);
    }
    setImageState({
      status: "idle",
      file: null,
      previewUrl: null,
      recognizedText: null,
    });
    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // ═══ 关闭预览 ═══
  function handleClose() {
    if (imageState.previewUrl) {
      URL.revokeObjectURL(imageState.previewUrl);
    }
    setImageState({
      status: "idle",
      file: null,
      previewUrl: null,
      recognizedText: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const isShowingPreview = imageState.status === "selected" || imageState.status === "uploading";

  return (
    <>
      {/* ─── 隐藏的图片选择器 ─── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ─── 拍照按钮 ─── */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || imageState.status === "uploading"}
        className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all duration-200"
        style={{
          borderColor: disabled ? "#E8E0F0" : `${accentColor}30`,
          background: disabled ? "#F5F0FA" : `${accentColor}10`,
          opacity: disabled ? 0.5 : 1,
        }}
        title="拍照搜题"
      >
        <Camera className="w-5 h-5" style={{ color: accentColor }} />
      </motion.button>

      {/* ─── 图片预览面板 ─── */}
      <AnimatePresence>
        {isShowingPreview && imageState.previewUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-3"
          >
            <div className="bg-white border-2 border-[#E8E0F0] rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                {/* 缩略图 */}
                <div className="relative shrink-0">
                  <img
                    src={imageState.previewUrl}
                    alt="题目预览"
                    className="w-24 h-24 object-cover rounded-xl border-2 border-[#F0E8F8]"
                  />
                  {imageState.status === "uploading" && (
                    <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: accentColor }} />
                    </div>
                  )}
                </div>

                {/* 操作区 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#4D4D5E] mb-2 flex items-center gap-1.5">
                    <Image className="w-4 h-4" style={{ color: accentColor }} />
                    {imageState.status === "uploading" ? "正在识别题目..." : "确认题目图片"}
                  </p>
                  <p className="text-[11px] text-[#B0A0C0] mb-3">
                    {imageState.file?.name}
                    {imageState.file && ` · ${(imageState.file.size / 1024).toFixed(1)} KB`}
                  </p>
                  <div className="flex items-center gap-2">
                    {imageState.status === "selected" && (
                      <>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleConfirm}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all"
                          style={{
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                            boxShadow: `0 3px 12px ${accentColor}30`,
                          }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          确认上传
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleRetake}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-[#6B6B7B] border-2 border-[#E8E0F0] bg-white transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          重新拍摄
                        </motion.button>
                      </>
                    )}
                    {imageState.status === "uploading" && (
                      <p className="text-[12px] font-medium text-[#B0A0C0] flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        AI 小助手正在识别中...
                      </p>
                    )}
                    {imageState.status === "recognized" && (
                      <p className="text-[12px] font-medium" style={{ color: accentColor }}>
                        ✅ 已提交识别
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleClose}
                      className="ml-auto w-6 h-6 rounded-full bg-[#F5F0FA] flex items-center justify-center text-[#B0A0C0] hover:text-[#6B6B7B] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 错误提示 ─── */}
      <AnimatePresence>
        {imageState.status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 bg-white border-2 border-red-200 rounded-2xl p-3 flex items-center justify-between"
          >
            <p className="text-[12px] text-red-500 font-medium">
              😢 {imageState.errorMessage || "哎呀，题目有点模糊，再拍一次试试吧～"}
            </p>
            <button
              type="button"
              onClick={handleRetake}
              className="text-[11px] font-bold text-red-500 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            >
              重试
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
