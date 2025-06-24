import { Canvas } from '@react-three/fiber';
import { CanvasLoader, Moon, Sea, BackgroundMusic, GuiProvider } from '@/components';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

const Scene = () => {
  const moonPosition: [number, number, number] = [10, 11, -30];

  return (
    <GuiProvider>
      <Canvas
        camera={{ position: [4, 1, 10], fov: 50 }}
        shadows
        gl={{
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          shadowMapEnabled: true,
          shadowMapType: THREE.PCFSoftShadowMap,
        }}
      >
        <ambientLight intensity={3} color="#445566" />
        <fog attach="fog" args={['#101520', 6, 15]} />
        <OrbitControls
          enableDamping
          enablePan={false}
          minPolarAngle={Math.PI / 2.12}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={7}
          maxDistance={14}
          minAzimuthAngle={-Math.PI / 3.5}
          maxAzimuthAngle={Math.PI / 6}
        />

        <Suspense fallback={<CanvasLoader />} name={'Fallback'}>
          <Moon moonPosition={moonPosition} />
          <Stars radius={100} depth={50} count={10000} factor={2} saturation={0} fade speed={2} />
          <Sea />
          <BackgroundMusic />
        </Suspense>
      </Canvas>
    </GuiProvider>
  );
};

export default Scene;
