"use client";

import { cn } from "@/lib/utils";
import type { VerificationQueueStatus } from "@/lib/admin/types";

const config: Record<
  VerificationQueueStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pendiente",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  resolicitado: {
    label: "Resolicitado",
    className: "bg-info/10 text-info border-info/20",
  },
  rejected: {
    label: "Rechazado",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

interface VerificationStatusBadgeProps {
  status: VerificationQueueStatus;
  className?: string;
}

export function VerificationStatusBadge({
  status,
  className,
}: VerificationStatusBadgeProps) {
  const cfg = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
