"use client";
import { useEffect, useRef } from "react";

/* ===================================================
   小星星粒子动画 — Canvas 实现
   鼠标移动时星星跟随，点击产生爆发效果
   =================================================== */
interface StarParticle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; life: number; maxLife: number;
  color: string;
}

const COLORS = ["#FF7B5C", "#5BA4E6", "#6DBE6D", "#B39DDB", "#FFCC4D", "#FFB09C", "#FFE8A0"];
const MAX_PARTICLES = 40;

export default function ParticleStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<StarParticle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = (x: number, y: number, fromClick = false) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = fromClick ? 2 + Math.random() * 4 : 0.5 + Math.random() * 1.5;
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (fromClick ? 0 : 0.5),
        size: fromClick ? 3 + Math.random() * 5 : 2 + Math.random() * 3,
        opacity: 0.8 + Math.random() * 0.2,
        life: 0,
        maxLife: 40 + Math.random() * 60,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (Math.random() < 0.4) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
        if (particlesRef.current.length > MAX_PARTICLES) particlesRef.current.shift();
      }
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY, true));
      }
      if (particlesRef.current.length > MAX_PARTICLES + 20) {
        particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // 微重力
        p.opacity *= 0.99;

        ctx.save();
        ctx.globalAlpha = p.opacity * (1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        // 五角星形状
        drawStar(ctx, p.x, p.y, p.size);
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(animate);
    };

    function drawStar(c: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = i * (Math.PI * 2) / 5 - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
        const innerAngle = angle + Math.PI / 5;
        c.lineTo(cx + Math.cos(innerAngle) * r * 0.4, cy + Math.sin(innerAngle) * r * 0.4);
      }
      c.closePath();
    }

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />;
}
