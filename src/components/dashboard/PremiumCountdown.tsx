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

  if (countdown.expired) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-red-600 font-medium",
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
    <div
      className={cn(
        "flex items-center gap-2",
        compact ? "text-xs" : "text-sm",
        className
      )}
    >
      <Clock className="size-3.5 text-amber-600 shrink-0" />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">Quedan</span>
        <div className="flex items-center gap-1">
          {countdown.days > 0 && (
            <span className="font-bold text-foreground tabular-nums bg-amber-50 px-1.5 py-0.5 rounded-md">
              {countdown.days}d
            </span>
          )}
          <span className="font-bold text-foreground tabular-nums bg-amber-50 px-1.5 py-0.5 rounded-md">
            {countdown.hours}h
          </span>
          <span className="font-bold text-foreground tabular-nums bg-amber-50 px-1.5 py-0.5 rounded-md">
            {countdown.minutes}m
          </span>
        </div>
      </div>
    </div>
  );
}
