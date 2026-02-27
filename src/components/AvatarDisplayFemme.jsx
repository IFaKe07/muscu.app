import React from "react";
import AvatarFemme from "./AvatarFemme";

/* ===== FONCTIONS UTILES ===== */

// Normalise le texte et assure une string
const normalize = (exo) => (typeof exo === "string" ? exo.toLowerCase() : "idle");

// Renvoie le chemin GLB selon l'exercice et le niveau
const getExerciseModel = (exercise, level) => {
  let prefix = "avatar_female"; // <- correction ici
  if (level >= 5) prefix = "avatar_female_lvl5";
  else if (level >= 3) prefix = "avatar_female_lvl3";

  switch (exercise.toLowerCase()) {
    case "pompe": return `/models/${prefix}_pushup.glb`;
    case "squat": return `/models/${prefix}_squat.glb`;
    case "crunch": return `/models/${prefix}_crunch.glb`;
    case "planche": return `/models/${prefix}_plank.glb`;
    case "jumping jack": return `/models/${prefix}_jumpingjack.glb`;
    case "repos": 
    case "rest": return `/models/${prefix}_rest.glb`;
    default: return `/models/${prefix}_idle.glb`;
  }
};

/* ===== COMPOSANT PRINCIPAL ===== */
export default function AvatarDisplayFemme({ currentExercise, level }) {
  // fallback si currentExercise ou exo est undefined
  const exerciseName = normalize(currentExercise?.exo || "idle");

  // fallback si level undefined
  const modelPath = getExerciseModel(exerciseName, level || 1);

  // Passe toujours un objet sûr à AvatarFemme
  const safeExercise = currentExercise || { exo: "idle" };

  return <AvatarFemme modelPath={modelPath} currentExercise={safeExercise} />;
}
