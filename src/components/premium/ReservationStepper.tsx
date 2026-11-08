import { Check, X } from "lucide-react";
import {
  TRACK_STEPS,
  getTrackStepIndex,
  type ReservationStatus,
} from "@/lib/premium/reservations";
import { cn } from "@/lib/utils";

/**
 * Progreso de una operación Premium en 5 pasos. En móvil se reduce a una
 * barra segmentada con el paso actual en texto: cinco etiquetas en 360 px
 * no se leen.
 */
export function ReservationStepper({ status, className }: { status: ReservationStatus; className?: string }) {
  const current = getTrackStepIndex(status);
  const failed = status === "rejected" || status === "withdrawn" || status === "expired";
  const done = status === "settled";

  return (
    <div className={cn("w-full", className)}>
      {/* Móvil */}
      <div className="sm:hidden">
        <div className="flex gap-1" aria-hidden>
          {TRACK_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < current || (i === current && done)
                  ? "bg-primary"
                  : i === current
                    ? failed
                      ? "bg-destructive/70"
                      : "bg-primary/45"
                    : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Paso {current + 1} de {TRACK_STEPS.length} ·{" "}
          <span className="font-semibold text-foreground">{TRACK_STEPS[current].label}</span>
        </p>
      </div>

      {/* Escritorio */}
      <ol className="hidden sm:grid grid-cols-5" aria-label="Progreso de la operación">
        {TRACK_STEPS.map((s, i) => {
          const isDone = i < current || (i === current && done);
          const isCurrent = i === current && !done;
          return (
            <li key={s.id} className="relative flex flex-col items-center text-center" aria-current={isCurrent ? "step" : undefined}>
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-1/2 top-3.5 h-0.5 w-full -translate-y-1/2",
                    i <= current ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-7 items-center justify-center rounded-full text-xs font-bold ring-4 ring-card",
                  isDone && "bg-primary text-primary-foreground",
                  isCurrent && !failed && "bg-primary text-primary-foreground shadow-[0_0_0_4px] shadow-primary/20",
                  isCurrent && failed && "bg-destructive text-white",
                  !isDone && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? <Check className="size-3.5" /> : isCurrent && failed ? <X className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "mt-2 text-xs font-semibold leading-tight",
                  i <= current ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
              <span className="mt-0.5 hidden lg:block text-[11px] leading-tight text-muted-foreground px-1">
                {s.hint}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
