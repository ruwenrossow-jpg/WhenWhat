"use client";

export { FocusModeProvider } from "@/features/calendar/context/focus-mode";
import { useFocusMode } from "@/features/calendar/context/focus-mode";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Icon button placed inside the header to activate focus mode */
export function FocusModeToggle() {
  const { toggle } = useFocusMode();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Fokusmodus aktivieren"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
    >
      <Maximize2 className="h-4 w-4" />
    </Button>
  );
}

/** Floating exit button — only shown while focus mode is active */
export function FocusModeExitButton() {
  const { isFocused, toggle } = useFocusMode();

  if (!isFocused) return null;

  return (
    <button
      onClick={toggle}
      aria-label="Fokusmodus beenden"
      className={[
        "fixed z-50 flex items-center justify-center",
        "w-9 h-9 rounded-full shadow-md",
        "bg-background/90 backdrop-blur border border-border",
        "text-muted-foreground hover:text-foreground transition-all",
        "top-[max(0.75rem,env(safe-area-inset-top,0.75rem))]",
        "right-[max(0.75rem,env(safe-area-inset-right,0.75rem))]",
      ].join(" ")}
    >
      <Minimize2 className="h-4 w-4" />
    </button>
  );
}

/** Drop-in for the header area: hides itself when focused */
export function FocusAwareHeader({ children }: { children: React.ReactNode }) {
  const { isFocused } = useFocusMode();

  return (
    <header
      className={[
        "safe-pt z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-[max-height,opacity,visibility] duration-200 ease-in-out overflow-hidden",
        isFocused ? "max-h-0 opacity-0 invisible" : "max-h-24 opacity-100 visible",
      ].join(" ")}
    >
      <div className="safe-px h-14 flex items-center justify-between sm:container sm:mx-auto sm:px-4">
        {children}
      </div>
    </header>
  );
}

/** Drop-in for the bottom nav: hides itself when focused */
export function FocusAwareNav({ children }: { children: React.ReactNode }) {
  const { isFocused } = useFocusMode();

  return (
    <nav
      className={[
        "safe-pb-nav z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden",
        "transition-[max-height,opacity,visibility] duration-200 ease-in-out overflow-hidden",
        isFocused ? "max-h-0 opacity-0 invisible" : "max-h-24 opacity-100 visible",
      ].join(" ")}
    >
      {children}
    </nav>
  );
}

/** Hides arbitrary content blocks while focus mode is active */
export function FocusAwareBlock({ children }: { children: React.ReactNode }) {
  const { isFocused } = useFocusMode();

  return (
    <div
      className={[
        "transition-[max-height,opacity,visibility,margin] duration-200 ease-in-out overflow-hidden",
        isFocused ? "max-h-0 opacity-0 invisible m-0" : "max-h-40 opacity-100 visible",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
