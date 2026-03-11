"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-heading text-destructive">
          Etwas ist schiefgelaufen
        </h2>
        <p className="text-muted-foreground">
          {error.message || "Ein unerwarteter Fehler ist aufgetreten."}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Erneut versuchen</Button>
          <Button variant="outline" onClick={() => window.location.href = "/login"}>
            Zur Anmeldung
          </Button>
        </div>
      </div>
    </div>
  );
}
