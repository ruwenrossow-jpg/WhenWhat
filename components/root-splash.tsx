"use client";

import { SplashScreen } from "@/components/splash-screen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RootSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Show splash for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Check auth state
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Auth check failed:", error);
          // Redirect to login on auth error
          router.push("/login");
          return;
        }
        
        // Fade out splash
        setShowSplash(false);
        
        // Wait for fade-out animation
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Redirect based on auth
        if (user) {
          router.push("/day");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Unexpected error during auth check:", error);
        // Fallback to login on any error
        router.push("/login");
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  if (!showSplash) {
    return null;
  }

  return <SplashScreen />;
}
