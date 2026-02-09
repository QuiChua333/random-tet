"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Fireworks() {

  // Generate random firework particles - OPTIMIZED COUNT
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    angle: Math.random() * 360,
    distance: 100 + Math.random() * 800, 
    delay: Math.random() * 0.5,
    size: 0.5 + Math.random() * 1.0, 
    color: [
      '#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#10b981', 
      '#3b82f6', '#8b5cf6', '#ffffff', '#ffd700'
    ][Math.floor(Math.random() * 9)]
  }));

  // Bursts (multiple explosions) - OPTIMIZED
  const bursts = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 80, // % from center
    y: (Math.random() - 0.5) * 80, // % from center
    delay: i * 0.3,
    color: ['#fbbf24', '#ef4444', '#10b981'][i % 3]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden w-screen h-screen">
      {/* Multiple Bursts */}
      {bursts.map(burst => (
        <motion.div
           key={`burst-${burst.id}`}
           className="absolute w-[2px] h-[2px]"
           style={{ 
             left: `${50 + burst.x}%`, 
             top: `${50 + burst.y}%` 
           }}
        >
             {Array.from({ length: 12 }).map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute rounded-full will-change-transform"
                  style={{ 
                    backgroundColor: burst.color,
                    width: '0.4rem',
                    height: '0.4rem'
                  }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 300,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 0.8 + Math.random(),
                    delay: burst.delay,
                    ease: "easeOut"
                  }}
                />
             ))}
        </motion.div>
      ))}

      {/* Main Central Firework particles */}
      {particles.map((particle) => {
        const x = Math.cos((particle.angle * Math.PI) / 180) * particle.distance;
        const y = Math.sin((particle.angle * Math.PI) / 180) * particle.distance;
        
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full will-change-transform"
            style={{ 
              backgroundColor: particle.color,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
              boxShadow: `0 0 4px ${particle.color}` // Reduced blur radius for performance
            }}
            initial={{ 
              x: 0, 
              y: 0,
              scale: 0,
              opacity: 1
            }}
            animate={{
              x: x,
              y: y,
              scale: [0, 1, 0],
              opacity: [1, 1, 0]
            }}
            transition={{ 
              duration: 1.2 + Math.random() * 0.8, 
              delay: particle.delay,
              ease: "circOut"
            }}
          />
        );
      })}
      
      {/* Center huge burst */}
      <motion.div
        className="absolute w-[10rem] h-[10rem] rounded-full bg-yellow-400 blur-[40px] will-change-transform" // Use standard blur value
        initial={{ scale: 0, opacity: 1 }}
        animate={{ 
          scale: [0, 4, 0],
          opacity: [0.8, 0.4, 0]
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Sparkle effects - OPTIMIZED */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-[3rem] will-change-transform"
          initial={{ 
            x: 0, 
            y: 0,
            scale: 0,
            rotate: 0,
            opacity: 0
          }}
          animate={{
            x: (Math.random() - 0.5) * 1200, 
            y: (Math.random() - 0.5) * 800,
            scale: [0, 1.2, 0],
            rotate: 360,
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5 + Math.random(), 
            delay: i * 0.1,
            ease: "easeOut"
          }}
        >
          {['✨', '⭐'][Math.floor(Math.random() * 2)]}
        </motion.div>
      ))}
    </div>
  );
}
