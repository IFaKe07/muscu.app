import { useState, useEffect, useRef } from "react";
import tadaSound from "./assets/sounds/tada.mp3";
import checkmarkSound from "./assets/sounds/checkmark.mp3";
import Avatar3D from "./components/Avatar3D";
import AvatarDisplay from "./components/AvatarDisplay";


export default function App() {
  const XP_PER_LEVEL = 500;
  const XP_PER_SESSION = 100;

  const [xp, setXp] = useState(() => Number(localStorage.getItem("xp")) || 0);
  const [gender, setGender] = useState(() => localStorage.getItem("gender"));
  const [bodyType, setBodyType] = useState(() => localStorage.getItem("bodyType"));
  const [screen, setScreen] = useState("menu");
  const [selectedDay, setSelectedDay] = useState(null);

   const [floatingXps, setFloatingXps] = useState([]);

  const [planning, setPlanning] = useState(() =>
    JSON.parse(localStorage.getItem("planning")) || {}
  );

  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem("history")) || []
  );

  const [showWorkout, setShowWorkout] = useState(false);
const [playWorkout, setPlayWorkout] = useState([]);

const [completedChallenges, setCompletedChallenges] = useState({});
const [floatingXp, setFloatingXp] = useState(null);


const [restTime, setRestTime] = useState(0);
const [isResting, setIsResting] = useState(false);

// Au début du composant App(), tu as déjà :
const [currentExercise, setCurrentExercise] = useState({ exo: "idle" });

const [restTimer, setRestTimer] = useState(0);
const [timerActive, setTimerActive] = useState(false);


useEffect(() => {
  if (screen === "day" && selectedDay) {
    const dayExercises = Array.isArray(planning[selectedDay]) ? planning[selectedDay] : [];
    setPlayWorkout(dayExercises);

    // mettre l'exo courant sur le premier non fait
    const nextExo = dayExercises.find(e => !e.done);
    setCurrentExercise({ exo: nextExo?.exo || "idle" });
  }
}, [screen, selectedDay]); // <- pas de planning ici !

  const emptyWorkout = Array.from({ length: 5 }, () => ({
    exo: "",
    sets: "",
    reps: "",
    done: false
  }));

  const availableExercises = ["Pompe", "Squat", "Crunch", "Planche", "Jumping Jack"];

  const [customWorkout, setCustomWorkout] = useState(emptyWorkout);
  const [animatedIndex, setAnimatedIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [xpAnim, setXpAnim] = useState(false);

  const [motivationMsg, setMotivationMsg] = useState(""); // phrase de motivation
const [actionMsg, setActionMsg] = useState(""); // message pour appliqué à tous les jours


  const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};



  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const [challengeXpAnim, setChallengeXpAnim] = useState(0);

  const [infoOverlay, setInfoOverlay] = useState(null);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const levelProgress = (xpInLevel / XP_PER_LEVEL) * 100;

  const playTada = () => { const a = new Audio(tadaSound); a.volume = 0.3; a.play(); };
  const playCheck = () => { const a = new Audio(checkmarkSound); a.volume = 0.25; a.play(); };

  // Au début de ton composant App(), avec les autres useState

const [activeXp, setActiveXp] = useState({}); // suivi du +XP par défi

const [challenges, setChallenges] = useState([
  { id: 1, text: "Faire 15 pompes", done: false },
  { id: 2, text: "Faire 20 squats", done: false },
  { id: 3, text: "Tenir 30 secondes de gainage", done: false },
]);

const [dailyChallenges, setDailyChallenges] = useState({
  pushups: false,
  squats: false,
  plank: false,
});


  const motivationMessages = [
    "Séance terminée 💪",
    "Bien joué, continue comme ça 🔥",
    "Un pas de plus vers ton objectif 🏋️",
    "Tu peux être fier de toi 👏",
    "Encore une victoire aujourd’hui ✅"
  ];

  // Descriptions exo avec texte aéré
  const exoInfo = {
    Pompe: [
      "Renforce la poitrine, les épaules et les triceps.",
      "Garde le corps droit et descends jusqu'à ce que la poitrine frôle le sol.",
      "Inspire en descendant, expire en poussant."
    ],
    Squat: [
      "Renforce les jambes et les fessiers.",
      "Descends en pliant les genoux comme si tu t'assois sur une chaise.",
      "Garde le dos droit et les talons au sol."
    ],
    Crunch: [
      "Renforce les abdominaux.",
      "Allonge-toi sur le dos, genoux pliés.",
      "Releve le haut du corps vers les genoux en expirant."
    ],
    Planche: [
      "Renforce les abdos, dos et épaules.",
      "Maintiens le corps droit en appui sur les avant-bras et les pointes de pieds.",
      "Garde la position aussi longtemps que possible."
    ],
    "Jumping Jack": [
      "Travaille le cardio et l’endurance.",
      "Saute en écartant les jambes et en levant les bras.",
      "Reviens en position initiale et répète rapidement."
    ]
  };

