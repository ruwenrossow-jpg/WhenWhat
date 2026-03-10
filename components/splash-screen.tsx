"use client";

import { Logo } from "@/components/ui/logo";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out after 1.8 seconds (before redirect)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Logo size="xl" variant="stacked" className="mb-12 animate-in fade-in duration-700" />
      
      <div className="flex flex-col items-center gap-1">
        <p className="font-accent text-2xl text-text animate-in fade-in duration-700 delay-300">
          Carpe Diem.
        </p>
        <p className="font-accent text-2xl text-text animate-in fade-in duration-700 delay-300">
          Every Day.
        </p>
        <div className="w-24 h-1 bg-secondary mt-4 animate-in fade-in duration-700 delay-500" />
      </div>
    </div>
  );
}
