"use client";

import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "./globals.css";
import BackgroundMusic from "@/components/background-music";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body",
});

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ["vietnamese"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${beVietnamPro.variable} antialiased`}>
        {children}
        
        {/* Background Music - Persists across all pages */}
        <BackgroundMusic 
          src={encodeURI("/Một Năm Mới Bình An.mp3")}
          initialVolume={0.6}
        />
      </body>
    </html>
  );
}
