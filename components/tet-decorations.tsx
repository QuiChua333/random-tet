"use client";

import React, { useEffect, useState } from "react";

export default function TetDecorations() {
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; type: string }>>([]);

  useEffect(() => {
    // Generate random petals (increased density)
    const newPetals = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      type: Math.random() > 0.5 ? '🌸' : '🏵️', // 50% chance for Hoa Mai (Apricot)
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Falling plum/apricot blossom petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute opacity-90 pointer-events-none"
          style={{
            left: `${petal.left}%`,
            top: "-10vh",
            animationName: "petal-fall",
            animationDuration: `${8 + Math.random() * 4}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${petal.delay}s`,
            width: 'auto',
            fontSize: '1.5rem',
          }}
        >
          {petal.type}
        </div>
      ))}
      
      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-6xl opacity-50 animate-float">
        🎋
      </div>
      <div className="absolute top-4 right-4 text-6xl opacity-50 animate-float" style={{ animationDelay: "1.5s" }}>
        🎋
      </div>
      <div className="absolute bottom-4 left-4 text-5xl opacity-40">
        🧨
      </div>
      <div className="absolute bottom-4 right-4 text-5xl opacity-40">
        🧨
      </div>
    </div>
  );
}
