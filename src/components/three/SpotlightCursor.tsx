"use client";
import { useState, useEffect, useCallback } from "react";

interface Props {
  color?: string;
  size?: number;
}

export default function SpotlightCursor({ color = "#a78bfa", size = 300 }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => setVisible(false), []);
  const handleMouseEnter = useCallback(() => setVisible(true), []);

  useEffect(() => {
    const hero = document.getElementById("hero-area");
    if (!hero) return;
    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);
    hero.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
      hero.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  return (
    <div
      className="fixed pointer-events-none z-0 transition-opacity duration-500"
      style={{
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}0F 0%, ${color}03 40%, transparent 70%)`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
