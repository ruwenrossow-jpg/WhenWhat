import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Calendar, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { logout } from "@/features/auth/actions";
import Link from "next/link";

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
          </div>

          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-2 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/day">
              <Calendar className="h-4 w-4 mr-2" />
              Tagesansicht
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/week">
              <CalendarDays className="h-4 w-4 mr-2" />
              Wochenansicht
            </Link>
          </Button>
        </div>

        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden">
        <div className="flex items-center justify-around h-16">
          <Link href="/day" className="flex flex-col items-center gap-1 px-4 py-2">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Tag</span>
          </Link>
          <Link href="/week" className="flex flex-col items-center gap-1 px-4 py-2">
            <CalendarDays className="h-5 w-5" />
            <span className="text-xs">Woche</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
