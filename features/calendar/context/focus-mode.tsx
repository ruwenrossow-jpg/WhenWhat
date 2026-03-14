"use client";

import { createContext, useContext, useEffect, useState } from "react";

type FocusModeContextValue = {
  isFocused: boolean;
  toggle: () => void;
};

const FocusModeContext = createContext<FocusModeContextValue>({
  isFocused: false,
  toggle: () => {},
});

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("calendar-focus-mode");
      if (stored === "1") setIsFocused(true);
    } catch {
      // localStorage not available (SSR guard)
    }
  }, []);

  function toggle() {
    setIsFocused((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("calendar-focus-mode", next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  return (
    <FocusModeContext.Provider value={{ isFocused, toggle }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  return useContext(FocusModeContext);
}
