"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import Fireworks from './fireworks';
import CircularFireworks from './circular-fireworks';
import { useAudioState } from './background-music';

// --- Premium 3D Text Reveal Component ---
interface SplitText3DProps {
  text: string;
  className?: string;
  delay?: number;
}

const SplitText3D: React.FC<SplitText3DProps> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
      scale: 0.8,
      filter: 'blur(10px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', perspective: '1000px' }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: '0.25em' }} key={index} className="inline-block transform-style-3d">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- Spotlight Rays Background Component ---
const SpotlightRays = () => {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
            {/* Rotating Sunburst / God Rays - White for red background */}
            <motion.div 
                className="w-[200vw] h-[200vw] absolute opacity-15"
                style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, #ffffff 20deg, transparent 40deg, transparent 60deg, #ffffff 80deg, transparent 100deg, transparent 140deg, #ffffff 160deg, transparent 200deg)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="w-[150vw] h-[150vw] absolute opacity-15"
                style={{
                    background: 'conic-gradient(from 180deg, transparent 0deg, #ffffff 15deg, transparent 30deg, transparent 90deg, #ffffff 110deg, transparent 130deg)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Central Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-500/20 rounded-full blur-[100px]" />
        </div>
    );
};

// --- Gold Dust Particles ---
const GoldDustResult = () => {
    const particles = Array.from({ length: 40 });
    return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-yellow-300 rounded-full shadow-[0_0_5px_#fbbf24]"
                    initial={{
                        x: Math.random() * 100 + "vw",
                        y: Math.random() * 100 + "vh",
                        scale: Math.random() * 0.5 + 0.2,
                        opacity: Math.random() * 0.5 + 0.2
                    }}
                    animate={{
                        y: [null, Math.random() * -100 + "px"],
                        x: [null, (Math.random() - 0.5) * 50 + "px"],
                        opacity: [null, 0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: Math.random() * 4 + 2 + "px",
                        height: Math.random() * 4 + 2 + "px",
                    }}
                />
            ))}
        </div>
    );
}

import { createPortal } from 'react-dom';

