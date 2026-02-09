"use client";

import React from "react";
import { motion } from "framer-motion";

// Circular/Round fireworks with perfect circular bursts
export default function CircularFireworks() {
  
  // Generate multiple circular bursts at different positions
  const circularBursts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120, // % from center - very wide spread
    y: (Math.random() - 0.5) * 100, // % from center
    delay: (i * 0.3) % 2.5, // Stagger delays for continuous effect
    size: 0.8 + Math.random() * 0.4,
    color: ['#ffd700', '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b9d', '#c7f0db'][i % 6],
    particleCount: 30 + Math.floor(Math.random() * 20) // 30-50 particles per burst
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden w-screen h-screen">
      {/* Multiple Circular Bursts */}
      {circularBursts.map(burst => (
        <motion.div
          key={`circular-burst-${burst.id}`}
          className="absolute"
          style={{ 
            left: `${50 + burst.x}%`, 
            top: `${50 + burst.y}%` 
          }}
        >
          {/* Create perfect circle of particles */}
          {Array.from({ length: burst.particleCount }).map((_, j) => {
            const angle = (360 / burst.particleCount) * j;
            const distance = 150 + Math.random() * 100;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            
            return (
              <motion.div
                key={j}
                className="absolute rounded-full will-change-transform"
                style={{ 
                  backgroundColor: burst.color,
                  width: `${burst.size}rem`,
                  height: `${burst.size}rem`,
                  boxShadow: `0 0 10px ${burst.color}, 0 0 20px ${burst.color}`
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: x,
                  y: y,
                  scale: [0, 1.2, 0.8, 0],
                  opacity: [1, 1, 0.8, 0]
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  delay: burst.delay,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 1.5
                }}
              />
            );
          })}
          
          {/* Center flash for each burst */}
          <motion.div
            className="absolute w-[8rem] h-[8rem] rounded-full blur-[30px] will-change-transform"
            style={{ backgroundColor: burst.color }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 3, 0],
              opacity: [0.9, 0.5, 0]
            }}
            transition={{ 
              duration: 1.2, 
              delay: burst.delay,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 1.5
            }}
          />
        </motion.div>
      ))}
      
      {/* Sparkle effects */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-[2.5rem] will-change-transform"
          initial={{ 
            x: 0, 
            y: 0,
            scale: 0,
            rotate: 0,
            opacity: 0
          }}
          animate={{
            x: (Math.random() - 0.5) * 1400, 
            y: (Math.random() - 0.5) * 900,
            scale: [0, 1.5, 0],
            rotate: 360,
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random(), 
            delay: i * 0.08,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          {['✨', '⭐', '💫'][Math.floor(Math.random() * 3)]}
        </motion.div>
      ))}
    </div>
  );
}
