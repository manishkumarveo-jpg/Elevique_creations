"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Crystal() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.18;
      outerRef.current.rotation.z = t * 0.06;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.1;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
      <group>
        {/* Outer crystal */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.65, 1]} />
          <MeshDistortMaterial
            color="#14B8A6"
            emissive="#14B8A6"
            emissiveIntensity={0.18}
            metalness={0.96}
            roughness={0.04}
            distort={0.28}
            speed={1.6}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Inner wireframe layer */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshStandardMaterial
            color="#14B8A6"
            emissive="#14B8A6"
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* Ambient glow core */}
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#5eead4"
            emissive="#5eead4"
            emissiveIntensity={0.6}
            transparent
            opacity={0.06}
          />
        </mesh>

        {/* Gold particle cloud */}
        <Sparkles
          count={70}
          scale={5.5}
          size={1.4}
          speed={0.22}
          color="#14B8A6"
          opacity={0.55}
        />

        {/* Teal accent particles */}
        <Sparkles
          count={25}
          scale={8}
          size={0.7}
          speed={0.12}
          color="#14B8A6"
          opacity={0.35}
        />
      </group>
    </Float>
  );
}

export default function AboutScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 44 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[4,  5,  4]} intensity={1.2} color="#14B8A6" />
      <pointLight position={[-4, -3, -3]} intensity={0.6} color="#14B8A6" />
      <pointLight position={[0,  0,  6]} intensity={0.3} color="#ffffff" />
      <Suspense fallback={null}>
        <Crystal />
      </Suspense>
    </Canvas>
  );
}
