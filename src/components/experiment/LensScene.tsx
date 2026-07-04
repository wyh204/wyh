"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ================================================================
   凸透镜成像 — 完整物理逻辑版
   透镜公式: 1/f = 1/u + 1/v  →  v = uf/(u-f)
   当 u<f: v<0 (虚像, 正立放大, 同侧)
   当 u=f: 不成像
   当 f<u<2f: v>2f (实像, 倒立放大)
   当 u=2f: v=2f (实像, 倒立等大)
   当 u>2f: f<v<2f (实像, 倒立缩小)
   ================================================================ */

const FOCAL = 1.2;      // 3D世界中的焦距
const LENS_X = 0;        // 透镜在 X=0
const SCREEN_MAX_X = 3.2; // 光屏最远位置

interface ImageResult {
  type: "real" | "virtual" | "none";
  inverted: boolean;
  scale: number;
  posX: number;  // 像的X位置
  posY: number;  // 像的Y偏移(实像倒立在下,虚像正立在上)
  label: string;
  emoji: string;
}

function calcImage(objectX: number): ImageResult {
  const u = Math.abs(objectX - LENS_X); // 物距
  const eps = 0.03;

  // 焦距处 — 不成像
  if (Math.abs(u - FOCAL) < eps) {
    return { type: "none", inverted: false, scale: 0, posX: 0, posY: 0, label: "无法成像", emoji: "🚫" };
  }

  const v = (u * FOCAL) / (u - FOCAL); // 像距

  if (v > 0) {
    // 实像 — 在透镜右侧
    const imgX = Math.min(LENS_X + v * 0.7, SCREEN_MAX_X);
    const imgScale = Math.abs(v / u);
    if (u < FOCAL * 2 && u > FOCAL) return { type: "real", inverted: true, scale: imgScale, posX: imgX, posY: -0.3, label: "投影仪效果", emoji: "🎥" };
    if (Math.abs(u - FOCAL * 2) < eps * 3) return { type: "real", inverted: true, scale: 1, posX: imgX, posY: -0.3, label: "倒立等大", emoji: "📏" };
    return { type: "real", inverted: true, scale: imgScale, posX: imgX, posY: -0.3, label: "照相机效果", emoji: "📷" };
  } else {
    // 虚像 — 在透镜左侧(同侧), 正立放大
    const absV = Math.abs(v);
    const imgScale = Math.abs(absV / u);
    return { type: "virtual", inverted: false, scale: imgScale, posX: objectX - 0.4, posY: 0.5, label: "放大镜效果", emoji: "🔍" };
  }
}

