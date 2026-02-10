"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useAnimation, AnimatePresence, type Variants } from "framer-motion";
import { generateNumbers, selectRandomNumber, calculateRotation, shuffleAndRecolor, type WheelNumber } from "@/lib/wheel-data";
import { Button } from "@/components/ui/button";
import { Sparkles, Play } from "lucide-react";
import Fireworks from "./fireworks";
import EndGameCelebration from "./end-game-celebration";

interface LuckyWheelProps {
  onSpinStart?: () => void;
  onSpinEnd?: () => void;
  onReset?: () => void;
}

export default function LuckyWheel({ onSpinStart, onSpinEnd, onReset }: LuckyWheelProps) {
  const [remainingNumbers, setRemainingNumbers] = useState<WheelNumber[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize from LocalStorage
  React.useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('wheel-numbers');
    if (saved) {
      try {
        const parsedValues = JSON.parse(saved);
        if (Array.isArray(parsedValues) && parsedValues.length > 0) {
          setRemainingNumbers(generateNumbers(parsedValues));
          return;
        }
      } catch (e) {
        console.error("Failed to parse wheel numbers", e);
      }
    }
    // Default fallback
    setRemainingNumbers(generateNumbers());
  }, []);

  // Save to LocalStorage whenever remainingNumbers changes
  React.useEffect(() => {
    if (isClient && remainingNumbers.length > 0) {
        const values = remainingNumbers.map(n => n.value);
        localStorage.setItem('wheel-numbers', JSON.stringify(values));
    }
  }, [remainingNumbers, isClient]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showContinue, setShowContinue] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showEndGame, setShowEndGame] = useState(false);
  const rotationRef = React.useRef(0);
  const controls = useAnimation();
  const buttonControls = useAnimation(); // For counter-rotating the button

  // Force mechanic state
  const [force, setForce] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [spinDuration, setSpinDuration] = useState(4);
  const chargeStartTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const CHARGE_DURATION_MS = 2000; // 2 seconds for one full cycle (0→1→0)

  // Determine animation state
  const gameState = isSpinning ? 'spinning' : (showContinue ? 'won' : 'idle');

  // Variants for the left horse (Ngua Vang)
  const leftHorseVariants: Variants = {
    idle: {
      left: "-36%",
      x: 0,
      y: [0, -16, 0],
      scale: 1,
      transition: { 
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        left: { duration: 0.5, ease: "backOut" },
        x: { duration: 0.5, ease: "backOut" }
      }
    },
    spinning: {
      left: "50%", // Move to center
      x: "-90%", // Shift left by 90% of its own width so it ends just left of center
      y: 0, // No bounce needed - GIF has animation
      scale: 1.1,
      rotate: 0, // No rotation needed
      transition: { 
        duration: spinDuration, 
        ease: "easeInOut",
        left: { duration: spinDuration, ease: "easeInOut" },
        x: { duration: spinDuration, ease: "easeInOut" }
      }
    },
    won: {
      left: "50%",
      x: "-90%",
      scale: 1.3,
      rotate: [0, -5, 5, -5, 5, 0],
      y: [0, -20, 0],
      transition: { 
        y: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
        rotate: { duration: 0.5, repeat: Infinity },
        scale: { duration: 0.3 },
        left: { duration: 0 },
        x: { duration: 0 }
      }
    }
  };

  // Variants for the right horse (Ngua Do)
  const rightHorseVariants: Variants = {
    idle: {
      left: "100%",
      x: 0,
      y: [0, -16, 0],
      scale: 1,
      transition: { 
        y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        left: { duration: 0.5, ease: "backOut" },
         x: { duration: 0.5, ease: "backOut" }
      }
    },
    spinning: {
      left: "50%", // Move to center
      x: "-10%", // Shift left by 10% (so starts just right of center)
      y: 0, // No bounce needed - GIF has animation
      scale: 1.1,
      rotate: 0, // No rotation needed
      transition: { 
        duration: spinDuration, 
        ease: "easeInOut",
        left: { duration: spinDuration, ease: "easeInOut" },
        x: { duration: spinDuration, ease: "easeInOut" }
      }
    },
    won: {
      left: "50%",
      x: "-10%",
      scale: 1.3,
      rotate: [0, 5, -5, 5, -5, 0],
      y: [0, -20, 0],
      transition: { 
        y: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
        rotate: { duration: 0.5, repeat: Infinity },
        scale: { duration: 0.3 },
        left: { duration: 0 },
        x: { duration: 0 }
      }
    }
  };

  // --- Charge loop (ping-pong: 0→1→0→1→...) ---
  const updateCharge = useCallback(() => {
    const elapsed = performance.now() - chargeStartTimeRef.current;
    // Each half-cycle is CHARGE_DURATION_MS/2 ms (1s up, 1s down)
    const halfCycle = CHARGE_DURATION_MS / 2;
    const cyclePos = (elapsed % CHARGE_DURATION_MS) / halfCycle; // 0→2 repeating
    // ping-pong: 0→1 in first half, 1→0 in second half
    const progress = cyclePos <= 1 ? cyclePos : 2 - cyclePos;
    setForce(progress);
    animationFrameRef.current = requestAnimationFrame(updateCharge);
  }, []);

  const handlePointerDown = useCallback(() => {
    if (isSpinning || showContinue || remainingNumbers.length === 0) {
      if (remainingNumbers.length === 0) alert("Đã hết số!");
      return;
    }
    setIsCharging(true);
    setForce(0);
    chargeStartTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateCharge);
  }, [isSpinning, showContinue, remainingNumbers.length, updateCharge]);

  const cancelCharge = useCallback(() => {
    if (!isCharging) return;
    cancelAnimationFrame(animationFrameRef.current);
    setIsCharging(false);
    setForce(0);
  }, [isCharging]);

  const handlePointerUp = useCallback(async () => {
    if (!isCharging) return;
    cancelAnimationFrame(animationFrameRef.current);
    const currentForce = force;
    setIsCharging(false);

    // --- Spin with force ---
    setIsSpinning(true);
    setShowContinue(false);
    setShowFireworks(false);
    if (onSpinStart) onSpinStart();

    const selected = selectRandomNumber(remainingNumbers);

    // If only 1 number left, skip animation
    if (remainingNumbers.length === 1) {
      setSelectedNumber(selected.value);
      setShowFireworks(true);
      setShowContinue(true);
      setIsSpinning(false);
      setForce(0);
      if (onSpinEnd) onSpinEnd();
      return;
    }

    const { rotation: newRotation, duration } = calculateRotation(
      selected.value, remainingNumbers, rotationRef.current, currentForce
    );
    rotationRef.current = newRotation;
    setSpinDuration(duration); // Sync horse animation with wheel spin

    // Animate wheel spin with force-influenced duration
    await Promise.all([
      controls.start({
        rotate: newRotation,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1],
        },
      }),
      buttonControls.start({
        rotate: -newRotation,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1],
        },
      })
    ]);

    setSelectedNumber(selected.value);
    setShowFireworks(true);
    setShowContinue(true);
    setIsSpinning(false);
    setForce(0);
    if (onSpinEnd) onSpinEnd();
  }, [isCharging, force, remainingNumbers, controls, buttonControls, onSpinStart, onSpinEnd]);

  const handleContinue = () => {
    console.log("Continuing - removing:", selectedNumber);
    // Remove by VALUE, not index, then shuffle/recolor
    setRemainingNumbers(prev => {
      if (selectedNumber === null) return prev;
      console.log("Previous numbers:", prev);
      const filtered = prev.filter(n => n.value !== selectedNumber);
      console.log("After filter:", filtered);
      
      // If no numbers left, trigger end game
      if (filtered.length === 0) {
        setShowEndGame(true);
        // Don't restart wheel logic, just return empty to clear
      }
      
      const shuffled = shuffleAndRecolor(filtered);
      console.log("New shuffled numbers:", shuffled);
      return shuffled;
    });
    setSelectedNumber(null);
    setShowContinue(false);
    setShowFireworks(false);
  };

  const handleRestart = () => {
    setShowEndGame(false);
    setRemainingNumbers(generateNumbers());
    localStorage.removeItem('wheel-numbers'); // Clear saved state on manual restart from end screen? Or just let state update it.
    if (onReset) onReset();
  };

  const segmentAngle = 360 / remainingNumbers.length;

  return (
    <div className="relative flex flex-col items-center gap-6 w-full h-full justify-center">
      {/* End Game Celebration Overlay */}
      <AnimatePresence>
        {showEndGame && (
           <EndGameCelebration onRestart={handleRestart} />
        )}
      </AnimatePresence>

      {/* Fireworks (show only if NOT in end game to avoid double fireworks) */}
      {showFireworks && !showEndGame && <Fireworks />}
      
      {/* Main wheel container */}
      <div className="relative z-10 md:ml-60 xl:ml-100 w-[55rem] h-[55rem]">
        {/* Pointer (Arrow pointing DOWN into the wheel at 12 o'clock) */}
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none origin-center"
          style={{ marginTop: '-1rem' }} // Slight overlap to make it look connected
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Decorative petal-shaped arrow - Rotated 180deg to point down */}
          <svg 
            viewBox="0 0 60 80" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-[2.8125rem] h-[3.75rem] drop-shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.5)] rotate-180"
          >
            {/* Outer glow */}
            <path 
              d="M30 5 Q20 15, 15 30 Q10 45, 5 60 L30 75 L55 60 Q50 45, 45 30 Q40 15, 30 5 Z" 
              fill="#fbbf24" 
              opacity="0.3"
              filter="blur(4px)"
            />
            {/* Main petal shape with wavy edges */}
            <path 
              d="M30 8 Q22 18, 18 32 Q15 45, 12 58 C12 58, 18 65, 30 72 C42 65, 48 58, 48 58 Q45 45, 42 32 Q38 18, 30 8 Z" 
              fill="#f59e0b"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            {/* Inner highlight */}
            <path 
              d="M30 15 Q25 22, 23 32 Q22 40, 21 50 C21 50, 25 55, 30 60 C35 55, 39 50, 39 50 Q38 40, 37 32 Q35 22, 30 15 Z" 
              fill="#fcd34d"
              opacity="0.6"
            />
            {/* Center shine */}
            <ellipse cx="30" cy="35" rx="6" ry="15" fill="white" opacity="0.3" />
          </svg>
        </motion.div>

        {/* Wheel */}
        <motion.div
            animate={controls}
            className="relative w-full h-full rounded-full shadow-2xl shadow-glow-gold overflow-hidden"
            style={{
            background: `conic-gradient(from 0deg, ${remainingNumbers.map((num, i) => {
                const startAngle = i * segmentAngle;
                const endAngle = (i + 1) * segmentAngle;
                return `${num.color} ${startAngle}deg ${endAngle}deg`;
            }).join(', ')})`
            }}
        >
          {/* Decorative borders */}
          <div className="absolute inset-0 rounded-full border-[0.5rem] border-tet-gold-400 z-20" />
          <div className="absolute inset-[0.125rem] rounded-full border-[0.25rem] border-white z-20" />

          {/* Separator Lines */}
          {remainingNumbers.map((_, index) => {
            const rotateAngle = index * segmentAngle;
            return (
              <div
                key={`line-${index}`}
                className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-white/50 origin-bottom z-10"
                style={{
                  transform: `translateX(-50%) rotate(${rotateAngle}deg)`
                }}
              />
            );
          })}

          {/* Number labels */}
          {remainingNumbers.map((num, index) => {
            const angle = (index * segmentAngle) + (segmentAngle / 2);
            // Position text at edge (42% from center for optimal breathing room)
            const radiusPercent = 42; 
            const x = 50 + Math.cos((angle - 90) * Math.PI / 180) * radiusPercent;
            const y = 50 + Math.sin((angle - 90) * Math.PI / 180) * radiusPercent;

            return (
              <div
                key={num.value}
                className="absolute w-[3rem] md:w-[4rem] text-center z-10 flex items-center justify-center"
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`, // Keep text aligned with radius
                }}
              >
                <div 
                  className="text-[1.25rem] md:text-[1.75rem] font-black drop-shadow-sm"
                  style={{ 
                    color: num.textColor,
                  }}
                >
                  {num.value}
                </div>
              </div>
            );
          })}

          {/* Center circle - Spin Button */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <motion.div animate={buttonControls}>
                <motion.button
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={cancelCharge}
                  disabled={isSpinning || showContinue}
                  className="pointer-events-auto relative group cursor-pointer disabled:cursor-not-allowed select-none touch-none"
                  animate={{ scale: isCharging ? [1, 1.08, 1] : [1, 1.05, 1] }}
                  transition={{ 
                    duration: isCharging ? 0.3 : 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  whileHover={isCharging ? undefined : { scale: 1.15 }}
                >
                  {/* Pulse wave effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-yellow-400/50 blur-md opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
                  <div className="absolute -inset-4 rounded-full border-2 border-yellow-200 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 ease-out" />
                  
                  {/* Idle Glow */}
                  <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" />

                  {/* Charging ring glow */}
                  {isCharging && (
                    <motion.div
                      className="absolute -inset-2 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                      style={{
                        boxShadow: `0 0 ${20 + force * 40}px ${force > 0.7 ? 'rgba(239,68,68,0.8)' : force > 0.4 ? 'rgba(234,179,8,0.8)' : 'rgba(34,197,94,0.8)'}`,
                      }}
                    />
                  )}

                  <div 
                    className="w-[5rem] h-[5rem] md:w-[7rem] md:h-[7rem] rounded-full shadow-lg flex items-center justify-center border-[0.25rem] border-white relative z-10 group-hover:shadow-[0_0_2.5rem_rgba(251,191,36,0.8)] transition-shadow duration-300 bg-cover bg-center"
                    style={{ 
                      backgroundImage: "url('/tet-button.jpg')",
                    }}
                  >
                      
                  </div>
                </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Winner Popup Overlay */}
        <AnimatePresence>
          {showContinue && selectedNumber !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-gradient-to-br from-red-600 to-red-800 p-[2px] rounded-3xl shadow-2xl max-w-lg w-full"
              >
                  <div className="bg-white/10 backdrop-blur-md border-[2px] border-yellow-400/50 rounded-[1.4rem] pt-10 pb-8 px-8 flex flex-col items-center gap-6 text-center relative overflow-visible">
                    {/* Decorative corner patterns */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400 rounded-tl-xl opacity-50" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400 rounded-tr-xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 rounded-bl-xl opacity-50" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400 rounded-br-xl opacity-50" />
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="text-6xl"
                    >
                      🎊
                    </motion.div>

                    <h2
                      className="text-4xl md:text-5xl font-black uppercase leading-loose pt-2"
                      style={{
                        color: '#fde047',
                        textShadow: '0 0 20px rgba(253,224,71,0.6), 0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      Chúc Mừng!
                    </h2>
                    
                    <div className="space-y-2">
                      <p className="text-white/90 text-xl font-medium">Bạn đã quay trúng phần quà số</p>
                      <motion.div 
                        className="text-8xl font-black text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        {selectedNumber}
                      </motion.div>
                    </div>

                    <motion.button
                      onClick={handleContinue}
                      className="mt-4 group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative text-2xl font-bold text-red-900 flex items-center gap-2 cursor-pointer">
                        Tiếp tục <Play className="fill-red-900" />
                      </span>
                    </motion.button>
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Symmetrical Horses - Now Relative to Wheel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[75rem] pointer-events-none z-0 overflow-visible flex items-end justify-between px-[0.25rem] pb-[0.625rem]">
           {/* Horse 1 (Gold) - Left */}
           <motion.div 
             className="absolute bottom-0 left-[-36%] w-[18.75rem] h-[18.75rem]"
             variants={leftHorseVariants}
             initial={{ left: "-36%", x: 0, y: 0, scale: 1 }}
             animate={gameState}
           >
               <img 
                src={isSpinning ? "/ngua11-chay.gif" : "/ngua1.png"}
                className="w-full h-full object-contain drop-shadow-2xl" 
               />
           </motion.div>

           {/* Horse 2 (Red) - Right */}
           <motion.div 
             className="absolute bottom-0 left-[100%]  w-[18.75rem] h-[18.75rem]"
             variants={rightHorseVariants}
             initial={{ left: "100%", x: 0, y: 0, scale: 1 }}
             animate={gameState}
           >
               <img
                src={isSpinning ? "/ngua22-chay.gif" : "/ngua2.png"}
                className="w-full h-full object-contain drop-shadow-2xl"
               />
           </motion.div>
         </div>

        {/* Force Bar - positioned below the wheel */}
        <AnimatePresence>
          {(isCharging || force > 0) && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            >
              {/* Hint text */}
              <motion.p
                className="text-sm md:text-base font-bold text-yellow-200 tracking-wider uppercase whitespace-nowrap px-4 py-1.5 rounded-lg border border-yellow-400/40"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {force < 0.3 ? '🔥 Giữ để tăng lực!' : force < 0.7 ? '💪 Mạnh hơn nữa!' : '🚀 TỐI ĐA!'}
              </motion.p>

              {/* Force bar container */}
              <motion.div
                className="relative w-[16rem] md:w-[20rem] h-[1.5rem] md:h-[2rem] rounded-full overflow-hidden border-2 border-yellow-400/60"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
                animate={force > 0.85 ? { x: [0, -2, 2, -2, 2, 0] } : undefined}
                transition={force > 0.85 ? { duration: 0.15, repeat: Infinity } : undefined}
              >
                {/* Fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${force * 100}%`,
                    background: `linear-gradient(90deg,
                      #22c55e 0%,
                      #84cc16 25%,
                      #eab308 50%,
                      #f97316 75%,
                      #ef4444 100%)`,
                    boxShadow: force > 0.5
                      ? `0 0 ${10 + force * 20}px ${force > 0.7 ? 'rgba(239,68,68,0.6)' : 'rgba(234,179,8,0.6)'}`
                      : 'none',
                  }}
                  transition={{ type: 'tween', duration: 0.05 }}
                />

                {/* Gloss overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent" />

                {/* Tick marks */}
                {[0.25, 0.5, 0.75].map((tick) => (
                  <div
                    key={tick}
                    className="absolute top-0 bottom-0 w-[1px] bg-white/30"
                    style={{ left: `${tick * 100}%` }}
                  />
                ))}
              </motion.div>

              {/* Force percentage */}
              <span
                className="text-xs md:text-sm font-bold text-yellow-300 px-3 py-1 rounded-md border border-yellow-400/30"
                style={{ background: 'rgba(0,0,0,0.5)' }}
              >
                {Math.round(force * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
