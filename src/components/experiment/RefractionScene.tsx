"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <group>
      {/* Incoming laser beam */}
      <mesh position={[-2.5, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      {/* Prism */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.5, 1.2, 3]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} />
      </mesh>
      {/* Refracted beam */}
      <mesh position={[1.2, -0.3, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 8]} />
        <meshBasicMaterial color="#ff8844" />
      </mesh>
      {/* Spectrum on "wall" */}
      {["#ff4444", "#ff8844", "#ffcc44", "#44ff44", "#4444ff", "#8844ff"].map((c, i) => (
        <mesh key={i} position={[2.5, 0.4 - i * 0.15, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.3]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}
    </group>
  );
}

export default function RefractionScene() {
  return (
    <Canvas camera={{ position: [0, 0.2, 4], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Scene />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
