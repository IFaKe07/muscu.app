import React, { useMemo } from "react";
import Avatar3D from "./Avatar3D";

// Fonction pour récupérer le modèle 3D selon l'exercice
const getExerciseModel = (exercise, level) => {
  let prefix = "avatar";

  if (level >= 5) prefix = "avatar_lvl5";
  else if (level >= 3) prefix = "avatar_lvl3";

  switch (exercise) {
    case "pompes":
      return `/models/${prefix}_pushup.glb`;
    case "squats":
      return `/models/${prefix}_squat.glb`;
    case "abdos":
      return `/models/${prefix}_abs.glb`;
    case "planche":
      return `/models/${prefix}_plank.glb`;
    case "jumping jack":
      return `/models/${prefix}_jumpingjack.glb`;
    default:
      return `/models/${prefix}_idle.glb`;
  }
};

export default function AvatarDisplay({ gender, bodyType, currentExercise, level }) {
  // Homme corpulence moyenne → perso 3D animé
  if (gender === "male" && bodyType === "average") {
    const modelPath = getExerciseModel(currentExercise?.name || "idle", level);
    return (
      <Avatar3D
        modelPath={modelPath}
        scale={0.8}
        width={300}
        height={300}
        positionX={0}
        positionY={-1.2}
      />
    );
  }

  // Emojis
  if (gender === "female") {
    if (bodyType === "average") return <span>👩</span>;
    if (bodyType === "thin") return <span>👧</span>;
    if (bodyType === "large") return <span>🤰</span>;
  }

  if (gender === "male") {
    if (bodyType === "thin") return <span>👦</span>;
    if (bodyType === "large") return <span>🫃🏻</span>;
  }

  // fallback
  return <span>🙂</span>;
}