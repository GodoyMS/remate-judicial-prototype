"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
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
import { formatCurrency } from "@/lib/admin/formatters";
import { PAYMENT_METHOD_LABELS } from "@/lib/admin/investments";
import type { PropertyInvestment } from "@/lib/admin/types";

interface PaymentVerificationRejectDialogProps {
  investment: PropertyInvestment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (investment: PropertyInvestment, reason: string) => void;
}

export function PaymentVerificationRejectDialog({
  investment,
  open,
  onOpenChange,
  onConfirm,
}: PaymentVerificationRejectDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setReason("");
  }, [open, investment?.id]);

  if (!investment) return null;

  const handleSubmit = () => {
    if (reason.trim().length < 10) return;
    setSubmitting(true);
    setTimeout(() => {
      onConfirm(investment, reason.trim());
      setSubmitting(false);
      onOpenChange(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 space-y-3">
          <DialogTitle className="text-lg">Rechazar verificación de pago</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Indica el motivo del rechazo. El inversor recibirá un correo con esta
            explicación y la solicitud pasará al historial de rechazados.
          </DialogDescription>
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-left">
            <Mail className="size-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/85 leading-relaxed">
              Se notificará a{" "}
              <span className="font-semibold">{investment.userName}</span> en{" "}
              <span className="font-medium text-destructive">{investment.userEmail}</span>
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            {formatCurrency(investment.amount, investment.currency)} ·{" "}
            {PAYMENT_METHOD_LABELS[investment.paymentMethod]}
          </div>
        </DialogHeader>

        <div className="px-6 pb-2">
          <Label htmlFor="reject-reason" className="text-sm font-medium">
            Motivo del rechazo
          </Label>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej.: El comprobante no coincide con el monto, la operación ya fue registrada…"
            rows={4}
            className="mt-2 rounded-xl resize-none text-sm"
          />
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Mínimo 10 caracteres · {reason.trim().length} caracteres
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
            variant="destructive"
            className="rounded-xl flex-1 sm:flex-none"
            onClick={handleSubmit}
            disabled={reason.trim().length < 10 || submitting}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Rechazar y notificar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
