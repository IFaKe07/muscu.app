import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import React, { useEffect, useRef } from "react";

/* ===== COMPOSANT MODELE 3D ===== */
function Model({ modelPath, scale, positionX, positionY, animationName }) {
  const { scene, animations } = useGLTF(modelPath);
  const sceneRef = useRef();
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    // Cherche l'animation correspondant au nom demandé, sinon prends la première
    let animName = animationName && actions[animationName] ? animationName : Object.keys(actions)[0];
    if (!animName) return;

    const action = actions[animName];
    action.reset().fadeIn(0.3).play();

    return () => {
      if (action) action.fadeOut(0.3);
    };
  }, [actions, modelPath, animationName]);

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

/* ===== COMPOSANT AVATAR FEMME ===== */
export default function AvatarFemme({
  modelPath,
  scale = 0.8,
  positionX = 0,
  positionY = -1.2,
  width = 300,
  height = 300,
}) {
  return (
    <Canvas
      key={modelPath} // reset complet quand on change de modèle
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

/* ===== PRECHARGEMENT DE TOUS LES MODELES FEMININS ===== */
const modelsFemme = [
  "avatar_female_idle","avatar_female_pushup","avatar_female_squat","avatar_female_crunch","avatar_female_plank","avatar_female_jumpingjack","avatar_female_rest",
  "avatar_female_lvl3_idle","avatar_female_lvl3_pushup","avatar_female_lvl3_squat","avatar_female_lvl3_crunch","avatar_female_lvl3_plank","avatar_female_lvl3_jumpingjack","avatar_female_lvl3_rest",
  "avatar_female_lvl5_idle","avatar_female_lvl5_pushup","avatar_female_lvl5_squat","avatar_female_lvl5_crunch","avatar_female_lvl5_plank","avatar_female_lvl5_jumpingjack","avatar_female_lvl5_rest"
];

modelsFemme.forEach(m => useGLTF.preload(`/models/${m}.glb`));