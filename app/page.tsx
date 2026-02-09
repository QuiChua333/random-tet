"use client";

import React from "react";
import TetHeader from "@/components/tet-header";
import TetDecorations from "@/components/tet-decorations";
import LuckyWheel from "@/components/lucky-wheel";
import { Card, CardContent } from "@/components/ui/card"; // Keep imports if needed by other parts, or remove if unused. Card is removed from usage.
import AdminMenu from "@/components/admin-menu";

export default function Home() {
  return (
    <main className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <TetDecorations />
      
      {/* Main content */}
      <div className="relative z-10 w-full flex flex-col items-center gap-4 max-h-screen">
        <TetHeader />
        
        <div className="w-full flex justify-center flex-1 items-center relative z-10">
            <LuckyWheel />
        </div>

        
      </div>
      
      <AdminMenu />
    </main>
  );
}
