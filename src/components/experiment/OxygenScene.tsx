"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* 实验室制取氧气 — 加热高锰酸钾, 排水集气, 带火星木条复燃 */
function Scene({ heating, collecting }: { heating: boolean; collecting: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flameRef.current && heating) flameRef.current.scale.setScalar(0.9 + Math.sin(t * 10) * 0.2);
  });

  return (
    <group>
      {/* 桌面 */}
      <mesh position={[0, -0.9, -0.4]}><boxGeometry args={[5.5, 0.1, 2]} /><meshStandardMaterial color="#D4C8B8" roughness={0.5} /></mesh>
      {/* 铁架台 */}
      <mesh position={[0.8, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 1.6, 8]} /><meshStandardMaterial color="#666666" /></mesh>
      <mesh position={[0.6, 0.45, 0]}><boxGeometry args={[0.5, 0.04, 0.1]} /><meshStandardMaterial color="#666666" /></mesh>
      {/* 铁圈固定试管 */}
      <mesh position={[0.4, 0.2, 0.12]}><torusGeometry args={[0.12, 0.02, 8, 16]} /><meshStandardMaterial color="#777777" /></mesh>

      {/* 酒精灯 */}
      <group position={[-0.2, -0.45, 0.15]}>
        <mesh><cylinderGeometry args={[0.18, 0.25, 0.45, 16]} /><meshStandardMaterial color="#888888" /></mesh>
        {heating && (
          <Float speed={0.8} floatIntensity={0.06}>
            <mesh ref={flameRef} position={[0, 0.25, 0]}><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#FF6600" /></mesh>
            <mesh position={[0, 0.32, 0]}><coneGeometry args={[0.06, 0.15, 8]} /><meshBasicMaterial color="#FFAA00" /></mesh>
          </Float>
        )}
      </group>

      {/* 大试管(含高锰酸钾) */}
      <group position={[0.45, 0.2, 0.1]} rotation={[0, 0, 0.15]}>
        <mesh><cylinderGeometry args={[0.08, 0.1, 0.9, 8]} /><meshPhysicalMaterial color="#CCDDFF" transparent opacity={0.25} roughness={0.05} /></mesh>
        <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.07, 0.07, 0.3, 8]} /><meshStandardMaterial color="#6644AA" roughness={0.4} /></mesh>
        {/* 气泡 */}
        {heating && collecting && [0, 0.1, 0.2].map((y, i) => (
          <Float key={i} speed={2 + i * 0.5} floatIntensity={0}>
            <mesh position={[0.02, y - 0.05, 0.05]}><sphereGeometry args={[0.02, 6, 6]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} /></mesh>
          </Float>
        ))}
      </group>

      {/* 导管 */}
      <mesh position={[0.5, -0.15, 0.1]} rotation={[0, 0, -0.4]}><cylinderGeometry args={[0.015, 0.015, 1.2, 8]} /><meshStandardMaterial color="#AAAAAA" /></mesh>

      {/* 集气瓶(水槽中) */}
      <group position={[-0.8, -0.5, 0.1]}>
        <mesh><cylinderGeometry args={[0.22, 0.25, 0.5, 16]} /><meshPhysicalMaterial color="#AADDFF" transparent opacity={0.2} roughness={0.05} /></mesh>
        <mesh position={[0, collecting ? -0.15 : 0.05, 0]}><cylinderGeometry args={[0.2, 0.2, 0.25, 16]} /><meshStandardMaterial color="#4488FF" transparent opacity={0.35} /></mesh>
        {/* 氧气气泡 */}
        {collecting && [0, 0.1, 0.2].map((y, i) => (
          <Float key={i} speed={2.5 + i * 0.6} floatIntensity={0}>
            <mesh position={[0.08 + i * 0.03, y - 0.05, 0]}><sphereGeometry args={[0.025, 6, 6]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} /></mesh>
          </Float>
        ))}
      </group>

      {/* 带火星木条 */}
      {collecting && (
        <Float speed={0.6} floatIntensity={0.08}>
          <group position={[-1.2, 0.1, 0.2]} rotation={[0, 0, 0.4]}>
            <mesh><cylinderGeometry args={[0.015, 0.015, 0.7, 8]} /><meshStandardMaterial color="#C8A878" /></mesh>
            <mesh position={[0, 0.4, 0]}><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#FF4400" /></mesh>
            <pointLight position={[0, 0.4, 0.2]} intensity={0.8} color="#FF4400" distance={1} />
          </group>
        </Float>
      )}

      <ambientLight intensity={0.5} /><directionalLight position={[3, 5, 3]} intensity={0.6} />
    </group>
  );
}

export default function OxygenScene() {
  const [heating, setHeating] = useState(false);
  const [collecting, setCollecting] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0.2, 4.5], fov: 42 }} dpr={[1, 2]}>
        <Scene heating={heating} collecting={collecting} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.6} />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button type="button" onClick={() => { setHeating(!heating); if (!heating) setCollecting(false); }}
          className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${heating ? "bg-orange-400 text-white shadow-md" : "bg-white text-[#6B6B7B] border border-[#E8E0F0] hover:border-orange-300"}`}>
          {heating ? "🔥 停止加热" : "🔥 点燃酒精灯"}
        </button>
        {heating && (
          <button type="button" onClick={() => setCollecting(!collecting)}
            className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${collecting ? "bg-blue-400 text-white shadow-md" : "bg-white text-[#6B6B7B] border border-[#E8E0F0] hover:border-blue-300"}`}>
            {collecting ? "🫧 停止收集" : "🫧 排水集气"}
          </button>
        )}
      </div>
      <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1 items-end">
        <span className={`text-[11px] font-bold rounded-xl px-3 py-1.5 ${heating ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"}`}>
          {heating ? "🔥 加热中" : "⏸️ 等待加热"}
        </span>
        {collecting && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 rounded-lg px-2 py-0.5">💨 氧气收集中</span>}
      </div>
      <div className="absolute top-3 left-3 pointer-events-none"><span className="text-[10px] font-bold text-[#8888AA] bg-white/70 rounded-lg px-2 py-0.5">🧪 高锰酸钾 → 氧气</span></div>
    </div>
  );
}
