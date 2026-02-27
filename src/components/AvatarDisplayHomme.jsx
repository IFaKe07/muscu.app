import React from "react";
import AvatarHomme from "./AvatarHomme";

// Normalise le texte
const normalize = (exo) => exo?.toLowerCase() || "idle";

// Renvoie le GLB selon l'exercice et le niveau
const getExerciseModel = (exercise, level) => {
  let prefix = "avatar";
  if (level >= 5) prefix = "avatar_lvl5";
  else if (level >= 3) prefix = "avatar_lvl3";

switch (exercise.toLowerCase()) {
  case "pompe": return `/models/${prefix}_pushup.glb`;
  case "squat": return `/models/${prefix}_squat.glb`;
  case "crunch": return `/models/${prefix}_crunch.glb`;
  case "planche": return `/models/${prefix}_plank.glb`;
  case "jumping jack": return `/models/${prefix}_jumpingjack.glb`;
  case "repos": 
  case "rest": return `/models/${prefix}_rest.glb`; // <- gère "rest" et "repos"
  default: return `/models/${prefix}_idle.glb`;
}
};

export default function AvatarDisplayHomme({ currentExercise, level }) {
  const exerciseName = normalize(currentExercise?.exo);
  const modelPath = getExerciseModel(exerciseName, level);

  return <AvatarHomme modelPath={modelPath} currentExercise={currentExercise} />;
}