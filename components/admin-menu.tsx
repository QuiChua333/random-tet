"use client";

import React, { useState } from "react";
import { Settings, Plus, X, List, Music, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MusicControls } from "@/components/background-music";

export default function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-end gap-2 pointer-events-none">
      {/* Main Toggle Button */}
      <Button
        variant="default"
        size="icon"
        className="h-[3.5rem] w-[3.5rem] rounded-full shadow-xl border-[0.25rem] border-white hover:scale-110 active:scale-95 z-50 transition-all duration-300 shadow-glow-red pointer-events-auto cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Admin Menu"
      >
        <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
        >
             {isOpen ? <X className="text-white drop-shadow-md w-[1.5rem] h-[1.5rem]" /> : <Settings className="text-white drop-shadow-md w-[1.5rem] h-[1.5rem]" />}
        </motion.div>
       
      </Button>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="flex flex-col gap-2 items-end mb-2 mr-1 pointer-events-auto"
          >
            {/* Music Controls */}
            <MusicControls />

            {/* Reset Wheel Button */}
            <Button
              variant="default"
              size="icon"
              className="h-[3rem] w-[3rem] rounded-full shadow-lg border-[2px] border-white/50 bg-red-500 hover:bg-red-600 active:scale-95 cursor-pointer"
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn reset vòng quay về trạng thái ban đầu (1-33 số)?")) {
                  localStorage.removeItem('wheel-numbers');
                  window.location.reload();
                }
              }}
              title="Reset Vòng Quay"
            >
              <RotateCcw className="text-white w-[1.2rem] h-[1.2rem]" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

