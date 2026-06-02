"use client";

import { useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IdentityVerification } from "@/lib/admin/types";
import { getVerificationFullName } from "@/lib/admin/mock-data";

export type VerificationDialogMode = "reject" | "resolicitar";

const copy: Record<
  VerificationDialogMode,
  {
    title: string;
    description: string;
    label: string;
    placeholder: string;
    confirm: string;
    confirmVariant: "destructive" | "default";
  }
> = {
  reject: {
    title: "Rechazar verificación",
    description:
      "Indica el motivo del rechazo. Este mensaje se enviará al correo del usuario y quedará registrado en su historial.",
    label: "Motivo del rechazo",
    placeholder:
      "Ej.: El documento no coincide con los datos ingresados, la imagen no es legible…",
    confirm: "Rechazar y notificar",
    confirmVariant: "destructive",
  },
  resolicitar: {
    title: "Solicitar nueva verificación",
    description:
      "Explica qué debe corregir el usuario. El mensaje llegará a su correo y la solicitud permanecerá en Pendientes con estado Resolicitado.",
    label: "Instrucciones para el usuario",
    placeholder:
      "Ej.: Sube nuevamente la parte posterior del DNI con mejor iluminación…",
    confirm: "Enviar solicitud",
    confirmVariant: "default",
  },
};

interface VerificationActionDialogProps {
  verification: IdentityVerification | null;
  mode: VerificationDialogMode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (verification: IdentityVerification, message: string) => void;
}

export function VerificationActionDialog({
  verification,
  mode,
  open,
  onOpenChange,
  onConfirm,
}: VerificationActionDialogProps) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setMessage("");
  }, [open, verification?.id, mode]);

  if (!verification || !mode) return null;

  const cfg = copy[mode];
  const name = getVerificationFullName(verification);

  const handleSubmit = () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      onConfirm(verification, message.trim());
      setSubmitting(false);
      onOpenChange(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 space-y-3">
          <DialogTitle className="text-lg">{cfg.title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {cfg.description}
          </DialogDescription>
          <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-left">
            <Mail className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/85 leading-relaxed">
              Se notificará a{" "}
              <span className="font-semibold">{name}</span> en{" "}
              <span className="font-medium text-primary">{verification.email}</span>
            </p>
          </div>
        </DialogHeader>

        <div className="px-6 pb-2">
          <Label htmlFor="verification-message" className="text-sm font-medium">
            {cfg.label}
          </Label>
          <Textarea
            id="verification-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={cfg.placeholder}
            rows={4}
            className="mt-2 rounded-xl resize-none text-sm"
          />
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Mínimo 10 caracteres · {message.trim().length} caracteres
          </p>
        </div>

        <DialogFooter className="p-6 pt-4 gap-2 sm:gap-2">
          <Button
            variant="outline"
            className="rounded-xl flex-1 sm:flex-none"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            variant={cfg.confirmVariant}
            className="rounded-xl flex-1 sm:flex-none"
            onClick={handleSubmit}
            disabled={message.trim().length < 10 || submitting}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              cfg.confirm
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
