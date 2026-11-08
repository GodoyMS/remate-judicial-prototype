import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/premium/reservations";

/**
 * Píldora de estado. Una sola gramática de color en toda la experiencia
 * Premium: info = esperando a Rematto, warning = esperando al usuario,
 * primary = en curso, success = cerrado bien, danger = cerrado mal.
 * El dorado NO es un estado: queda reservado a la marca Premium.
 */
const TONES: Record<StatusTone, string> = {
  info: "bg-info/12 text-info ring-info/20",
  warning: "bg-warning/18 text-warning-foreground ring-warning/30 dark:text-warning",
  primary: "bg-primary/10 text-primary ring-primary/20 dark:bg-accent dark:text-accent-foreground",
  success: "bg-success/12 text-success ring-success/20",
  muted: "bg-muted text-muted-foreground ring-border",
  danger: "bg-destructive/10 text-destructive ring-destructive/20",
};

const DOTS: Record<StatusTone, string> = {
  info: "bg-info",
  warning: "bg-warning",
  primary: "bg-primary dark:bg-accent-foreground",
  success: "bg-success",
  muted: "bg-muted-foreground/60",
  danger: "bg-destructive",
};

export function StatusPill({
  tone,
  children,
  className,
  size = "sm",
}: {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold ring-1 ring-inset",
        size === "xs" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        TONES[tone],
        className
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", DOTS[tone])} />
      {children}
    </span>
  );
}
