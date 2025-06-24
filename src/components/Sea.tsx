'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
// import { useGui } from '@/hooks';
import frag from '@/shaders/waves.frag';
import vert from '@/shaders/waves.vert';

const Sea = () => {
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const phase = useRef(0);
  const speed = useRef(0);
  const lastT = useRef(0);
  const stormStrength = useRef(1);
  const stormTarget = useRef(1);
  const smallSpeed = useRef(0);
  const nextStorm = useRef(0);

  const alphaMap = useLoader(THREE.TextureLoader, '/assets/alpha.jpg');

  const debugObject = useMemo(
    () => ({
      depthColor: '#05161f',
      surfaceColor: '#134d72',
    }),
    [],
  );

  // const gui = useGui();

  // useEffect(() => {
  //   if (!gui || !shaderRef.current) return;

  //   const big = gui.addFolder('Big Waves');
  //   const small = gui.addFolder('Small Waves');

  //   big.add(shaderRef.current.uniforms.uBigWavesFrequency.value, 'x', 0, 10, 0.01).name('freq X');
  //   big.add(shaderRef.current.uniforms.uBigWavesFrequency.value, 'y', 0, 10, 0.01).name('freq Z');
  //   gui.addColor(debugObject, 'depthColor').onChange(() => {
  //     shaderRef.current!.uniforms.uDepthColor.value.set(debugObject.depthColor);
  //   });
  //   gui.addColor(debugObject, 'surfaceColor').onChange(() => {
  //     shaderRef.current!.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  //   });

  //   gui.add(shaderRef.current.uniforms.uColorOffset, 'value', 0, 1, 0.01);
  //   gui.add(shaderRef.current.uniforms.uColorMultiplier, 'value', 0, 10, 0.1);

  //   small.add(shaderRef.current.uniforms.uSmallWavesFrequency, 'value', 0, 30, 0.1);
  //   small.add(shaderRef.current.uniforms.uSmallWavesIteration, 'value', 1, 8, 1);

  //   big.open();
  //   small.open();
  // }, [gui, debugObject]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const dt = t - lastT.current;
    lastT.current = t;

    if (t > nextStorm.current) {
      stormTarget.current = stormTarget.current === 1 ? 0 : 1;
      nextStorm.current = t + (stormTarget.current === 1 ? 10 : 3) + Math.random() * 2;
    }

    stormStrength.current = THREE.MathUtils.damp(
      stormStrength.current,
      stormTarget.current,
      0.5,
      dt,
    );

    const targetSpeed = THREE.MathUtils.lerp(0.35, 0.75, stormStrength.current);
    speed.current = THREE.MathUtils.damp(speed.current, targetSpeed, 0.5, dt);
    phase.current += speed.current * dt;

    if (!shaderRef.current) return;

    shaderRef.current.uniforms.uPhase.value = phase.current;
    shaderRef.current.uniforms.uBigWavesElevation.value = THREE.MathUtils.lerp(
      0.04,
      0.35,
      stormStrength.current,
    );
    shaderRef.current.uniforms.uSmallWavesElevation.value = THREE.MathUtils.lerp(
      0.06,
      0.15,
      stormStrength.current,
    );

    const targetSmallSpeed = THREE.MathUtils.lerp(0.15, 0.4, stormStrength.current);
    smallSpeed.current = THREE.MathUtils.damp(smallSpeed.current, targetSmallSpeed, 0.5, dt);
    shaderRef.current.uniforms.uSmallWavesSpeed.value = smallSpeed.current;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 512, 512]} />
      <shaderMaterial
        ref={shaderRef}
        transparent
        depthWrite
        depthTest
        side={THREE.DoubleSide}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uPhase: { value: 0 },

          alphaMap: { value: alphaMap },

          uBigWavesElevation: { value: 0.04 },
          uBigWavesFrequency: { value: new THREE.Vector2(0.75, 0.3) },

          uSmallWavesElevation: { value: 0.06 },
          uSmallWavesFrequency: { value: 5 },
          uSmallWavesSpeed: { value: 0.15 },
          uSmallWavesIteration: { value: 5 },

          uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
          uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
          uColorOffset: { value: 0.15 },
          uColorMultiplier: { value: 3 },
        }}
      />
    </mesh>
  );
};

export default Sea;
