"use client";
import { useRef, useEffect } from "react";

interface Props {
  experimentId: string;
  color: string;
}

export default function ExperimentCanvas({ experimentId, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);
      time += 0.01;

      // background grid
      ctx!.strokeStyle = "rgba(255,255,255,0.03)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, h); ctx!.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(w, y); ctx!.stroke();
      }

      // glowing orb
      const cx = w / 2, cy = h / 2;
      const glowRadius = 60 + Math.sin(time * 2) * 10;
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
      glow.addColorStop(0, color + "40");
      glow.addColorStop(0.5, color + "10");
      glow.addColorStop(1, "transparent");
      ctx!.fillStyle = glow;
      ctx!.beginPath(); ctx!.arc(cx, cy, glowRadius, 0, Math.PI * 2); ctx!.fill();

      // title text
      ctx!.fillStyle = color;
      ctx!.font = "16px sans-serif";
      ctx!.textAlign = "center";
      ctx!.fillText(`交互实验区域 · ${experimentId}`, cx, cy - 8);

      ctx!.fillStyle = "rgba(255,255,255,0.3)";
      ctx!.font = "12px sans-serif";
      ctx!.fillText("拖拽或点击元件进行实验操作", cx, cy + 20);

      animId = requestAnimationFrame(draw);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [experimentId, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-72 md:h-96 rounded-xl glass-card"
      style={{ display: "block" }}
    />
  );
}
