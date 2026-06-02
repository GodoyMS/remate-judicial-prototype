"use client";

import {
  Check,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { IdentityVerification } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

interface VerificationRowActionsProps {
  verification: IdentityVerification;
  showAccept?: boolean;
  showReject?: boolean;
  showResolicitar?: boolean;
  onAccept?: (v: IdentityVerification) => void;
  onReject?: (v: IdentityVerification) => void;
  onResolicitar?: (v: IdentityVerification) => void;
  onViewMore: (v: IdentityVerification) => void;
  compact?: boolean;
  hideViewMore?: boolean;
}

function ActionBtn({
  label,
  hint,
  onClick,
  className,
  children,
}: {
  label: string;
  hint?: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
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
      <TooltipContent side="top" sideOffset={6} className="max-w-[200px] text-center">
        <p className="font-medium">{label}</p>
        {hint ? (
          <p className="text-[10px] text-background/70 mt-0.5">{hint}</p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

export function VerificationRowActions({
  verification,
  showAccept = true,
  showReject = true,
  showResolicitar = true,
  onAccept,
  onReject,
  onResolicitar,
  onViewMore,
  compact = false,
  hideViewMore = false,
}: VerificationRowActionsProps) {
  const isRejected = verification.status === "rejected";

  return (
    <div
      role="group"
      aria-label="Acciones de verificación"
      className={cn(
        "inline-flex items-center rounded-xl border border-border/50 bg-background/80 shadow-sm",
        compact ? "p-0.5" : "p-0.5 flex-wrap justify-end"
      )}
    >
      {showAccept && onAccept && !isRejected && (
        <ActionBtn
          label="Aceptar"
          hint="Aprueba KYC y mueve a Clientes"
          onClick={() => onAccept(verification)}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          <Check className="size-4" />
        </ActionBtn>
      )}

      {showReject && onReject && !isRejected && (
        <ActionBtn
          label="Rechazar"
          hint="Notifica por correo y mueve a Rechazados"
          onClick={() => onReject(verification)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="size-4" />
        </ActionBtn>
      )}

      {showResolicitar && onResolicitar && !isRejected && (
        <>
          <div className="mx-0.5 h-5 w-px shrink-0 bg-border/60 hidden sm:block" aria-hidden />
          <ActionBtn
            label="Solicitar nueva verificación"
            hint="Pide correcciones por email"
            onClick={() => onResolicitar(verification)}
            className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
          >
            <RefreshCw className="size-4" />
          </ActionBtn>
        </>
      )}

      {!hideViewMore && (
        <>
          <div className="mx-0.5 h-5 w-px shrink-0 bg-border/60" aria-hidden />
          <ActionBtn
            label="Ver más"
            hint="Documentos, datos y actividad"
            onClick={() => onViewMore(verification)}
          >
            <Eye className="size-4" />
          </ActionBtn>
        </>
      )}
    </div>
  );
}
