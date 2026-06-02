"use client";

import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IdentityVerification } from "@/lib/admin/types";
import { getVerificationFullName } from "@/lib/admin/mock-data";
import { formatDate } from "@/lib/admin/formatters";

interface AdminMessageDialogProps {
  verification: IdentityVerification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: "rejection" | "resolicit" | null;
}

export function AdminMessageDialog({
  verification,
  open,
  onOpenChange,
  kind,
}: AdminMessageDialogProps) {
  if (!verification || !kind) return null;

  const message =
    kind === "rejection"
      ? verification.rejectionReason
      : verification.resolicitReason;
  const title =
    kind === "rejection" ? "Mensaje de rechazo" : "Solicitud de nueva verificación";
  const description =
    kind === "rejection"
      ? "Este es el mensaje que enviamos al correo del usuario al rechazar su verificación."
      : "Este es el mensaje que enviamos al usuario para solicitar una nueva verificación.";

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="size-3.5" />
            <span>
              Enviado a {getVerificationFullName(verification)} ·{" "}
              {formatDate(verification.submittedAt)}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
