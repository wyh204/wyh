"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

function Scene({ reacting }: { reacting: boolean }) {
  const bubbleRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (bubbleRef.current && reacting) bubbleRef.current.children.forEach((c, i) => { c.position.y = 0.3 + Math.sin(clock.getElapsedTime() * 3 + i) * 0.12; });
  });
  return (
    <group>
      <mesh position={[0, -0.9, -0.4]}><boxGeometry args={[5, 0.1, 2]} /><meshStandardMaterial color="#D4C8B8" roughness={0.5} /></mesh>
      <group position={[-1, -0.3, 0]}>
        <mesh><cylinderGeometry args={[0.35, 0.25, 0.7, 16]} /><meshPhysicalMaterial color="#CCEEFF" transparent opacity={0.2} roughness={0.05} /></mesh>
        {[0.1, 0.2, 0.15].map((x, i) => (<mesh key={i} position={[x * 0.5 - 0.1, -0.2, 0.05 * i]}><boxGeometry args={[0.12, 0.08, 0.08]} /><meshStandardMaterial color="#DDD8C8" roughness={0.6} /></mesh>))}
      </group>
      <group position={[-1, 0.3, 0.1]}>
        <mesh><cylinderGeometry args={[0.06, 0.1, 0.35, 8]} /><meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.15} roughness={0.05} /></mesh>
        <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.15} roughness={0.05} /></mesh>
        {reacting && (<Float speed={2} floatIntensity={0}><mesh position={[0, -0.15, 0.05]}><sphereGeometry args={[0.02, 6, 6]} /><meshBasicMaterial color="#88FF88" transparent opacity={0.6} /></mesh></Float>)}
      </group>
      <mesh position={[-0.4, 0, 0.1]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.015, 0.015, 1.0, 8]} /><meshStandardMaterial color="#AAAAAA" /></mesh>
      <mesh position={[0.3, 0.1, 0.1]}><cylinderGeometry args={[0.015, 0.015, 0.6, 8]} /><meshStandardMaterial color="#AAAAAA" /></mesh>
      {reacting && (<group ref={bubbleRef}>{[0, 0.15, 0.25].map((y, i) => (<mesh key={i} position={[i % 2 === 0 ? -1 : -0.9, y, 0.1]}><sphereGeometry args={[0.025, 6, 6]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} /></mesh>))}</group>)}
      <group position={[1, -0.2, 0]}>
        <mesh><cylinderGeometry args={[0.2, 0.22, 0.45, 16]} /><meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.2} roughness={0.05} /></mesh>
        <mesh position={[0, reacting ? -0.05 : 0, 0]}><cylinderGeometry args={[0.18, 0.18, 0.3, 16]} /><meshStandardMaterial color={reacting ? "#DDDDCC" : "#FFFFFF"} transparent opacity={reacting ? 0.6 : 0.3} /></mesh>
      </group>
      <mesh position={[0.8, 0, 0.1]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.015, 0.015, 0.4, 8]} /><meshStandardMaterial color="#AAAAAA" /></mesh>
      <ambientLight intensity={0.5} /><directionalLight position={[3, 5, 3]} intensity={0.6} />
    </group>
  );
}

export default function CO2Scene() {
  const [reacting, setReacting] = useState(false);
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0.2, 4.5], fov: 42 }} dpr={[1, 2]}><Scene reacting={reacting} /><OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.6} /></Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2"><button type="button" onClick={() => setReacting(!reacting)}
        className={`px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all ${reacting ? "bg-green-400 text-white shadow-md" : "bg-white text-[#6B6B7B] border border-[#E8E0F0] hover:border-green-300"}`}>{reacting ? "🔄 重置" : "💧 滴加稀盐酸"}</button></div>
      <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1 items-end">
        <span className={`text-[11px] font-bold rounded-xl px-3 py-1.5 ${reacting ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{reacting ? "💨 反应进行中" : "⏸️ 等待反应"}</span>
        {reacting && <span className="text-[10px] font-bold bg-yellow-50 text-yellow-700 rounded-lg px-2 py-0.5">☁️ 石灰水变浑浊</span>}
      </div>
      <div className="absolute top-3 left-3 pointer-events-none"><span className="text-[10px] font-bold text-[#8888AA] bg-white/70 rounded-lg px-2 py-0.5">🧪 CaCO₃ + HCl → CO₂↑</span></div>
    </div>
  );
}
