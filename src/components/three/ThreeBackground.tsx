"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useMediaQuery";

const subjectColors = ["#e85d3a", "#4da6ff", "#3dd68c", "#a78bfa", "#f0a040"];

function FloatingShape({ color, position, scale }: { color: string; position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.2 + Math.random() * 0.4, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.003;
      meshRef.current.rotation.y += speed * 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.6}
          distort={0.15}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const isMobile = useIsMobile();
  const count = isMobile ? 3 : 8;

  const shapes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      color: subjectColors[Math.floor(Math.random() * subjectColors.length)],
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3 - 1,
      ] as [number, number, number],
      scale: 0.4 + Math.random() * 0.6,
    }));
  }, [count]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-70 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
