"use client";

import React from "react";

export default function TetHeader() {
  return (
    <header className="absolute top-0 left-0 w-full h-full z-40 flex flex-col justify-start items-start p-4 md:pl-8 md:pt-12 pointer-events-none gap-6">
       {/* Logo Group */}
       <div className="flex flex-col gap-2 animate-float pointer-events-auto">
          <div className="bg-white/90 rounded-2xl p-[0.1875rem] shadow-glow-gold backdrop-blur-md border border-tet-gold-300 inline-block">
            <img 
              src="/logo_vina.png" 
              alt="VINA TAKEUCHI Logo" 
              className="h-[4.6rem] md:h-[7rem] object-contain"
            />
          </div>
       </div>

       {/* Text & Greetings Group - Moved to Left */}
       <div className="flex flex-col items-start text-left pointer-events-auto ml-[0.125rem] md:w-[31.25rem] xl:w-[35vw] xl:max-w-[30rem] mt-[2rem]">
          <h1 className="text-[2rem] md:text-[3.5rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-600 drop-shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.8)] font-display tracking-wide uppercase leading-tight">
            Chúc Mừng <br/> Năm Mới
          </h1>
          
          <div className="flex items-center gap-[0.125rem] mt-[1rem] mb-[1rem]">
             <span className="text-[2rem] animate-spin-slow">🌸</span>
             <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-white drop-shadow-[0_0.125rem_0.125rem_rgba(220,38,38,1)]">
               Vòng Quay May Mắn 2026
             </h2>
          </div>

          <div className="mt-[0.5rem] bg-tet-red-900/80 backdrop-blur-sm px-[1rem] py-[0.5rem] rounded-full border border-tet-gold-500 shadow-lg">
             <p className="text-[1rem] md:text-[1.25rem] text-tet-gold-100 font-bold tracking-wider">
               Phát Tài - Phát Lộc
             </p>
          </div>

          <div className="mt-[2.4rem] flex gap-[0.5rem] text-[2rem]">
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🧧</span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>💰</span>
            <span className="animate-bounce" style={{ animationDelay: "0.6s" }}>🎁</span>
            <div className="text-[2.5rem] animate-float">🏮</div>
          </div>
       </div>

       {/* Right: Apricot Blossom Branch */}
       <div className="absolute top-[-27%] right-[-5%] w-[70vw] max-w-[37.5rem] pointer-events-none animate-sway origin-top-right z-0">
           <img 
            src="/hoamai.png" 
            alt="Hoa Mai" 
            className="w-full h-full object-contain drop-shadow-2xl" 
            style={{ transform: 'rotate(-0deg)' }}
           />
       </div>

       {/* Horses moved to LuckyWheel */}
    </header>
  );
}