const dayData = selectedDay ? planning[selectedDay] : null;


useEffect(() => {
  if (!timerActive) return;

  const interval = setInterval(() => {
    setRestTimer(prev => {
      if (prev <= 1) {
        setTimerActive(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [timerActive]);


useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes floatXp {
      0% { opacity: 0; transform: translateY(0) scale(0.8); }
      30% { transform: translateY(-10px) scale(1.3); opacity: 1; }
      60% { transform: translateY(-25px) scale(1); }
      100% { opacity: 0; transform: translateY(-40px) scale(1); }
    }
  `;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
}, []);


  useEffect(() => { localStorage.setItem("planning", JSON.stringify(planning)); }, [planning]);
  useEffect(() => {
    localStorage.setItem("xp", xp);
    if (gender) localStorage.setItem("gender", gender);
    if (bodyType) localStorage.setItem("bodyType", bodyType);
    localStorage.setItem("history", JSON.stringify(history));
  }, [xp, gender, bodyType, history]);
  


const avatar = () => {
  const male = { thin: "𖨆", average: "🧍", large: "🫃🏻" };
  const female = { thin: "𖨆", average: "🧍‍♀️", large: "🤰" };
  const base = gender === "male" ? male : female;
  if (level < 3) return base?.[bodyType] || "❓";
  if (level < 6) return "💪";
  return "🏋️";
};

function getExerciseModel(exercise) {
  if (!exercise || !exercise.exo) return "/models/avatar_idle.glb";

  switch (exercise.exo) {
    case "Pompe":
      return "/models/avatar_pushup.glb";
    case "Squat":
      return "/models/avatar_squat.glb";
    case "Crunch":
      return "/models/avatar_crunch.glb";
    case "Planche":
      return "/models/avatar_plank.glb";
    case "Jumping Jack":
      return "/models/avatar_jumpingjack.glb";
    case "idle":
      return "/models/avatar_idle.glb";
    default:
      return "/models/avatar_idle.glb";
  }
}

function PopButton({ style, onClick, children }) {
    return (
      <button
        style={{ ...style, ...styles.popButtonStyle }}
        onClick={onClick}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {children}
      </button>
    );
  }
  /* ===== MENU ===== */
  if (screen === "menu") {
    return (
      <div style={styles.page}>
        <div style={styles.menuCard}>
        <PopButton
  style={{
    ...styles.menuBtn,
    borderRadius: 18
  }}
  onClick={() => setScreen("profile")}
>
  Profil
</PopButton>


          <h1>APPLI MUSCU</h1>
  <div style={styles.avatar}>
  {gender === "male" && bodyType === "average" ? (
    <Avatar3D
      modelPath="/models/avatar_idle.glb"
      scale={0.8}
      positionY={-1.2}
      width={300}
      height={300}
    />
  ) : (
    <AvatarDisplay gender={gender} bodyType={bodyType} level={level} />
  )}
</div>

          <div style={styles.bar}>
            <div style={{ ...styles.fill, width: `${levelProgress}%` }} />
          </div>
          <p>Niveau {level} — {xpInLevel}/{XP_PER_LEVEL} XP</p>
         <div style={styles.menuButtons}>
  <PopButton style={styles.btn} onClick={() => setScreen("calendar")}>Calendrier</PopButton>
  <PopButton style={styles.btn} onClick={() => setScreen("history")}>Historique</PopButton>
  <PopButton style={styles.btn} onClick={() => setScreen("challenges")}>
  Défis
</PopButton>

</div>

        </div>
      </div>
    );
  }

  /* ===== SEXE ===== */
  if (screen === "gender") {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <h2>Choisis ton sexe</h2>
          <button style={styles.btn} onClick={() => { setGender("male"); setScreen("menu"); }}>Homme</button>
          <button style={styles.btn} onClick={() => { setGender("female"); setScreen("menu"); }}>Femme</button>
        </div>
      </div>
    );
  }

  /* ===== CORPULENCE ===== */
  if (screen === "body") {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <h2>Ta corpulence</h2>
          <button style={styles.btn} onClick={() => { setBodyType("thin"); setScreen("menu"); }}>Mince</button>
          <button style={styles.btn} onClick={() => { setBodyType("average"); setScreen("menu"); }}>Moyenne</button>
          <button style={styles.btn} onClick={() => { setBodyType("large"); setScreen("menu"); }}>Large</button>
        </div>
      </div>
    );
  }

/* ===== DANS LE RENDER PRINCIPAL ===== */
if (screen === "calendar") {
  return <Calendar />;
}

/* ===== COMPOSANT CALENDRIER ===== */
function Calendar() {
  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];

  const calendarRef = useRef(null);
  const savedScrollRef = useRef(0); // ← sauvegarde du scroll

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isDayCompleted = (key) => {
    const dayData = planning[key];
    if (!Array.isArray(dayData)) return false;
    return dayData.every(exo => exo.done);
  };

  const getDayStatus = (key) => {
    const dayData = planning[key];
    if (dayData === "rest") return "blue";
    if (isDayCompleted(key)) return "green";
    return "gray";
  };

  const amplitude = 140;
  const horizontalOffset = 60;
  const period = 6;
  const verticalSpacing = 280;
  const offsetTop = 100;

  const getNodePosition = (index) => ({
    top: offsetTop + index * verticalSpacing,
    left: amplitude * Math.sin((index / period) * 2 * Math.PI) + horizontalOffset
  });

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  // Restaure le scroll une seule fois après montage
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollTop = savedScrollRef.current;
    }
  }, []);

  const handleDayClick = (key) => {
    if (calendarRef.current) savedScrollRef.current = calendarRef.current.scrollTop;
    setSelectedDay(key);
    setScreen("day");
  };

  return (
    <div style={{ ...styles.page, overflowY: "auto" }} ref={calendarRef}>
      <div style={styles.workoutCard}>
        <button
          style={{ ...styles.menuBtn, ...styles.popButtonStyle }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => setScreen("menu")}
        >
          Menu
        </button>

        {/* En-tête mois */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:40 }}>
          <PopButton
            style={styles.mapArrowBtn}
            onClick={() => {
              if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
              else setCalendarMonth(calendarMonth - 1);
            }}
          >
            ◀
          </PopButton>

          <h2 style={{ color: "#fff", margin: 0 }}>
            {monthNames[calendarMonth]} {calendarYear}
          </h2>

          <PopButton
            style={styles.mapArrowBtn}
            onClick={() => {
              if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
              else setCalendarMonth(calendarMonth + 1);
            }}
          >
            ▶
          </PopButton>
        </div>

        {/* Conteneur serpent */}
        <div style={{ ...styles.mapContainer, height: daysArray.length * verticalSpacing + offsetTop + 50, display:"flex", justifyContent:"center" }}>
          <div style={{ position:"relative", width: amplitude * 2 }}>
            {/* Chemin serpent */}
            <svg
              width={amplitude * 2}
              height={daysArray.length * verticalSpacing + offsetTop + 50}
              style={{ position:"absolute", top:0, left:0, zIndex:0 }}
            >
              {daysArray.slice(0, -1).map((_, i) => {
                const p1 = getNodePosition(i);
                const p2 = getNodePosition(i + 1);
                const cx = (p1.left + p2.left) / 2;
                return (
                  <path
                    key={i}
                    d={`M ${p1.left+80} ${p1.top+80} Q ${cx+80} ${(p1.top+p2.top)/2} ${p2.left+80} ${p2.top+80}`}
                    fill="none"
                    stroke="#444"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {daysArray.map((day, i) => {
              const key = `${calendarYear}-${String(calendarMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const status = getDayStatus(key);
              const pos = getNodePosition(i);
              const isTodayNode = key === todayKey;

              return (
                <div
                  key={i}
                  style={{
                    ...styles.node,
                    width: 160,
                    height: 160,
                    left: pos.left,
                    top: pos.top,
                    background: status === "green"
                      ? "linear-gradient(145deg, #2ecc71, #27ae60)"
                      : status === "blue"
                      ? "linear-gradient(145deg, #3498db, #2980b9)"
                      : "linear-gradient(145deg, #666, #444)",
                    fontSize: 32,
                    border: isTodayNode ? "6px solid #f1c40f" : "none",
                    boxShadow: isTodayNode
                      ? "0 8px 25px rgba(241,196,15,0.8), inset 0 2px 4px rgba(255,255,255,0.2)"
                      : "8px 8px 15px rgba(0,0,0,0.4), inset -4px -4px 6px rgba(255,255,255,0.1)",
                  }}
                  onClick={() => handleDayClick(key)}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== JOUR ===== */
if (screen === "day") {

  if (!selectedDay) {
    return (
      <div style={styles.page}>
        <div style={styles.workoutCard}>
          <p>Aucun jour sélectionné.</p>
          <button style={styles.menuBtn} onClick={() => setScreen("calendar")}>← Calendrier</button>
        </div>
      </div>
    );
  }



  // Après avoir complété un exo
  const completeExo = (i) => {
    setPlayWorkout(prev => {
      const copy = [...prev];
      copy[i].done = true;
 playCheck();
      // trouve le prochain exo non fait
   const nextExo = copy.find(e => !e.done);

if (nextExo) {
  // Si le prochain exo a un temps de repos défini, le lancer
  if (nextExo.rest && nextExo.rest > 0) {
    setRestTimer(nextExo.rest);
    setTimerActive(true);
  }

  setCurrentExercise({ exo: nextExo.exo });
} else {
  setCurrentExercise({ exo: "idle" });
}

      // si tous faits
      if (copy.every(e => e.done)) {
        playTada();
        setXp(x => x + XP_PER_SESSION);
        setMotivationMsg(
          motivationMessages[Math.floor(Math.random() * motivationMessages.length)]
        );
        setXpAnim(true);

        // met à jour planning et history
        setPlanning(prevPlan => ({ ...prevPlan, [selectedDay]: copy }));
        const newEntry = {
          day: selectedDay,
          date: new Date().toISOString(),
          type: "workout",
          xp: XP_PER_SESSION,
          exercises: copy
        };
        setHistory(prev => [newEntry, ...prev]);

        setTimeout(() => setXpAnim(false), 1000);

        // exo idle à la fin
        setCurrentExercise({ exo: "idle" });
      }

      return copy;
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.workoutCard}>
        <PopButton
          style={styles.menuBtn}
          onClick={() => setScreen("calendar")}
        >
          ← Calendrier
        </PopButton>

        <h2>{selectedDay}</h2>

        {/* Avatar + barre XP */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          <div style={styles.avatar}>
            {gender === "male" && bodyType === "average" ? (
              <Avatar3D
                modelPath={getExerciseModel(currentExercise)}
                scale={0.8}
                positionY={-1.2}
                width={300}
                height={300}
              />
            ) : (
              <AvatarDisplay gender={gender} bodyType={bodyType} level={level} />
            )}
          </div>

          <div style={styles.bar}>
            <div style={{ ...styles.fill, width: `${levelProgress}%` }} />
          </div>
          <p>Niveau {level} — {xpInLevel}/{XP_PER_LEVEL} XP</p>
        </div>

        {/* Messages selon le type de jour */}
        {dayData === "rest" && <p>🌙 Jour de repos</p>}
        {Array.isArray(dayData) && dayData.length === 0 && <p>Aucune séance définie</p>}
        {!dayData && dayData !== "rest" && <p>Aucune séance définie</p>}

        {/* Boutons Créer/Modifier et Jour de repos */}
        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <PopButton
            style={styles.btn}
            onClick={() => {
              setCustomWorkout(
                Array.isArray(dayData)
                  ? dayData.map(e => ({ ...e, done: false }))
                  : emptyWorkout
              );
              setScreen("customWorkout");
            }}
          >
            Créer / modifier séance
          </PopButton>

          <PopButton
            style={styles.btn}
            onClick={() => {
              setPlanning({ ...planning, [selectedDay]: "rest" });
              setXp(x => x + XP_PER_SESSION);
              setXpAnim(true);
              setMessage("Jour de repos : +100 XP ! 😎");
              const newEntry = { day: selectedDay, date: new Date().toISOString(), type: "rest", xp: XP_PER_SESSION };
              setHistory([newEntry, ...history]);
              setTimeout(() => setXpAnim(false), 1000);
            }}
          >
            Jour de repos
          </PopButton>
        </div>

        {/* Exos */}
        {Array.isArray(dayData) && dayData.length > 0 && (
          <div style={{ marginTop: 20 }}>
            {playWorkout.map((e, i) => (
              <div key={i} style={styles.exerciseRow}>
                <span style={{ opacity: e.done ? 0.4 : 1 }}>
                  {e.exo} — {e.sets} x {e.reps}
                </span>
                {!e.done && (
                  <button
                    style={{
                      ...styles.exoBtn,
                      transform: animatedIndex === i ? "scale(1.2)" : "scale(1)",
                      boxShadow: animatedIndex === i ? "0 0 20px #2ecc71" : "none"
                    }}
                    onClick={() => completeExo(i)}
                  >
                    ✔
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        {actionMsg && (
          <p style={{ marginTop: 20, color: "#3498db", fontWeight: "bold", textAlign: "center" }}>
            {actionMsg}
          </p>
        )}

        {!actionMsg && motivationMsg && (
          <p style={{ marginTop: 20, color: "#2ecc71", fontWeight: "bold", textAlign: "center" }}>
            {motivationMsg}
          </p>
        )}

        {xpAnim && (
          <div style={{ position: "absolute", top: 10, right: 20, color: "#2ecc71", fontWeight: "bold" }}>
            +{XP_PER_SESSION} XP
          </div>
        )}
      </div>

      {/* TIMER EN OVERLAY FIXE */}
      {timerActive && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#111",
            color: "#fff",
            padding: 20,
            borderRadius: 16,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold"
          }}>
            ⏱ Temps de repos : {restTimer}s
            <div style={{ fontSize: 50, marginTop: 10 }}>🛌</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== CREATION SEANCE ===== */
if (screen === "customWorkout") {

  // Met à jour un champ d'un slot
  const update = (i, field, value) => {
    const copy = [...customWorkout];
    copy[i] = { ...copy[i], [field]: value };
    setCustomWorkout(copy);
  };

  // Drag & Drop pour les exercices
  const handleDrop = (i, e) => {
    e.preventDefault();
    const exo = e.dataTransfer.getData("text/plain");
    const copy = [...customWorkout];
    copy[i].exo = exo;
    setCustomWorkout(copy);
  };

  // Overlay infos exos
  const showInfo = (exo) => setInfoOverlay(exo);
  const closeInfo = () => setInfoOverlay(null);

const applyToAllSameWeekdays = () => {
  if (!selectedDay) return;

const clean = customWorkout
  .filter(e => e.exo && e.sets && e.reps)
  .map(e => ({
    ...e,
    done: false   // reset obligatoire
  }));

setPlanning({ ...planning, [selectedDay]: clean });
setScreen("day");

  const date = new Date(selectedDay);
  const targetDay = date.getDay();

  setPlanning(prev => {
    const newPlanning = { ...prev };
    const today = new Date(selectedDay); // on part du jour sélectionné
    today.setHours(0,0,0,0);

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i); // seulement les jours **après ou égal à selectedDay**
      if (d.getDay() === targetDay) {
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        newPlanning[key] = clean.map(e => ({ ...e, done: false }));
      }
    }

    return newPlanning;
  });

 setMotivationMsg(""); // on vide la phrase de motivation
setActionMsg(`Séance appliquée à tous les ${["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"][targetDay]} ✅`);
setScreen("day");

};


  return (
    <div style={styles.page}>
      <div style={styles.workoutCard}>
       <PopButton
  style={styles.menuBtn}
  onClick={() => setScreen("day")}
>
  ← Jour
</PopButton>


        <h2>Séance du {selectedDay}</h2>

        {actionMsg && (
  <p style={{ marginTop: 20, color: "#3498db", fontWeight: "bold", textAlign: "center" }}>
    {actionMsg}
  </p>
)}


        {/* SLOTS POUR LES EXOS */}
       {customWorkout.map((slot, i) => (
  <div
    key={i}
    style={styles.slotRow}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDrop(i, e)}
  >
    <div style={styles.slotDisplay}>
      {slot.exo || "Déposer exo ici"}
    </div>
    <input
      style={styles.input}
      placeholder="Séries"
      value={slot.sets}
      onChange={e => update(i, "sets", e.target.value)}
    />
    <input
      style={styles.input}
      placeholder="Répétitions"
      value={slot.reps}
      onChange={e => update(i, "reps", e.target.value)}
    />
    {/* ✅ Nouveau champ Timer */}
   <input
  style={styles.input}
  placeholder="Repos en sec"
  value={slot.rest || ""}
  onChange={e => update(i, "rest", Number(e.target.value))}
/>

  </div>
))}


        {/* EXERCICES DISPONIBLES POUR DRAG & DROP */}
        <div style={styles.vignettesContainer}>
          {availableExercises.map((ex, i) => (
            <div
              key={i}
              style={styles.vignette}
              draggable
              onDragStart={e => e.dataTransfer.setData("text/plain", ex)}
            >
              <span>{ex}</span>
              <div
                style={styles.infoInsideVignette}
                onClick={() => showInfo(ex)}
              >
                i
              </div>
            </div>
          ))}
        </div>

        {/* BOUTON SAUVEGARDER CE JOUR */}
       <PopButton
  style={{ ...styles.btn, marginTop: 20 }}
  onClick={() => {
const clean = customWorkout
  .filter(e => e.exo && e.sets && e.reps)
  .map(e => ({
    ...e,
    done: false   // reset obligatoire
  }));

setPlanning({ ...planning, [selectedDay]: clean });
setScreen("day");
  }}
>
  Sauvegarder
</PopButton>


        {/* BOUTON APPLIQUER À TOUS LES SAMEDIS */}
       <PopButton
  style={{ ...styles.btn, background: "#3498db", marginTop: 10 }}
  onClick={applyToAllSameWeekdays}
>
  Appliquer à tous les jours correspondants
</PopButton>



        {/* OVERLAY INFOS EXOS */}
        {infoOverlay && (
          <div style={styles.overlay} onClick={closeInfo}>
            <div style={styles.overlayCard} onClick={e => e.stopPropagation()}>
              <h3>{infoOverlay}</h3>
              {exoInfo[infoOverlay].map((line, i) => (
                <p key={i}>• {line}</p>
              ))}
             <PopButton
  style={styles.btn}
  onClick={closeInfo}
>
  Fermer
</PopButton>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

  /* ===== HISTORIQUE ===== */
  if(screen==="history"){
    return (
      <div style={styles.page}>
        <div style={styles.workoutCard}>
          <button style={styles.menuBtn} onClick={()=>setScreen("menu")}>Menu</button>
          <h2>Historique des séances</h2>
          {history.length===0 && <p>Aucune séance terminée pour le moment.</p>}
          <div style={{marginTop:20,textAlign:"left"}}>
            {history.map((entry,i)=>(
              <div key={i} style={{padding:10,borderBottom:"1px solid #333"}}>
                <p><strong>{entry.day}</strong> — {entry.type==="rest"?"Repos":"Workout"} — +{entry.xp} XP</p>
                <small>{new Date(entry.date).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
/* ===== PROFIL ===== */
if (screen === "profile") {
  // fonction pour style dynamique des boutons sélectionnés
  const getSelectedStyle = (isSelected) => ({
    background: isSelected ? "#1abc9c" : "#2ecc71", // bleu clair si sélectionné, vert sinon
    border: isSelected ? "2px solid #fff" : "none",
    borderRadius:12,
    padding:"10px 16px",
    color:"#fff",
    cursor:"pointer",
    fontSize:14,
    minWidth:100,
    flex:1,
    transition:"all 0.2s"
  });

  return (
    <div style={styles.page}>
      <div style={styles.centerCard}>
        {/* Avatar + niveau */}
        <div style={{textAlign:"center", marginBottom:30}}>
       <div style={styles.avatar}>
  <AvatarDisplay gender={gender} bodyType={bodyType} level={level} />
</div>

          <p>Niveau {level} — {xpInLevel}/{XP_PER_LEVEL} XP</p>
        </div>

        {/* Sexe */}
        <div style={{marginBottom:20}}>
          <h3 style={{textAlign:"center"}}>Sexe</h3>
          <div style={{display:"flex", justifyContent:"center", gap:10}}>
          <PopButton
  style={getSelectedStyle(gender === "male")}
  onClick={() => setGender("male")}
>
  Homme
</PopButton>

<PopButton
  style={getSelectedStyle(gender === "female")}
  onClick={() => setGender("female")}
>
  Femme
</PopButton>


          </div>
        </div>

        {/* Corpulence */}
        <div style={{marginBottom:30}}>
          <h3 style={{textAlign:"center"}}>Corpulence</h3>
          <div style={{display:"flex", justifyContent:"center", gap:10}}>
           <PopButton style={getSelectedStyle(bodyType === "thin")} onClick={() => setBodyType("thin")}>
  Mince
</PopButton>

<PopButton style={getSelectedStyle(bodyType === "average")} onClick={() => setBodyType("average")}>
  Moyenne
</PopButton>

<PopButton style={getSelectedStyle(bodyType === "large")} onClick={() => setBodyType("large")}>
  Large
</PopButton>

          </div>
        </div>

        {/* Bouton retour */}
        <div style={{textAlign:"center"}}>
          <PopButton
  style={styles.profileBtnSingle}
  onClick={() => setScreen("menu")}
>
  Retour au menu
</PopButton>

        </div>
      </div>
    </div>
  );
}



/* ===== CHALLENGES ===== */
if (screen === "challenges") {
  // Fonction pour compléter un défi
  const completeChallenge = (key, xpReward) => {
    if (dailyChallenges[key]) return; // déjà fait

    playCheck(); // 🔊 son de validation

    // Ajouter l'XP
    setXp(x => x + xpReward);

    // Animation XP flottante
    const id = Date.now();
    setFloatingXp({ id, key, xp: xpReward });
    setTimeout(() => setFloatingXp(null), 1200);

    // Marquer le défi comme terminé
    setDailyChallenges(prev => ({ ...prev, [key]: true }));
  };

  const challengeStyle = (done) => ({
    background: done ? "#1a1a1a" : "#222",
    opacity: done ? 0.5 : 1,
    textDecoration: done ? "line-through" : "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  });

  return (
    <div style={styles.page}>
      <div style={styles.workoutCard}>
        <PopButton style={styles.menuBtn} onClick={() => setScreen("menu")}>
          ← Menu
        </PopButton>

        <h2>Défis journaliers</h2>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          
          {/* Défi Pompes */}
          <div style={challengeStyle(dailyChallenges.pushups)}>
            <p>💪 Faire 15 pompes</p>
            <div style={{ position: "relative" }}>
              <button
                style={{ ...styles.exoBtn, opacity: dailyChallenges.pushups ? 0.5 : 1 }}
                disabled={dailyChallenges.pushups}
                onClick={() => completeChallenge("pushups", 20)}
              >
                {dailyChallenges.pushups ? "✅" : "Valider"}
              </button>

              {floatingXp?.key === "pushups" && (
                <div style={{ ...styles.xpStyle, top: -20, right: -10 }}>
                  +{floatingXp.xp} XP
                </div>
              )}
            </div>
          </div>

          {/* Défi Squats */}
          <div style={challengeStyle(dailyChallenges.squats)}>
            <p>🦵 Faire 30 squats</p>
            <div style={{ position: "relative" }}>
              <button
                style={{ ...styles.exoBtn, opacity: dailyChallenges.squats ? 0.5 : 1 }}
                disabled={dailyChallenges.squats}
                onClick={() => completeChallenge("squats", 30)}
              >
                {dailyChallenges.squats ? "✅" : "Valider"}
              </button>

              {floatingXp?.key === "squats" && (
                <div style={{ ...styles.xpStyle, top: -20, right: -10 }}>
                  +{floatingXp.xp} XP
                </div>
              )}
            </div>
          </div>

          {/* Défi Gainage */}
          <div style={challengeStyle(dailyChallenges.plank)}>
            <p>🔥 Tenir 1 min de gainage</p>
            <div style={{ position: "relative" }}>
              <button
                style={{ ...styles.exoBtn, opacity: dailyChallenges.plank ? 0.5 : 1 }}
                disabled={dailyChallenges.plank}
                onClick={() => completeChallenge("plank", 40)}
              >
                {dailyChallenges.plank ? "✅" : "Valider"}
              </button>

              {floatingXp?.key === "plank" && (
                <div style={{ ...styles.xpStyle, top: -20, right: -10 }}>
                  +{floatingXp.xp} XP
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



  return null;
}

/* ===== STYLES ===== */
const styles={
  page:{minHeight:"100vh",background:"#000",display:"flex",justifyContent:"center",alignItems:"center",padding:20},
  menuCard:{background:"#111",color:"#fff",padding:40,borderRadius:20,width:"90%",maxWidth:600,minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",gap:20, position:"relative"},
  centerCard:{background:"#111",color:"#fff",padding:30,borderRadius:20,width:"90%",maxWidth:500,minHeight:"70vh",display:"flex",flexDirection:"column",gap:20,textAlign:"center"},
  workoutCard:{background:"#111",color:"#fff",padding:30,borderRadius:20,width:"95%",maxWidth:900,minHeight:"85vh",position:"relative",textAlign:"center"},
  avatar:{fontSize:100,marginBottom:20},
  profileBtn:{position:"absolute",top:15,left:15,background:"#2ecc71",border:"none",padding:"8px 14px",color:"#fff",borderRadius:10,fontSize:14,cursor:"pointer"},
  profileBtnSmall:{background:"#2ecc71",border:"none",padding:"10px 16px",borderRadius:12,color:"#fff",cursor:"pointer",fontSize:14,minWidth:100,flex:1,transition:"all 0.2s"},
  btn:{background:"#2ecc71",border:"none",padding:"14px 20px",borderRadius:16,color:"#fff",cursor:"pointer",fontSize:16,minWidth:120,transition:"all 0.2s",flex:1},
  exoBtn:{background:"#2ecc71",border:"none",padding:"8px 12px",borderRadius:12,color:"#fff",cursor:"pointer",fontSize:16,minWidth:0,width:"auto",flex:"none",transition:"all 0.2s"},
  menuBtn:{position:"absolute",top:15,right:15,background:"#2ecc71",border:"none",padding:"8px 14px",color:"#fff",borderRadius:10,fontSize:14},
  menuButtons:{display:"flex",flexDirection:"column",gap:16,width:"100%"},
  weekGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,marginTop:20},
  profileBtnSingle:{background:"#2ecc71",border:"none",padding:"10px 16px",borderRadius:12,color:"#fff",cursor:"pointer",fontSize:14,minWidth:120,transition:"all 0.2s"},
  slotRow:{display:"flex",gap:10,justifyContent:"center",marginTop:12,flexWrap:"wrap"},
  slotDisplay:{background:"#222",color:"#fff",padding:10,borderRadius:10,minWidth:120,textAlign:"center"},
  select:{padding:10,borderRadius:10,minWidth:100},
  input:{padding:10,borderRadius:10,width:90},
  bar:{height:18,background:"#333",borderRadius:10,overflow:"hidden",width:"100%",marginTop:10},
  fill:{height:"100%",background:"#2ecc71",transition:"width 0.3s ease"},
  exerciseRow:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#1b1b1b",padding:12,borderRadius:12,marginTop:8},
  calendarGrid:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8,marginTop:20},
  dayCell:{padding:10,borderRadius:8,textAlign:"center",cursor:"pointer",color:"#fff",userSelect:"none"},
  dayLabel:{textAlign:"center",fontWeight:"bold",color:"#fff"},
  arrowBtn:{background:"#333",border:"none",padding:"4px 10px",color:"#fff",borderRadius:6,cursor:"pointer"},
  vignettesContainer:{display:"flex",gap:10,flexWrap:"wrap",marginTop:20,justifyContent:"center"},
  vignette:{padding:10,borderRadius:10,background:"#2ecc71",color:"#fff",cursor:"grab", display:"flex",alignItems:"center",justifyContent:"space-between",minWidth:120},
  infoInsideVignette:{background:"#27ae60",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"bold",cursor:"pointer",marginLeft:10,flexShrink:0},
  infoBtn:{background:"#3498db",border:"none",color:"#fff",borderRadius:6,padding:"4px 8px",cursor:"pointer"},
  overlay:{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1000},
  /* ===== STYLES CALENDRIER ===== */
overlayCard:{background:"#222",padding:20,borderRadius:16,minWidth:300,maxWidth:500,textAlign:"left"}, // ← virgule ajoutée
mapContainer:{position:"relative",width:"100%",height:"1500px",marginTop:20}, // plus grand pour scroller
node:{position:"absolute",borderRadius:"50%",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontWeight:"bold",userSelect:"none",transition:"0.3s",boxShadow:"0 2px 5px rgba(0,0,0,0.5)",zIndex:2},
mapArrowBtn:{background:"#333",border:"none",padding:"4px 10px",color:"#fff",borderRadius:6,cursor:"pointer"},

// Effet pop / relief pour tous les boutons
popButtonStyle: {
  transition: "all 0.2s ease-out",
  cursor: "pointer",
  boxShadow: "0 5px 10px rgba(0,0,0,0.3)"
},

challengeStyle: {
  background: "#222",
  padding: 20,
  borderRadius: 12,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
},

xpStyle: {
  position: "absolute",
  right: -10,        // un peu à côté du bouton
  top: 0,            // départ du bouton
  color: "#2ecc71",
  fontWeight: "bold",
  pointerEvents: "none",
  animation: "floatXp 1.2s forwards",  // animation visible et garde sa position finale
}




}
