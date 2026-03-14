"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type ActiveNavLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  variant?: "mobile" | "desktop";
};

export function ActiveNavLink({
  href,
  label,
  icon,
  variant = "mobile",
}: ActiveNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (variant === "desktop") {
    return (
      <Link
        href={href}
        className={cn(
          "calendar-interactive inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium",
          isActive
            ? "border-primary bg-primary text-primary-foreground shadow-sm"
            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
        )}
      >
        <span className={cn("transition-transform duration-150 ease-wave", isActive && "scale-105")}>{icon}</span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "calendar-interactive relative flex min-w-20 flex-col items-center gap-1 px-3 py-2 text-xs font-medium",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className={cn("transition-transform duration-150 ease-wave", isActive && "scale-105")}>{icon}</span>
      <span>{label}</span>
      <span
        className={cn(
          "calendar-nav-indicator absolute -top-px h-1 rounded-full bg-primary/90",
          isActive ? "left-3 right-3 opacity-100" : "left-6 right-6 opacity-0"
        )}
      />
    </Link>
  );
}