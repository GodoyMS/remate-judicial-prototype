"use client";

import { Crown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AdminUser, UserTier } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const tierConfig: Record<UserTier, { badge: string; label: string }> = {
  premium: {
    badge: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80",
    label: "Premium",
  },
  standard: {
    badge: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100/80",
    label: "Standard",
  },
};

interface UserTierBadgeProps {
  user: AdminUser;
  onManage: (user: AdminUser) => void;
}

export function UserTierBadge({ user, onManage }: UserTierBadgeProps) {
  const isPremium = user.tier === "premium";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onManage(user)}
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold gap-0.5 transition-all",
            "hover:scale-[1.03] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            tierConfig[user.tier].badge
          )}
        >
          {isPremium && <Crown className="size-3" />}
          {tierConfig[user.tier].label}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        <p className="font-medium">
          {isPremium ? "Gestionar plan Premium" : "Activar plan Premium"}
        </p>
        <p className="text-[10px] text-background/70 mt-0.5">
          {isPremium
            ? "Cambiar a Standard o revisar beneficios"
            : "Desbloquear acceso anticipado y soporte prioritario"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
