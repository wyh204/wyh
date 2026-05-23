"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <group>
      {/* Alcohol lamp */}
      <mesh position={[-0.8, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      <mesh position={[-0.8, -0.1, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ff6600" />
      </mesh>
      {/* Beaker with liquid */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.8, 16, 1, true]} />
        <meshPhysicalMaterial color="#aaddff" transparent opacity={0.2} roughness={0.05} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.28, 0.25, 0.3, 16]} />
        <meshStandardMaterial color="#4488ff" transparent opacity={0.4} />
      </mesh>
      {/* Test tube */}
      <mesh position={[0.8, -0.2, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
        <meshPhysicalMaterial color="#ccddff" transparent opacity={0.25} roughness={0.05} />
      </mesh>
      {/* Iron stand */}
      <mesh position={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0.9, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
}

export default function ChemistryLabScene() {
  return (
    <Canvas camera={{ position: [0, 0.2, 4], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <directionalLight position={[-2, 2, 2]} intensity={0.3} />
      <Scene />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
