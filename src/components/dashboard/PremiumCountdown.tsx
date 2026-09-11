"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getPremiumCountdown } from "@/lib/premium/mock-data";
import { cn } from "@/lib/utils";

interface PremiumCountdownProps {
  deadline: string;
  className?: string;
  compact?: boolean;
}

export function PremiumCountdown({
  deadline,
  className,
  compact = false,
}: PremiumCountdownProps) {
  const [countdown, setCountdown] = useState(() => getPremiumCountdown(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getPremiumCountdown(deadline));
    }, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  // Fecha absoluta de cierre, siempre visible junto a la cuenta atrás (P-003):
  // "Quedan 2d 5h" no dice cuándo termina realmente.
  const absoluteDeadline = new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(deadline));

  if (countdown.expired) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-destructive font-medium",
          compact ? "text-xs" : "text-sm",
          className
        )}
      >
        <Clock className="size-3.5" />
        Ventana premium cerrada
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>
        Ventana Premium hasta: <span className="font-medium text-foreground">{absoluteDeadline}</span>
      </p>
      <div className={cn("flex items-center gap-2", compact ? "text-xs" : "text-sm")}>
        <Clock className="size-3.5 text-warning shrink-0" />
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Quedan</span>
          <div className="flex items-center gap-1">
            {countdown.days > 0 && (
              <span className="font-bold text-foreground tabular-nums bg-warning/10 px-1.5 py-0.5 rounded-md">
                {countdown.days}d
              </span>
            )}
            <span className="font-bold text-foreground tabular-nums bg-warning/10 px-1.5 py-0.5 rounded-md">
              {countdown.hours}h
            </span>
            <span className="font-bold text-foreground tabular-nums bg-warning/10 px-1.5 py-0.5 rounded-md">
              {countdown.minutes}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
