"use client";

import {
  User,
  Building2,
  CreditCard,
  Landmark,
  Clock,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Target,
  Paperclip,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatDateTime, formatCurrency } from "@/lib/admin/formatters";
import type { Retorno } from "@/lib/retornos/types";

const retornoTypeConfig = {
  roi_return: { label: "Retorno de inversión", icon: TrendingUp, color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  refund: { label: "Reembolso", icon: RotateCcw, color: "border-blue-200 bg-blue-50 text-blue-700" },
  goal_not_reached: { label: "Meta no alcanzada", icon: Target, color: "border-amber-200 bg-amber-50 text-amber-700" },
};

interface RetornoDetailSheetProps {
  retorno: Retorno | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-xs font-medium">{value}</span>
    </div>
  );
}

export function RetornoDetailSheet({ retorno, open, onOpenChange }: RetornoDetailSheetProps) {
  if (!retorno) return null;

  const typeConfig = retornoTypeConfig[retorno.type];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left">Detalle del retorno</SheetTitle>
          <SheetDescription className="text-left font-mono text-xs">
            {retorno.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Type + Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold", typeConfig.color)}>
              <typeConfig.icon className="size-3.5" />
              {typeConfig.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              Confirmado
            </span>
          </div>

          {/* Amount */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-center">
            <p className="text-xs text-muted-foreground">Monto retornado</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              {formatCurrency(retorno.amount, retorno.currency)}
            </p>
          </div>

          {/* Client */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cliente</h4>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted font-semibold text-sm">
                  {retorno.userName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{retorno.userName}</p>
                  <p className="text-xs text-muted-foreground">{retorno.userEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Propiedad</h4>
            <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/20 p-4">
              <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm">{retorno.propertyTitle}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pago</h4>
            <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-muted/20">
              <div className="flex items-center gap-2 px-4 py-3">
                {retorno.paymentMethod === "card" ? (
                  <CreditCard className="size-4 text-muted-foreground" />
                ) : (
                  <Landmark className="size-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                  {retorno.paymentMethod === "card" ? "Tarjeta de crédito/débito" : "Transferencia bancaria"}
                </span>
              </div>
              {retorno.paymentMethod === "card" && (
                <div className="divide-y divide-border/40 px-4">
                  <Row label="Tarjeta" value={`**** **** **** ${retorno.cardLastFour}`} />
                  <Row label="Titular" value={retorno.cardholderName} />
                </div>
              )}
              {retorno.paymentMethod === "bank_transfer" && (
                <div className="divide-y divide-border/40 px-4">
                  <Row label="Banco" value={retorno.bankName} />
                  <Row label="Titular" value={retorno.accountHolder} />
                  <Row label="Cuenta" value={
                    <span className="font-mono text-xs">{retorno.accountNumber}</span>
                  } />
                  <Row label="Referencia" value={
                    <span className="font-mono text-xs">{retorno.transferReference}</span>
                  } />
                  {retorno.transferProofName && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs text-muted-foreground">Comprobante</span>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Paperclip className="size-3" />
                        <span className="max-w-[180px] truncate">{retorno.transferProofName}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> Creado</span>
              <span>{formatDateTime(retorno.createdAt)}</span>
            </div>
            {retorno.confirmedAt && (
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5" /> Confirmado</span>
                <span>{formatDateTime(retorno.confirmedAt)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5"><User className="size-3.5" /> Creado por</span>
              <span>{retorno.createdBy}</span>
            </div>
          </div>

          {retorno.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notas internas</h4>
              <p className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm">{retorno.notes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
