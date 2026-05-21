"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

interface Sphere360Props {
  textureUrl: string;
}

function Sphere360({ textureUrl }: Sphere360Props) {
  const texture = useTexture(textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  // Slowly rotate the sphere for a cinematic effect
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-4 text-[#d4af37]">
        <Loader2 size={48} className="animate-spin" />
        <span className="font-sans tracking-widest text-sm uppercase">Loading Reality</span>
      </div>
    </Html>
  );
}

interface Three360ViewerProps {
  panoramaUrl: string;
}

export default function Three360Viewer({ panoramaUrl }: Three360ViewerProps) {
  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing bg-jungle">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Sphere360 textureUrl={panoramaUrl} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={-0.5}
        />
      </Canvas>
    </div>
  );
}
