"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <group>
      {/* Candle */}
      <mesh position={[-2, -0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#f5e6ca" />
      </mesh>
      {/* Flame */}
      <mesh position={[-2, 0.3, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      {/* Convex lens */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 32]} />
        <meshPhysicalMaterial color="#ccccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Lens holder */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      {/* Screen */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <meshStandardMaterial color="#333344" />
      </mesh>
      {/* Projected image (inverted) */}
      <mesh position={[2.03, -0.1, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshBasicMaterial color="#ffff88" />
      </mesh>
    </group>
  );
}

export default function LensScene() {
  return (
    <Canvas camera={{ position: [0, 0.3, 5], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.7} />
      <Scene />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
