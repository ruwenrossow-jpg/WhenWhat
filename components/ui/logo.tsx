import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "default" | "stacked";

type LogoProps = {
  size?: LogoSize;
  variant?: LogoVariant;
  showUnderline?: boolean;
  className?: string;
};

// Size mappings: WHEN size / WHAT size
const sizeClasses = {
  sm: {
    when: "text-lg",    // 18px
    what: "text-sm",    // 14px
    underline: "w-12 h-0.5",
  },
  md: {
    when: "text-2xl",   // 24px
    what: "text-lg",    // 18px
    underline: "w-16 h-0.5",
  },
  lg: {
    when: "text-4xl",   // 36px
    what: "text-2xl",   // 24px
    underline: "w-20 h-1",
  },
  xl: {
    when: "text-6xl",   // 60px
    what: "text-3xl",   // 30px
    underline: "w-24 h-1",
  },
};

export function Logo({
  size = "md",
  variant = "default",
  showUnderline = false,
  className,
}: LogoProps) {
  const classes = sizeClasses[size];

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <div className={cn("font-display text-primary leading-tight", classes.when)}>
          WHEN
        </div>
        <div className={cn("font-display text-secondary leading-tight", classes.what)}>
          WHAT
        </div>
        {showUnderline && (
          <div className={cn("bg-secondary mt-2", classes.underline)} />
        )}
      </div>
    );
  }

  // Default variant: side-by-side
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className={cn("font-display text-primary leading-none", classes.when)}>
        WHEN
      </span>
      <span className={cn("font-display text-primary leading-none", classes.what)}>
        WHAT
      </span>
    </div>
  );
}
