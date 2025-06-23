'use client';

import { useEffect, useMemo, useRef } from 'react';
import vert from '@/shaders/waves.vert';
import frag from '@/shaders/waves.frag';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGui } from '@/hooks';

const Sea = () => {
  const gui = useGui();

  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const alphaMap = useLoader(THREE.TextureLoader, '/assets/alpha.jpg');

  const debugObject = useMemo(() => {
    return {
      depthColor: '#186691',
      surfaceColor: '#1a3647',
    };
  }, []);

  useEffect(() => {
    if (!gui) return;
    const bigWaves = gui.addFolder('Big waves');
    const smallWaves = gui.addFolder('Small waves');

    if (!shaderRef.current) return;

    bigWaves
      .add(shaderRef.current.uniforms.uBigWavesElevation, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('elevation');
    bigWaves
      .add(shaderRef.current.uniforms.uBigWavesFrequency.value, 'x')
      .min(0)
      .max(10)
      .step(0.001)
      .name('frequency X');
    bigWaves
      .add(shaderRef.current.uniforms.uBigWavesFrequency.value, 'y')
      .min(0)
      .max(10)
      .step(0.001)
      .name('frequency Y');
    bigWaves
      .add(shaderRef.current.uniforms.uBigWavesSpeed, 'value')
      .min(0)
      .max(4)
      .step(0.001)
      .name('speed');
    gui
      .addColor(debugObject, 'depthColor')
      .onChange(() => shaderRef.current?.uniforms.uDepthColor.value.set(debugObject.depthColor))
      .name('depthColor');
    gui
      .addColor(debugObject, 'surfaceColor')
      .onChange(() => shaderRef.current?.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor))
      .name('surfaceColor');
    gui
      .add(shaderRef.current.uniforms.uColorOffset, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('color offset');
    gui
      .add(shaderRef.current.uniforms.uColorMultiplier, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('color multiplier');
    smallWaves
      .add(shaderRef.current.uniforms.uSmallWavesElevation, 'value')
      .min(0)
      .max(4)
      .step(0.001)
      .name('elevation');
    smallWaves
      .add(shaderRef.current.uniforms.uSmallWavesFrequency, 'value')
      .min(0)
      .max(30)
      .step(0.001)
      .name('frequency');
    smallWaves
      .add(shaderRef.current.uniforms.uSmallWavesSpeed, 'value')
      .min(0)
      .max(4)
      .step(0.001)
      .name('speed');
    smallWaves
      .add(shaderRef.current.uniforms.uSmallWavesIteration, 'value')
      .min(0)
      .max(8)
      .step(1)
      .name('iterations');

    bigWaves.open();
    smallWaves.open();
  }, [gui, debugObject]);

  useFrame(({ clock }) => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[35, 35, 512, 512]} />
      <shaderMaterial
        ref={shaderRef}
        transparent
        depthWrite={false}
        fragmentShader={frag}
        vertexShader={vert}
        side={THREE.DoubleSide}
        uniforms={{
          alphaMap: { value: alphaMap },

          uTime: { value: 0 },

          uBigWavesElevation: { value: 0.2 },
          uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
          uBigWavesSpeed: { value: 0.75 },

          uSmallWavesElevation: { value: 0.15 },
          uSmallWavesFrequency: { value: 3 },
          uSmallWavesSpeed: { value: 0.2 },
          uSmallWavesIteration: { value: 4 },

          uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
          uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
          uColorOffset: { value: 0.08 },
          uColorMultiplier: { value: 5 },
        }}
      />
    </mesh>
  );
};

export default Sea;
