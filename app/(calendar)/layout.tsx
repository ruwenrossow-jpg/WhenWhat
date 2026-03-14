import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { logout } from "@/features/auth/actions";
import Link from "next/link";
import {
  FocusModeProvider,
  FocusAwareHeader,
  FocusAwareNav,
  FocusAwareBlock,
  FocusModeToggle,
  FocusModeExitButton,
} from "@/features/calendar/components/calendar-shell";

export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <FocusModeProvider>
      <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <FocusAwareHeader>
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <FocusModeToggle />
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </form>
          </div>
        </FocusAwareHeader>

        {/* Floating exit button (shown only in focus mode) */}
        <FocusModeExitButton />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto mobile-single-scroll safe-px py-4 pb-24 sm:container sm:mx-auto sm:px-4 sm:pb-6">
          {/* Desktop Navigation */}
          <FocusAwareBlock>
            <div className="hidden sm:flex gap-2 mb-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/day">
                  <Calendar className="h-4 w-4 mr-2" />
                  Tagesansicht
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/month">
                  <CalendarRange className="h-4 w-4 mr-2" />
                  Monatsansicht
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/week">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Wochenansicht
                </Link>
              </Button>
            </div>
          </FocusAwareBlock>

          {children}
        </main>

        {/* Bottom Navigation (Mobile) */}
        <FocusAwareNav>
          <div className="flex items-center justify-around h-16 safe-px">
            <Link href="/day" className="flex flex-col items-center gap-1 px-4 py-2">
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Tag</span>
            </Link>
            <Link href="/month" className="flex flex-col items-center gap-1 px-4 py-2">
              <CalendarRange className="h-5 w-5" />
              <span className="text-xs">Monat</span>
            </Link>
            <Link href="/week" className="flex flex-col items-center gap-1 px-4 py-2">
              <CalendarDays className="h-5 w-5" />
              <span className="text-xs">Woche</span>
            </Link>
          </div>
        </FocusAwareNav>
      </div>
    </FocusModeProvider>
  );
}
