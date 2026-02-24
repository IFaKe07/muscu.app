import { useEffect, useState } from "react";

export default function BackgroundGlow() {
  const [glows, setGlows] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const size = 50 + Math.random() * 100;
      const colors = ["#2ecc71", "#3498db", "#e74c3c", "#f1c40f"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const newGlow = { x, y, size, color, id: Date.now() };
      setGlows(prev => [...prev, newGlow]);

      setTimeout(() => {
        setGlows(prev => prev.filter(g => g.id !== newGlow.id));
      }, 1000);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {glows.map(glow => (
        <div
          key={glow.id}
          style={{
            position: "absolute",
            left: glow.x,
            top: glow.y,
            width: glow.size,
            height: glow.size,
            borderRadius: "50%",
            background: glow.color,
            filter: "blur(15px)",
            opacity: 0.6,
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        />
      ))}
    </div>
  );
}
