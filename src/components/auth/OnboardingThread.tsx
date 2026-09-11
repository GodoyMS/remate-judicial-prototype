import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type OnboardingStage = "account" | "verify" | "explore" | "invest";

const STAGES: { id: OnboardingStage; label: string }[] = [
  { id: "account", label: "Crea tu cuenta" },
  { id: "verify", label: "Verifica tu identidad" },
  { id: "explore", label: "Explora oportunidades" },
  { id: "invest", label: "Invierte cuando estés listo" },
];

interface OnboardingThreadProps {
  current: OnboardingStage;
  className?: string;
}

/**
 * Hilo conductor visible en login, registro y verificación (WP-1.2, cierra
 * L-019). Cada pantalla del funnel usaba el mismo tono comercial sin decir
 * en qué momento del recorrido está el usuario; esto lo hace explícito.
 */
export function OnboardingThread({ current, className }: OnboardingThreadProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === current);

  return (
    <ol className={cn("flex items-start gap-1.5", className)}>
      {STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={stage.id} className="flex flex-1 flex-col items-center gap-1.5 text-center">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                  done && "bg-primary text-primary-foreground",
                  active && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !done && !active && "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
              </div>
              {i < STAGES.length - 1 && (
                <div className={cn("mx-1 h-0.5 flex-1", done ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] leading-tight",
                active ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
