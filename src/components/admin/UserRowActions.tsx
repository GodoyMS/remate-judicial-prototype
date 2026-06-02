"use client";

import { Ban, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AdminUser } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

interface UserRowActionsProps {
  user: AdminUser;
  onViewProfile: (user: AdminUser) => void;
  onSendMessage: (user: AdminUser) => void;
  onToggleBlock: (user: AdminUser) => void;
}

interface ActionTooltipButtonProps {
  label: string;
  hint?: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

function ActionTooltipButton({
  label,
  hint,
  onClick,
  className,
  children,
}: ActionTooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn("rounded-lg size-8", className)}
          onClick={onClick}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="text-center">
        <p className="font-medium">{label}</p>
        {hint ? (
          <p className="text-[10px] text-background/70 mt-0.5 max-w-[180px]">{hint}</p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

export function UserRowActions({
  user,
  onViewProfile,
  onSendMessage,
  onToggleBlock,
}: UserRowActionsProps) {
  const isBlocked = user.status === "blocked";

  return (
    <div
      role="group"
      aria-label="Acciones de usuario"
      className="inline-flex items-center rounded-xl border border-border/50 bg-background/80 p-0.5 shadow-sm"
    >
      <ActionTooltipButton
        label="Ver más"
        hint="Perfil, inversiones, actividad y datos de contacto"
        onClick={() => onViewProfile(user)}
      >
        <Eye className="size-4" />
      </ActionTooltipButton>

      <ActionTooltipButton
        label="Enviar mensaje"
        hint="Comunicación directa con el inversor"
        onClick={() => onSendMessage(user)}
      >
        <MessageSquare className="size-4" />
      </ActionTooltipButton>

      <div className="mx-0.5 h-5 w-px shrink-0 bg-border/60" aria-hidden />

      <ActionTooltipButton
        label={isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
        hint={
          isBlocked
            ? "Restaurar acceso a la plataforma"
            : "Revocar acceso e impedir nuevas inversiones"
        }
        onClick={() => onToggleBlock(user)}
        className={cn(
          isBlocked
            ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            : "text-destructive hover:text-destructive hover:bg-destructive/10"
        )}
      >
        <Ban className="size-4" />
      </ActionTooltipButton>
    </div>
  );
}
