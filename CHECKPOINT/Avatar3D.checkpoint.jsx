import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import React, { useEffect, useMemo } from "react";

function Model({ modelPath, scale, positionX, positionY }) {
  // On utilise useMemo pour recréer la scène quand modelPath change
  const { scene, animations } = useGLTF(modelPath, true); // le second param "true" force le refetch
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!actions) return;

    const names = Object.keys(actions);
    if (names.length === 0) return;

    const action = actions[names[0]];
    action.reset().fadeIn(0.3).play();

    return () => action.fadeOut(0.3);
  }, [actions, modelPath]);

  return (
    <primitive
      key={modelPath} // ← important : force React à recréer le composant
      object={scene}
      scale={scale}
      position={[positionX, positionY, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function Avatar3D({
  modelPath,
  scale = 1,
  positionX = 0,
  positionY = -1.2,
  width = 300,
  height = 300,
}) {
  return (
 <Canvas
  style={{ width, height, display: "block", margin: "0 auto" }}
  camera={{ position: [0, 1, 3], fov: 50 }}
>
  <ambientLight intensity={0.9} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />
  <Model
    key={modelPath}       // ← essentiel pour reseter l'animation
    modelPath={modelPath}
    scale={scale}
    positionX={positionX}
    positionY={positionY}
  />
  <OrbitControls enableZoom={false} enableRotate={true} enablePan={false} />
</Canvas>
  );
}

useGLTF.preload("/models/avatar_idle.glb");