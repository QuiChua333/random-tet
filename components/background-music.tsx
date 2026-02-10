"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface BackgroundMusicProps {
  playlist: string[];
  initialVolume?: number;
}

// Shared audio state
let globalAudioRef: HTMLAudioElement | null = null;
let globalIsPlaying = false;
let globalVolume = 0.4;
let globalIsMuted = false;
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Hook to use global audio state
export const useAudioState = () => {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    isPlaying: globalIsPlaying,
    volume: globalVolume,
    isMuted: globalIsMuted,
    audioRef: globalAudioRef,
  };
};

// Exported Music Controls UI Component
export const MusicControls = () => {
  const { isPlaying, volume, isMuted, audioRef } = useAudioState();

  const togglePlay = () => {
    if (!audioRef) return;

    if (isPlaying) {
      audioRef.pause();
      globalIsPlaying = false;
      console.log("⏸️ Music paused");
    } else {
      console.log("▶️ Play button clicked, audio state:", {
        volume: audioRef.volume,
        muted: audioRef.muted,
        paused: audioRef.paused
      });
      audioRef.play()
        .then(() => {
          globalIsPlaying = true;
          notifyListeners();
          console.log("✅ Music playing from button, volume:", audioRef.volume);
        })
        .catch((error) => console.error("Failed to play:", error));
    }
    notifyListeners();
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    globalVolume = newVolume;
    if (audioRef) {
      audioRef.volume = newVolume;
    }
    if (newVolume > 0 && globalIsMuted) {
      globalIsMuted = false;
    }
    notifyListeners();
  };

  const toggleMute = () => {
    if (!audioRef) return;

    if (globalIsMuted) {
      audioRef.volume = globalVolume;
      globalIsMuted = false;
    } else {
      audioRef.volume = 0;
      globalIsMuted = true;
    }
    notifyListeners();
  };

  // Audio wave bars animation
  const AudioWave = () => {
    const bars = 5;
    return (
      <div className="flex items-center gap-0.5 h-6">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-tet-gold-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-wave' : 'h-2'
            }`}
            style={{
              animationDelay: `${i * 0.1}s`,
              height: isPlaying ? undefined : '8px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-tet-red-600 to-tet-red-700 rounded-xl shadow-lg border-2 border-tet-gold-400 p-3">
      <div className="flex flex-col gap-2 min-w-[200px]">
        {/* Top row: Play button and wave */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-tet-gold-500 hover:bg-tet-gold-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Audio Wave Visualization */}
          <AudioWave />
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-white hover:text-tet-gold-300 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.01}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

// Main Background Music Component (Hidden, auto-plays on first click)
export default function BackgroundMusic({ 
  playlist, 
  initialVolume = 0.6
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasTriedAutoPlay = useRef(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const handleSongEnd = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    console.log(`🎵 Song ended. Switching to next track index: ${nextIndex}`);
    setCurrentSongIndex(nextIndex);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set global reference
    globalAudioRef = audio;
    globalVolume = initialVolume;
    audio.volume = initialVolume;

    // Reload audio when source changes
    if (globalIsPlaying) {
        audio.play().catch(e => console.error("Failed to play next song:", e));
    }

    // Debug: Log when audio is ready
    const handleCanPlay = () => {
      console.log("✅ Audio file loaded and ready to play");
    };

    const handleError = (e: Event) => {
      console.error("❌ Audio loading error:", audio.error);
    };

    const handleLoadedData = () => {
      console.log("✅ Audio data loaded");
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);

    // Try to auto-play on first user click anywhere on the screen
    const handleFirstClick = () => {
      if (!hasTriedAutoPlay.current && audio && !globalIsPlaying) {
        console.log("🎵 Attempting to play music...");
        
        audio.play()
          .then(() => {
            hasTriedAutoPlay.current = true;
            globalIsPlaying = true;
            notifyListeners();
            console.log("✅ Music auto-started on first click");
          })
          .catch((error) => {
            console.log("⚠️ Auto-play attempt failed, will retry on next click:", error);
            // Don't set hasTriedAutoPlay.current = true, so we try again
          });
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleFirstClick);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };

  }, [initialVolume, currentSongIndex]); // Re-run effect when song changes

  return (
    <>
      <audio 
        ref={audioRef} 
        src={playlist[currentSongIndex]} 
        onEnded={handleSongEnd}
        preload="auto"
      />
      
      {/* Custom CSS for wave animation */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}