/* ─── 3D场景 ─── */
function Scene({ objectX }: { objectX: number }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (flameRef.current) {
      const t = clock.getElapsedTime();
      flameRef.current.scale.setScalar(0.9 + Math.sin(t * 9) * 0.1 + Math.sin(t * 14) * 0.06);
    }
  });

  const image = calcImage(objectX);
  const u = Math.abs(objectX - LENS_X);

  return (
    <group>
      {/* 桌面 */}
      <mesh position={[0, -0.7, -0.3]}><boxGeometry args={[8, 0.1, 1.6]} /><meshStandardMaterial color="#D4C8B8" roughness={0.5} /></mesh>

      {/* 光学导轨 — 水平线 */}
      <mesh position={[0, -0.2, 0.01]}><boxGeometry args={[7, 0.015, 0.04]} /><meshBasicMaterial color="#BBBBBB" /></mesh>

      {/* 蜡烛 🕯️ */}
      <group position={[objectX, -0.15, 0]}>
        <mesh><cylinderGeometry args={[0.12, 0.16, 0.6, 16]} /><meshStandardMaterial color="#F5E6CA" roughness={0.4} /></mesh>
        <mesh ref={flameRef} position={[0, 0.4, 0]}><sphereGeometry args={[0.1, 12, 12]} /><meshBasicMaterial color="#FFAA00" /></mesh>
        <pointLight position={[0, 0.4, 0.4]} intensity={1.5} color="#FFAA44" distance={2.5} />
      </group>

      {/* 凸透镜 🔍 */}
      <Float speed={0.8} floatIntensity={0.04}>
        <group position={[LENS_X, 0.05, 0]}>
          <mesh><cylinderGeometry args={[0.55, 0.55, 0.06, 32]} /><meshPhysicalMaterial color="#CCCCFF" transparent opacity={0.45} roughness={0.1} /></mesh>
          <mesh position={[0, -0.65, 0]}><cylinderGeometry args={[0.02, 0.02, 0.9, 8]} /><meshStandardMaterial color="#888888" /></mesh>
        </group>
      </Float>

      {/* 光屏 (实像时显示) */}
      {image.type === "real" && (
        <group position={[image.posX, 0, 0]}>
          <mesh><boxGeometry args={[1.2, 1.6, 0.04]} /><meshStandardMaterial color="#FFFFFF" roughness={0.2} /></mesh>
          <mesh position={[0, 0.85, 0]}><boxGeometry args={[1.3, 0.04, 0.06]} /><meshStandardMaterial color="#666666" /></mesh>
          <mesh position={[0, -0.85, 0]}><boxGeometry args={[1.3, 0.04, 0.06]} /><meshStandardMaterial color="#666666" /></mesh>
          {/* 光屏上的像 — 倒立 */}
          <mesh position={[0.03, image.posY, 0]}>
            <circleGeometry args={[0.1 * image.scale, 16]} />
            <meshBasicMaterial color="#FFFF88" />
          </mesh>
        </group>
      )}

      {/* 虚像 (在透镜左侧, 正立) */}
      {image.type === "virtual" && (
        <Float speed={0.5} floatIntensity={0.06}>
          <group position={[image.posX, image.posY, 0.05]}>
            <mesh>
              <circleGeometry args={[0.1 * image.scale, 16]} />
              <meshBasicMaterial color="#FFDD88" transparent opacity={0.6} />
            </mesh>
          </group>
        </Float>
      )}

      {/* 焦距标记 F 和 2F */}
      {[FOCAL, FOCAL * 2].map((dist, i) => (
        <group key={i}>
          <mesh position={[LENS_X + dist, -0.5, 0.05]}><boxGeometry args={[0.02, 0.2, 0.02]} /><meshBasicMaterial color="#FF8888" /></mesh>
          <mesh position={[LENS_X - dist, -0.5, 0.05]}><boxGeometry args={[0.02, 0.2, 0.02]} /><meshBasicMaterial color="#FF8888" /></mesh>
        </group>
      ))}

      {/* 光线示意 (透镜上方) */}
      {image.type !== "none" && (
        <>
          <mesh position={[(objectX + LENS_X) / 2, 0.6, 0]} rotation={[0, 0, objectX < LENS_X ? Math.PI * 0.15 : 0]}>
            <boxGeometry args={[Math.abs(objectX - LENS_X), 0.015, 0.015]} /><meshBasicMaterial color="#FFCC44" transparent opacity={0.3} />
          </mesh>
          {image.type === "real" && (
            <mesh position={[(LENS_X + image.posX) / 2, 0.5, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
              <boxGeometry args={[Math.abs(image.posX - LENS_X), 0.015, 0.015]} /><meshBasicMaterial color="#FF8844" transparent opacity={0.3} />
            </mesh>
          )}
        </>
      )}

      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.6} />
    </group>
  );
}

/* ─── 距离预设 ─── */
const PRESETS = [
  { label: "很近", value: -1.2, desc: "u<f 放大镜" },
  { label: "焦距处", value: -1.17, desc: "u=f 不成像" },
  { label: "1.5f", value: -1.8, desc: "f<u<2f 投影仪" },
  { label: "2f处", value: -2.37, desc: "u=2f 等大" },
  { label: "远处", value: -3.2, desc: "u>2f 照相机" },
];

export default function LensScene() {
  const [objectX, setObjectX] = useState(-1.8); // 默认 1.5f
  const image = calcImage(objectX);
  const u = Math.abs(objectX - LENS_X);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0.3, 5.5], fov: 42 }} dpr={[1, 2]}>
        <Scene objectX={objectX} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.55} />
      </Canvas>

      {/* 物距按钮 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 flex-wrap justify-center">
        {PRESETS.map((opt) => (
          <button key={opt.label} type="button" onClick={() => setObjectX(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${
              Math.abs(objectX - opt.value) < 0.05
                ? "bg-purple-400 text-white shadow-md scale-105"
                : "bg-white text-[#6B6B7B] border border-[#E8E0F0] hover:border-purple-300 hover:scale-105"
            }`}>{opt.label}</button>
        ))}
      </div>

      {/* 状态标注 */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
        <span className="text-[10px] font-bold text-[#8888AA] bg-white/75 rounded-lg px-2 py-0.5">🕯️ 蜡烛 · 🔍 透镜 · 📺 光屏</span>
        <span className="text-[10px] font-bold text-[#4488CC] bg-white/75 rounded-lg px-2 py-0.5">物距 u = {u.toFixed(1)}  ·  焦距 f = {FOCAL.toFixed(1)}</span>
      </div>

      <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1 items-end">
        <span className={`text-[11px] font-bold rounded-xl px-3 py-1.5 ${
          image.type === "real" ? "bg-orange-100 text-orange-700" :
          image.type === "virtual" ? "bg-green-100 text-green-700" :
          "bg-gray-100 text-gray-500"}`}>
          {image.emoji} {image.label}
        </span>
        {image.type !== "none" && (
          <span className="text-[10px] font-bold bg-white/75 rounded-lg px-2 py-0.5 text-[#8888AA]">
            {image.inverted ? "↓ 倒立" : "↑ 正立"} · 放大 {image.scale.toFixed(1)}×
          </span>
        )}
      </div>
    </div>
  );
}
