import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import React, { useEffect, useRef } from "react";

function Model({ modelPath, scale, positionX, positionY }) {
  const { scene, animations } = useGLTF(modelPath);
  const sceneRef = useRef();

  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!actions) return;

    // On prend simplement la première animation disponible pour ce GLB
    const animName = Object.keys(actions)[0];
    if (!animName) return;

    const action = actions[animName];
    action.reset().fadeIn(0.3).play();

    return () => {
      action.fadeOut(0.3);
    };
  }, [actions, modelPath]);

  return (
    <primitive
      ref={sceneRef}
      object={scene}
      scale={scale}
      position={[positionX, positionY, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function AvatarHomme({
  modelPath,
  scale = 0.8,
  positionX = 0,
  positionY = -1.2,
  width = 300,
  height = 300,
}) {
  return (
    <Canvas
      key={modelPath} // reset complet quand on change de GLB/exercice
      style={{ width, height, display: "block", margin: "0 auto" }}
      camera={{ position: [0, 1, 3], fov: 50 }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Model
        modelPath={modelPath}
        scale={scale}
        positionX={positionX}
        positionY={positionY}
      />
      <OrbitControls enableZoom={false} enableRotate={true} enablePan={false} />
    </Canvas>
  );
}

// Préchargement
const models = [
  "avatar_idle","avatar_pushup","avatar_squat","avatar_crunch","avatar_plank",
  "avatar_jumpingjack","avatar_rest",
  "avatar_lvl3_idle","avatar_lvl3_pushup","avatar_lvl3_squat","avatar_lvl3_crunch","avatar_lvl3_plank","avatar_lvl3_jumpingjack","avatar_lvl3_rest",
  "avatar_lvl5_idle","avatar_lvl5_pushup","avatar_lvl5_squat","avatar_lvl5_crunch","avatar_lvl5_plank","avatar_lvl5_jumpingjack","avatar_lvl5_rest"
];

models.forEach(m => useGLTF.preload(`/models/${m}.glb`));