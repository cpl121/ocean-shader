'use client';
import { useRef } from 'react';
import vert from '@/shaders/basic.vert';
import frag from '@/shaders/basic.frag';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

const CustomShader = () => {
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);

  const alphaMap = useLoader(THREE.TextureLoader, '/assets/alpha.jpg');

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10, 100, 100]} />
      <shaderMaterial
        ref={shaderRef}
        transparent
        depthWrite={false}
        fragmentShader={frag}
        vertexShader={vert}
        uniforms={{
          alphaMap: { value: alphaMap },
        }}
      />
    </mesh>
  );
};

export default CustomShader;
