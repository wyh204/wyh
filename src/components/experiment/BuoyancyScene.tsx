"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ================================================================
   阿基米德原理 — F浮 = ρ液·g·V排  定量逻辑版
   ================================================================ */
const TANK_W = 2.4, WATER_Y0 = 0.35, CUBE_S = 0.42, CUBE_V = CUBE_S * CUBE_S * CUBE_S;

function Scene({ depth }: { depth: number }) {
  const waterRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Group>(null);
  const immersion = Math.max(0, Math.min(1, (depth - 1) / 2));
  const cubeY = 0.45 - depth * 0.22;
  const waterRise = immersion * CUBE_V / (TANK_W * 1.2);
  const buoyancy = immersion * 0.7;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) (waterRef.current.material as THREE.MeshStandardMaterial).opacity = 0.35 + Math.sin(t * 2) * 0.05;
    if (cubeRef.current && immersion > 0) cubeRef.current.position.y = cubeY + Math.sin(t * 1.5) * 0.03;
  });

  return (
    <group>
      <mesh position={[0, -0.7, -0.3]}><boxGeometry args={[TANK_W + 0.2, 0.12, 1.8]} /><meshStandardMaterial color="#C8B898" roughness={0.5} /></mesh>
      {[-1.2, 1.2].map((x) => (<mesh key={x} position={[x, 0, -0.3]}><boxGeometry args={[0.08, 1.2, 1.8]} /><meshPhysicalMaterial color="#88BBDD" transparent opacity={0.2} roughness={0.1} /></mesh>))}
      <mesh position={[0, 0, -0.3]}><boxGeometry args={[TANK_W, 1.1, 1.6]} /><meshPhysicalMaterial color="#5599CC" transparent opacity={0.25} roughness={0.05} /></mesh>
      <mesh ref={waterRef} position={[0, WATER_Y0 + waterRise, 0]}><planeGeometry args={[TANK_W, 1.6]} /><meshStandardMaterial color="#88CCFF" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>

      {immersion > 0 && [0.25, 0.4, 0.55].map((r, i) => (
        <Float key={i} speed={1.2 + i * 0.3} floatIntensity={0.02}>
          <mesh position={[0, WATER_Y0 + waterRise + 0.01, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.012, 8, 20]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.35 - i * 0.1} />
          </mesh>
        </Float>
      ))}

      <group ref={cubeRef} position={[0, cubeY, 0.15]}>
        <mesh><boxGeometry args={[CUBE_S, CUBE_S, CUBE_S]} /><meshStandardMaterial color="#F0A040" roughness={0.3} /></mesh>
      </group>

      {immersion > 0 && (
        <Float speed={1.3} floatIntensity={0.08}>
          <group position={[0, 0.25 - depth * 0.22 + 0.3 * buoyancy, 0.45]}>
            <mesh><cylinderGeometry args={[0.03, 0.03, 0.4 * buoyancy, 8]} /><meshBasicMaterial color="#44FF88" /></mesh>
            <mesh position={[0, 0.22 * buoyancy, 0]}><coneGeometry args={[0.09, 0.18, 8]} /><meshBasicMaterial color="#44FF88" /></mesh>
          </group>
        </Float>
      )}

      <Float speed={1.3} floatIntensity={0.08}>
        <group position={[0, -0.5, 0.45]}>
          <mesh><cylinderGeometry args={[0.03, 0.03, 0.35, 8]} /><meshBasicMaterial color="#FF8888" /></mesh>
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.09, 0.18, 8]} /><meshBasicMaterial color="#FF8888" /></mesh>
        </group>
      </Float>

      {[0, 0.2, 0.4, 0.6].map((y, i) => (<mesh key={i} position={[1.3, -0.3 + y, 0.35]}><boxGeometry args={[0.12, 0.008, 0.008]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} /></mesh>))}
      <ambientLight intensity={0.5} /><directionalLight position={[3, 5, 3]} intensity={0.7} />
    </group>
  );
}

const LEVELS = [{ label: "水上", value: 0 }, { label: "刚触水", value: 1 }, { label: "半浸入", value: 2 }, { label: "全浸入", value: 3 }];

export default function BuoyancyScene() {
  const [depth, setDepth] = useState(0);
  const immersion = Math.max(0, Math.min(1, (depth - 1) / 2));

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0.35, 4.2], fov: 42 }} dpr={[1, 2]}>
        <Scene depth={depth} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.65} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {LEVELS.map((opt) => (
          <button key={opt.label} type="button" onClick={() => setDepth(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${depth===opt.value ? "bg-blue-400 text-white shadow-md" : "bg-white text-[#6B6B7B] border border-[#E8E0F0] hover:border-blue-300"}`}>{opt.label}</button>
        ))}
      </div>

      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
        <span className="text-[10px] font-bold text-[#8888AA] bg-white/75 rounded-lg px-2 py-0.5">🧊 物体 · 💧 水槽</span>
        {depth > 0 && <span className="text-[10px] font-bold text-[#4488CC] bg-white/75 rounded-lg px-2 py-0.5">排开水: {(immersion * CUBE_V * 1000).toFixed(0)} mL</span>}
      </div>
      <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1 items-end">
        <span className={`text-[11px] font-bold rounded-xl px-3 py-1.5 ${depth>0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
          {depth===0 ? "⏸️ 物体在水上" : `💧 浮力: ${(immersion * 0.73).toFixed(2)} N`}
        </span>
        {immersion > 0 && <span className="text-[10px] font-bold text-[#6B6B7B] bg-white/75 rounded-lg px-2 py-0.5">⬆️ 排开的水越多，浮力越大</span>}
      </div>
    </div>
  );
}
