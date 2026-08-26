"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Sphere,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Stars,
  Environment,
} from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function CoreOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!mesh.current || !group.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle continuous rotation + mouse influence
    group.current.rotation.y = t * 0.15 + state.pointer.x * 0.3;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.15 + state.pointer.y * 0.15;
    mesh.current.rotation.z = t * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.4}>
        {/* Main distorted sphere */}
        <Sphere ref={mesh} args={[1.15, 128, 128]}>
          <MeshDistortMaterial
            color="#3B82F6"
            attach="material"
            distort={0.45}
            speed={1.8}
            roughness={0.15}
            metalness={0.65}
            emissive="#1e40af"
            emissiveIntensity={0.25}
          />
        </Sphere>

        {/* Inner glowing core */}
        <Sphere args={[0.55, 64, 64]}>
          <meshBasicMaterial color="#60A5FA" transparent opacity={0.35} />
        </Sphere>

        {/* Outer soft halo */}
        <Sphere args={[1.45, 32, 32]}>
          <meshBasicMaterial
            color="#3B82F6"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </Sphere>
      </Float>

      {/* Orbiting accent spheres */}
      <Float speed={2.4} rotationIntensity={1.2} floatIntensity={0.8}>
        <Sphere args={[0.18, 32, 32]} position={[1.9, 0.4, 0.6]}>
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#0891b2"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      </Float>

      <Float speed={1.6} rotationIntensity={0.9} floatIntensity={1.1}>
        <Sphere args={[0.12, 32, 32]} position={[-1.7, -0.5, 0.8]}>
          <meshStandardMaterial
            color="#818CF8"
            emissive="#4F46E5"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.25}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 3, 2]} intensity={1.1} color="#93C5FD" />
        <pointLight position={[-3, -2, 2]} intensity={0.6} color="#22D3EE" />
        <pointLight position={[2, 2, -1]} intensity={0.4} color="#818CF8" />

        <Stars
          radius={80}
          depth={40}
          count={1200}
          factor={3.2}
          saturation={0.4}
          fade
          speed={0.4}
        />

        <CoreOrb />

        {/* Subtle environment for reflections */}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