export default function EndGameCelebration({ onRestart }: { onRestart?: () => void }) {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { audioRef } = useAudioState();
  
  // Audios
  const [camOnAudio] = useState(new Audio('/CamOn.mp3'));
  const [vanSuAudio] = useState(new Audio('/VanSuNhuY.mp3'));

  useEffect(() => {
    // Duck Start: Lower background music volume smoothly
    const originalVolume = audioRef ? audioRef.volume : 0.6;
    const targetDuckVolume = 0.1;
    let fadeOutInterval: NodeJS.Timeout;
    
    if (audioRef) {
        // Clear any existing intervals if necessary (though this is mount, so unlikely)
        fadeOutInterval = setInterval(() => {
            if (audioRef.volume > targetDuckVolume) {
                audioRef.volume = Math.max(targetDuckVolume, audioRef.volume - 0.05);
            } else {
                clearInterval(fadeOutInterval);
            }
        }, 100); // Fade out over ~1s
    }

    // Play "Cam On" immediately
    camOnAudio.volume = 1.0;
    camOnAudio.play().catch(e => {
        if (e.name !== 'AbortError') {
            console.error("Failed to play CamOn:", e);
        }
    });

    // When "Cam On" ends, wait 2s, then show Finale and play "Van Su Nhu Y"
    let timeoutId: NodeJS.Timeout;
    const handleCamOnEnd = () => {
        timeoutId = setTimeout(() => {
            setStep(4);
            vanSuAudio.volume = 1.0;
            vanSuAudio.play().catch(e => {
                if (e.name !== 'AbortError') {
                    console.error("Failed to play VanSuNhuY:", e);
                }
            });
        }, 1800); // 2s delay
    };

    // When "Van Su Nhu Y" ends, wait 1s, then restore background music
    let restoreTimeoutId: NodeJS.Timeout;
    const handleVanSuEnd = () => {
        restoreTimeoutId = setTimeout(() => {
            if (audioRef) {
                // Smooth fade in manually 
                const fadeIn = setInterval(() => {
                    if (audioRef.volume < originalVolume) {
                        audioRef.volume = Math.min(originalVolume, audioRef.volume + 0.02);
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 50); // Smoother increments
            }
        }, 1000); // 1s delay
    };

    camOnAudio.addEventListener('ended', handleCamOnEnd);
    vanSuAudio.addEventListener('ended', handleVanSuEnd);

    // Cleanup
    return () => {
        clearTimeout(timeoutId);
        clearTimeout(restoreTimeoutId);
        clearInterval(fadeOutInterval);
        camOnAudio.pause();
        camOnAudio.removeEventListener('ended', handleCamOnEnd);
        vanSuAudio.pause(); 
        vanSuAudio.removeEventListener('ended', handleVanSuEnd);
        
        // Restore background music volume if not already restored
        if (audioRef && audioRef.volume < originalVolume) {
            audioRef.volume = originalVolume;
        }
    };
  }, [audioRef, camOnAudio, vanSuAudio]);

  useEffect(() => {
    setMounted(true);
    // Sequence logic (Faster timing)
    const timer1 = setTimeout(() => setStep(1), 400);   // Logo moves to center
    const timer2 = setTimeout(() => setStep(2), 1200);  // Text 1: Thanks Leadership
    const timer3 = setTimeout(() => setStep(3), 3800);  // Text 2: Thanks Employees
    // Step 4 (Finale) is now triggered by audio completion

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div 
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-start bg-gradient-to-br from-red-900 via-red-800 to-red-950 overflow-hidden perspective-[1000px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
    >
        {/* Vibrant Background Effects */}
        <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-20 mix-blend-overlay"></div>
        <SpotlightRays />
        <GoldDustResult />
        
        {/* Fireworks Type 1: Single burst for steps 2-3 */}
        {step >= 2 && step < 4 && <Fireworks key="single" loop={false} />}
        
        {/* Fireworks Type 2: Circular pattern, continuous loop for step 4+ */}
        {step >= 4 && <CircularFireworks key="circular" />}

        {/* Logo Container - Absolute Positioned but safe */}
        <motion.div
            className="absolute z-50 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]"
            initial={{ top: '2%', left: '2%', x: '0%', y: '0%', scale: 0.4, opacity: 0 }}
            animate={step >= 1 ? { 
                top: '4rem', 
                left: '50%', 
                x: '-50%', 
                y: '0%', 
                scale: 0.85, 
                opacity: 1 
            } : { 
                    top: '2%', left: '2%', x: '0%', y: '0%', scale: 0.4, opacity: 0
            }}
            transition={{ duration: 1, type: "spring", stiffness: 60 }}
        >
            <div className="relative bg-white p-4 rounded-3xl border-2 border-yellow-500 shadow-2xl">
                <img 
                    src="/logo_vina.png" 
                    alt="VINA TAKEUCHI" 
                    className="h-[4.5rem] md:h-[6.5rem] object-contain relative z-10"
                />
            </div>
        </motion.div>

        {/* Content Container - Higher positioning */}
        <div className="relative z-20 container mx-auto px-4 text-center flex flex-col items-center justify-start h-full pt-[16rem]">
            
            {/* Step 2: Thank Leadership */}
            {step >= 2 && (
                <div className={`${step >= 4 ? 'hidden' : 'block'} min-h-[4rem] flex items-center justify-center mb-4`}>
                    <SplitText3D 
                        text="Trân trọng cảm ơn Ban Lãnh đạo công ty"
                        className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] tracking-wide"
                        delay={0.15}
                    />
                </div>

            )}

            {/* Step 3: Thank Employees */}
            {step >= 3 && (
                 <div className={`${step >= 4 ? 'hidden' : 'block'} min-h-[4rem] flex items-center justify-center`}>
                    <SplitText3D 
                        text="Cảm ơn toàn thể nhân viên đã nỗ lực, cống hiến hết mình trong năm vừa qua"
                        className="text-3xl md:text-5xl font-semibold text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] max-w-5xl mx-auto leading-relaxed tracking-wide"
                        delay={0.15}
                    />
                </div>
            )}

            {/* Step 4: Happy New Year Finale */}
            {step >= 4 && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-1000 fill-mode-forwards w-full -mt-10">
                     {/* 3D Title */}
                     <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                        style={{ perspective: '1000px' }}
                     >
                        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black text-white text-center tracking-tighter leading-[1.2] transform-style-3d py-6" style={{
                            WebkitTextStroke: '3px #ffd700',
                            paintOrder: 'stroke fill',
                            textShadow: '0 0 40px rgba(255,215,0,0.9), 0 0 80px rgba(255,215,0,0.6), 0 10px 30px rgba(0,0,0,0.8)'
                        }}>
                            CHÚC MỪNG<br /><span className="inline-block mt-0">NĂM MỚI</span>
                        </h1>
                     </motion.div>

                    <SplitText3D 
                        text="Vạn Sự Như Ý - An Khang Thịnh Vượng"
                        className="text-xl md:text-3xl font-light text-yellow-100 tracking-[0.3em] uppercase mt-8 border-t border-b border-yellow-500/50 py-4"
                        delay={1.0}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3, duration: 1 }}
                        className="mt-12"
                    >
                        {onRestart && (
                            <button 
                                onClick={onRestart}
                                className="group relative px-10 py-4 overflow-hidden rounded-full bg-red-900 border border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] cursor-pointer"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                <span className="relative text-yellow-200 font-bold uppercase tracking-widest text-sm">Bắt đầu lại</span>
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
        
        {/* Floating Decorative Elements */}
        {step >= 4 && (
             <>
                <motion.div 
                    className="absolute top-[20%] left-[10%] text-7xl opacity-40 blur-[1px] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    animate={{ y: [0, -30, 0], rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                    🌸
                </motion.div>
                <motion.div 
                    className="absolute bottom-[20%] right-[10%] text-8xl opacity-40 blur-[1px] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    animate={{ y: [0, -40, 0], rotate: [0, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    🏵️
                </motion.div>
                <motion.div 
                    className="absolute top-[30%] right-[20%] text-6xl opacity-30"
                    animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                    💰
                </motion.div>
            </>
        )}

    </motion.div>,
    document.body
  );
}
