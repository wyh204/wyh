"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <group>
      {/* Water tank */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshPhysicalMaterial color="#4488cc" transparent opacity={0.2} roughness={0.05} />
      </mesh>
      {/* Water inside */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.85, 1.1, 0.85]} />
        <meshStandardMaterial color="#6699dd" transparent opacity={0.3} />
      </mesh>
      {/* Floating cube */}
      <mesh position={[0, 0.35, 0.2]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#f0a040" />
      </mesh>
      {/* Spring / force indicator */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      {/* Up arrow (buoyancy) */}
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshBasicMaterial color="#44ff88" />
      </mesh>
    </group>
  );
}

export default function BuoyancyScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} />
      <Scene />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
