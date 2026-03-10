"use client";

import { SplashScreen } from "@/components/splash-screen";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if user has seen splash this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (!hasSeenSplash) {
      setShowSplash(true);
      
      // Hide splash after 2.5 seconds (2s display + 0.5s fade)
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Show splash screen if not seen yet
  if (showSplash) {
    return <SplashScreen />;
  }

  // Otherwise show auth pages
  return <>{children}</>;
}
