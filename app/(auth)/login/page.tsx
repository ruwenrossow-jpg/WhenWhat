"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { login } from "@/features/auth/actions";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/day");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Logo size="xl" className="mb-8" />
          <h1 className="text-2xl font-heading text-text mt-2">Melde dich an</h1>
          <div className="w-32 h-0.5 bg-accent mt-2" />
        </div>

        <form action={formAction} className="space-y-4 bg-card p-6 rounded-lg border">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="deine@email.de"
              required
              disabled={isPending}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              autoComplete="current-password"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {state.error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Anmelden..." : "Anmelden"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Noch kein Account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Jetzt registrieren
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
