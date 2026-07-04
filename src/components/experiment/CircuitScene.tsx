"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ================================================================
   串联与并联电路 — 完整物理逻辑版
   串联: 灯泡分电压→越多越暗；并联: 每个灯泡获全电压→亮度相同
   ================================================================ */
type CircuitMode = "series" | "parallel";

function Scene({ circuitOn, mode }: { circuitOn: boolean; mode: CircuitMode }) {
  const bulb1Ref = useRef<THREE.Mesh>(null);
  const bulb2Ref = useRef<THREE.Mesh>(null);
  const brightness = mode === "series" ? 0.45 : 0.85;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    [bulb1Ref, bulb2Ref].forEach((ref) => {
      if (ref.current && circuitOn) {
        ref.current.scale.setScalar(1 + Math.sin(t * 6) * 0.25);
        (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = brightness + Math.sin(t * 5) * 0.2;
      }
    });
  });

  const wireColor = circuitOn ? "#FFAA00" : "#CC8844";
  const isSeries = mode === "series";

  return (
    <group>
      <mesh position={[0, -0.9, -0.5]}><boxGeometry args={[5.5, 0.15, 1.8]} /><meshStandardMaterial color="#D4C8B8" roughness={0.6} /></mesh>
      {/* 电池 */}
      <group position={[-2.3, -0.2, 0]}>
        <mesh><boxGeometry args={[0.5, 0.7, 0.25]} /><meshStandardMaterial color="#555555" /></mesh>
        <mesh position={[0, 0.45, 0.15]}><boxGeometry args={[0.15, 0.12, 0.08]} /><meshStandardMaterial color="#E84040" /></mesh>
      </group>
      <mesh position={[-0.3, 0.35, 0]}><boxGeometry args={[isSeries ? 4.5 : 3.6, 0.05, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>
      <mesh position={[-2.3, 0.05, 0]}><boxGeometry args={[0.05, 0.6, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>
      <mesh position={[2.3, 0.05, 0]}><boxGeometry args={[0.05, 0.6, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>

      {isSeries ? (
        <>
          <mesh position={[1.1, -0.55, 0]}><boxGeometry args={[2.2, 0.05, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>
          {[0, 2.3].map((x, i) => (<mesh key={i} position={[x, -0.3, 0]}><boxGeometry args={[0.05, 0.5, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>))}
          {[0, 2.3].map((x, i) => (
            <group key={i} position={[x, 0.05, 0]}>
              <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.15, 0.18, 0.35, 16]} /><meshStandardMaterial color="#888888" /></mesh>
              <mesh ref={i === 0 ? bulb1Ref : bulb2Ref}><sphereGeometry args={[0.32, 24, 24]} /><meshStandardMaterial color={circuitOn ? "#FFEE88" : "#DDDDCC"} emissive={circuitOn ? "#FFDD44" : "#000000"} emissiveIntensity={circuitOn ? brightness : 0} roughness={0.2} /></mesh>
            </group>
          ))}
        </>
      ) : (
        <>
          <mesh position={[0.8, -0.55, 0]}><boxGeometry args={[3, 0.05, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>
          {[-0.5, 2.3].map((x, i) => (<mesh key={i} position={[x, -0.3, 0]}><boxGeometry args={[0.05, 0.5, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>))}
          {[[-1.4, -0.5], [1.4, 2.3]].map(([bx, px], i) => (
            <mesh key={i} position={[bx, 0.35, 0]}><boxGeometry args={[Math.abs(px - bx) * 2, 0.05, 0.05]} /><meshBasicMaterial color={wireColor} /></mesh>
          ))}
          {[-0.5, 2.3].map((x, i) => (
            <group key={i} position={[x, 0.05, 0]}>
              <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.15, 0.18, 0.35, 16]} /><meshStandardMaterial color="#888888" /></mesh>
              <mesh ref={i === 0 ? bulb1Ref : bulb2Ref}><sphereGeometry args={[0.32, 24, 24]} /><meshStandardMaterial color={circuitOn ? "#FFFFAA" : "#DDDDCC"} emissive={circuitOn ? "#FFFF44" : "#000000"} emissiveIntensity={circuitOn ? brightness : 0} roughness={0.2} /></mesh>
            </group>
          ))}
        </>
      )}

      <group position={[-0.8, 0.35, 0.12]} rotation={[0, 0, circuitOn ? 0 : 0.3]}>
        <mesh><boxGeometry args={[0.8, 0.04, 0.04]} /><meshBasicMaterial color={circuitOn ? "#66DD66" : "#CCCCCC"} /></mesh>
      </group>

      {circuitOn && (<><pointLight position={[isSeries ? 0 : -0.5, 0.05, 0.8]} intensity={brightness * 1.5} color="#FFFF88" distance={2} /><pointLight position={[2.3, 0.05, 0.8]} intensity={brightness * 1.5} color="#FFFF88" distance={2} /></>)}
      {circuitOn && (<Float speed={2.5} floatIntensity={0}><mesh position={[-1.3, 0.35, 0.1]}><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#FFDD44" /></mesh></Float>)}

      <ambientLight intensity={0.5} /><directionalLight position={[3, 5, 3]} intensity={0.6} />
    </group>
  );
}

export default function CircuitScene() {
  const [circuitOn, setCircuitOn] = useState(false);
  const [mode, setMode] = useState<CircuitMode>("series");

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0.3, 5.5], fov: 42 }} dpr={[1, 2]}>
        <Scene circuitOn={circuitOn} mode={mode} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.55} />
      </Canvas>

      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <button type="button" onClick={() => setMode("series")} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${mode==="series"?"bg-orange-400 text-white shadow-md":"bg-white text-[#6B6B7B] border border-[#E8E0F0]"}`}>🔗 串联</button>
        <button type="button" onClick={() => setMode("parallel")} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${mode==="parallel"?"bg-blue-400 text-white shadow-md":"bg-white text-[#6B6B7B] border border-[#E8E0F0]"}`}>🔀 并联</button>
      </div>

      <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1 items-end">
        <span className={`text-[11px] font-bold rounded-xl px-3 py-1.5 ${circuitOn?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>{circuitOn?"⚡ 电路导通":"🔒 电路断开"}</span>
        {circuitOn && <span className={`text-[10px] font-bold rounded-lg px-2 py-0.5 ${mode==="series"?"bg-orange-50 text-orange-600":"bg-blue-50 text-blue-600"}`}>{mode==="series"?"💡 串联分压，灯泡偏暗":"💡 并联等压，灯泡正常亮"}</span>}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <button type="button" onClick={() => setCircuitOn(!circuitOn)} className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-300 shadow-lg ${circuitOn?"bg-green-400 text-white hover:bg-green-500":"bg-white text-[#6B6B7B] border-2 border-[#E8E0F0] hover:border-green-300"}`}>{circuitOn?"💡 断开开关":"🔘 闭合开关"}</button>
      </div>
    </div>
  );
}
