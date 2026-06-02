"use client";

import { cn } from "@/lib/utils";
import type { VerificationQueueStatus } from "@/lib/admin/types";

const config: Record<
  VerificationQueueStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pendiente",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  resolicitado: {
    label: "Resolicitado",
    className: "bg-sky-50 text-sky-800 border-sky-200",
  },
  rejected: {
    label: "Rechazado",
    className: "bg-red-50 text-red-700 border-red-200",
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
