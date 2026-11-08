"use client";

import { useSyncExternalStore } from "react";
import { Clock } from "lucide-react";
import { formatLimaDateTime, formatRemaining, hoursUntil } from "@/lib/premium/dates";
import { cn } from "@/lib/utils";

const MINUTE = 60_000;
const subscribeMinute = (cb: () => void) => {
  const t = setInterval(cb, MINUTE / 4);
  return () => clearInterval(t);
};

/**
 * `Date.now()` redondeado al minuto, solo en el cliente (`null` en el
 * servidor): la cuenta regresiva no puede renderizarse igual en ambos lados.
 */
export function useNow(): number | null {
  return useSyncExternalStore(
    subscribeMinute,
    () => Math.floor(Date.now() / MINUTE) * MINUTE,
    () => null
  );
}

interface WindowClockProps {
  deadline: string;
  /** "Ventana exclusiva hasta" / "Completa tu aporte antes del". */
  label?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Fecha y hora absolutas primero (es el compromiso), cuenta regresiva
 * después (es la ayuda). Sin rojo ni parpadeos: es una decisión de seis
 * cifras, no una oferta relámpago. Solo se acentúa en las últimas 24 h.
 */
export function WindowClock({ deadline, label = "Ventana exclusiva hasta", className, compact }: WindowClockProps) {
  const now = useNow();
  const remaining = now ? formatRemaining(deadline, now) : null;
  const closed = now ? hoursUntil(deadline, now) <= 0 : false;
  const soon = now ? hoursUntil(deadline, now) < 24 && !closed : false;

  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Clock className="size-3.5 shrink-0" />
        <span>
          {closed ? "Cerró el " : "Cierra el "}
          <span className="font-medium text-foreground">{formatLimaDateTime(deadline)}</span>
        </span>
      </span>
    );
  }

  return (
    <div className={cn("flex items-start gap-3 rounded-xl bg-muted/50 p-3", className)}>
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
          soon ? "bg-warning/20 text-warning-foreground dark:text-warning" : "bg-card text-foreground/70"
        )}
      >
        <Clock className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{closed ? "Cerró el" : label}</p>
        <p className="text-sm font-semibold text-foreground">
          {formatLimaDateTime(deadline)} <span className="font-normal text-muted-foreground">(hora de Lima)</span>
        </p>
        {!closed && (
          <p className="mt-0.5 min-h-4 text-xs text-muted-foreground tabular-nums">
            {remaining ? `Quedan ${remaining}` : " "}
          </p>
        )}
      </div>
    </div>
  );
}
