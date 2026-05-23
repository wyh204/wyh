"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <group>
      {/* Battery */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[-2, 0.5, 0.2]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#cc3333" />
      </mesh>
      {/* Top wire */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 0.04, 0.04]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      {/* Left vertical wire */}
      <mesh position={[-2, 0.25, 0]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      {/* Right vertical wire */}
      <mesh position={[2, 0.25, 0]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      {/* Switch */}
      <mesh position={[-0.6, 0.5, 0.15]}>
        <boxGeometry args={[0.8, 0.04, 0.04]} />
        <meshBasicMaterial color="#cccccc" />
      </mesh>
      {/* Bulb */}
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffff88" emissive="#ffff44" emissiveIntensity={0.5} />
      </mesh>
      {/* Bulb base */}
      <mesh position={[2, -0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 16]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  );
}

export default function CircuitScene() {
  return (
    <Canvas camera={{ position: [0, 0.2, 5], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <Scene />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
