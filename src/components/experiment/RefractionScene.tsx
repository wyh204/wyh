"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ================================================================
   光的折射 — 斯涅尔定律 interactive版
   n₁·sinθ₁ = n₂·sinθ₂    (空气 n₁=1.0, 水 n₂=1.33)
   光线从空气→水: 折射角小于入射角, 向法线偏折
   ================================================================ */

const N_AIR = 1.0;
const N_WATER = 1.33;
const WATER_Y = 0; // 水面Y坐标

function calcRefraction(incidentDeg: number): { incidentRad: number; refractRad: number; refracted: boolean } {
  const incidentRad = (incidentDeg * Math.PI) / 180;
  const sinRefract = (N_AIR * Math.sin(incidentRad)) / N_WATER;
  if (sinRefract > 1) {
    // 全反射
    return { incidentRad, refractRad: incidentRad, refracted: false };
  }
  return { incidentRad, refractRad: Math.asin(sinRefract), refracted: true };
}

/* ─── 3D场景 ─── */
function Scene({ incidentDeg }: { incidentDeg: number }) {
  const beamRef = useRef<THREE.Group>(null);
  const { incidentRad, refractRad, refracted } = calcRefraction(incidentDeg);

  // 入射光起点(左上) → 入射点(水面交点)
  const ix = 0.3; // 入射点X
  const iy = WATER_Y;
  const laserLen = 2.2;
  const startX = ix - Math.sin(incidentRad) * laserLen;
  const startY = iy + Math.cos(incidentRad) * laserLen;

  // 折射光: 从入射点向下(水中)
  const refractLen = 1.8;
  const rx = ix + Math.sin(refractRad) * refractLen;
  const ry = iy - Math.cos(refractRad) * refractLen;

  // 反射光(微弱)
  const reflectX = ix - Math.sin(incidentRad) * 0.6;
  const reflectY = iy + Math.cos(incidentRad) * 0.6;

  return (
    <group>
      {/* 空气层 */}
      <mesh position={[0, 1.0, -1]}><planeGeometry args={[7, 3.5]} /><meshBasicMaterial color="#E8F4FD" transparent opacity={0.25} /></mesh>
      {/* 水层 */}
      <mesh position={[0, -0.9, -1]}><planeGeometry args={[7, 3]} /><meshBasicMaterial color="#A8D0F0" transparent opacity={0.45} /></mesh>
      {/* 水面线 */}
      <mesh position={[0, WATER_Y, -0.3]}><planeGeometry args={[6.5, 0.05]} /><meshBasicMaterial color="#88BBEE" transparent opacity={0.8} /></mesh>

      {/* 法线 — 白色虚线 */}
      <mesh position={[ix, -0.1, 0]}><cylinderGeometry args={[0.015, 0.015, 2.2, 8]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} /></mesh>
      {/* 法线标注小球 */}
      <mesh position={[ix, WATER_Y, 0.05]}><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#FFFFFF" /></mesh>

      {/* 入射光线 — 红色 */}
      <group ref={beamRef}>
        <mesh position={[(startX+ix)/2, (startY+iy)/2, 0.03]}
          rotation={[0, 0, -incidentRad]}>
          <cylinderGeometry args={[0.04, 0.04, laserLen, 8]} />
          <meshBasicMaterial color="#FF4444" />
        </mesh>
        {/* 入射箭头 */}
        <mesh position={[(startX+ix)/2 + 0.3, (startY+iy)/2 + 0.05, 0.06]}
          rotation={[0, 0, -incidentRad]}>
          <coneGeometry args={[0.07, 0.18, 6]} />
          <meshBasicMaterial color="#FF4444" />
        </mesh>
      </group>

      {/* 反射光线 — 淡红 */}
      <mesh position={[(ix+reflectX)/2, (iy+reflectY)/2, 0.02]}
        rotation={[0, 0, incidentRad]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshBasicMaterial color="#FF8888" transparent opacity={0.4} />
      </mesh>

      {/* 折射光线 — 橙色 */}
      {refracted && (
        <>
          <mesh position={[(ix+rx)/2, (iy+ry)/2, 0.03]}
            rotation={[0, 0, refractRad]}>
            <cylinderGeometry args={[0.04, 0.04, refractLen, 8]} />
            <meshBasicMaterial color="#FF8844" />
          </mesh>
          <mesh position={[(ix+rx)/2 + 0.2, (iy+ry)/2 - 0.1, 0.06]}
            rotation={[0, 0, refractRad]}>
            <coneGeometry args={[0.07, 0.18, 6]} />
            <meshBasicMaterial color="#FF8844" />
          </mesh>
        </>
      )}

      {/* 入射角弧线 */}
      <mesh position={[ix, iy, 0.04]} rotation={[0, 0, Math.PI/2 - incidentRad]}>
        <torusGeometry args={[0.4, 0.012, 8, 12, incidentRad]} />
        <meshBasicMaterial color="#FF6666" transparent opacity={0.6} />
      </mesh>

      {/* 折射角弧线 */}
      {refracted && (
        <mesh position={[ix, iy, 0.04]} rotation={[0, 0, -Math.PI/2]}>
          <torusGeometry args={[0.35, 0.012, 8, 12, refractRad]} />
          <meshBasicMaterial color="#FFAA66" transparent opacity={0.6} />
        </mesh>
      )}

      {/* 光谱带 */}
      {refracted && ["#FF4444","#FF8844","#FFCC44","#44FF44","#4488FF","#8844FF"].map((c, i) => (
        <Float key={i} speed={1.2} floatIntensity={0.12}>
          <mesh position={[rx + 0.2 + i * 0.15, ry + i * 0.05, 0]}><boxGeometry args={[0.12, 0.02, 0.12]} /><meshBasicMaterial color={c} /></mesh>
        </Float>
      ))}

      {/* 激光笔光源 */}
      <pointLight position={[startX, startY, 0.5]} intensity={1.2} color="#FF4444" distance={2} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
    </group>
  );
}

const ANGLE_PRESETS = [
  { label: "小角度 15°", value: 15 },
  { label: "中等 30°", value: 30 },
  { label: "偏大 45°", value: 45 },
  { label: "很大 60°", value: 60 },
];

export default function RefractionScene() {
  const [incidentDeg, setIncidentDeg] = useState(30);
  const { incidentRad, refractRad, refracted } = calcRefraction(incidentDeg);
  const refractDeg = refracted ? Math.round((refractRad * 180) / Math.PI) : 0;

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0.1, 4.5], fov: 45 }} dpr={[1, 2]}>
        <Scene incidentDeg={incidentDeg} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.65} />
      </Canvas>

      {/* 标签 */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
        <span className="text-[10px] font-bold text-[#4488CC] bg-white/70 rounded-lg px-2 py-0.5">🌬️ 空气 (n=1.0)</span>
        <span className="text-[10px] font-bold text-[#3366AA] bg-white/70 rounded-lg px-2 py-0.5">💧 水 (n=1.33)</span>
      </div>
      <div className="absolute top-1/2 left-[42%] pointer-events-none">
        <span className="text-[9px] font-bold text-white bg-white/40 rounded-lg px-1.5 py-0.5">法线</span>
      </div>

      {/* 入射角调节按钮 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {ANGLE_PRESETS.map((opt) => (
          <button key={opt.label} type="button" onClick={() => setIncidentDeg(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              incidentDeg === opt.value ? "bg-red-400 text-white shadow-md" : "bg-white text-[#6B6B7B] border border-[#E8E0F0] hover:border-red-300"
            }`}>{opt.label}</button>
        ))}
      </div>

      {/* 状态标注 */}
      <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1 items-end">
        <span className="text-[11px] font-bold rounded-xl px-3 py-1.5 bg-red-100 text-red-700">
          🔴 入射角: {incidentDeg}°
        </span>
        <span className="text-[11px] font-bold rounded-xl px-3 py-1.5 bg-orange-100 text-orange-700">
          🟠 折射角: {refractDeg}°
        </span>
        {refracted && refractDeg < incidentDeg && (
          <span className="text-[10px] font-bold text-[#6B6B7B] bg-white/75 rounded-lg px-2 py-0.5">
            💡 光从空气进入水中，向法线方向偏折
          </span>
        )}
      </div>
    </div>
  );
}
