"use client";

import { useState } from "react";
import {
  CreditCard,
  Landmark,
  Clock,
  CheckCircle2,
  Flag,
  TrendingUp,
  RotateCcw,
  Target,
  History,
  Paperclip,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/admin/formatters";
import { formatCurrency } from "@/lib/currency";
import type { Retorno } from "@/lib/retornos/types";
import { CreateTicketDialog } from "./CreateTicketDialog";
import { ReopenTicketDialog } from "./ReopenTicketDialog";
import { UserTicketActivitySheet } from "./UserTicketActivitySheet";
import { RichTextContent } from "@/components/admin/RichTextContent";

const retornoTypeConfig = {
  roi_return: {
    label: "Retorno de inversión",
    icon: TrendingUp,
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    description: "Ganancia generada por tu inversión en esta propiedad",
  },
  refund: {
    label: "Reembolso",
    icon: RotateCcw,
    color: "border-blue-200 bg-blue-50 text-blue-700",
    description: "Devolución por un problema en el proceso de inversión",
  },
  goal_not_reached: {
    label: "Devolución por meta no alcanzada",
    icon: Target,
    color: "border-amber-200 bg-amber-50 text-amber-700",
    description: "La propiedad no alcanzó el objetivo de inversión",
  },
};

const ticketStatusConfig = {
  flagged: {
    label: "En observación",
    color: "border-amber-200 bg-amber-50 text-amber-700",
    description: "Tu observación fue recibida y está pendiente de revisión",
  },
  in_review: {
    label: "En revisión",
    color: "border-blue-200 bg-blue-50 text-blue-700",
    description: "Un asesor está revisando tu caso",
  },
  resolved: {
    label: "Resuelto",
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    description: "Tu observación fue atendida",
  },
};

interface RetornoDetailSheetProps {
  retorno: Retorno | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export function RetornoDetailSheet({ retorno, open, onOpenChange, userName }: RetornoDetailSheetProps) {
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  if (!retorno) return null;

  const typeConfig = retornoTypeConfig[retorno.type];
  const ticket = retorno.ticket;
  const ticketCfg = ticket ? ticketStatusConfig[ticket.status] : null;

  const resolvedActivity = ticket?.activity.find(
    (a) => a.type === "admin_message"
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-left">Detalle del retorno</SheetTitle>
            <SheetDescription className="text-left font-mono text-xs">
              {retorno.id}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Type badge */}
            <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold", typeConfig.color)}>
              <typeConfig.icon className="size-3.5" />
              {typeConfig.label}
            </span>

            {/* Amount */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-5 text-center">
              <p className="text-xs text-muted-foreground">{typeConfig.description}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                {formatCurrency(retorno.amount, retorno.currency)}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="size-3.5" />
                Confirmado
              </div>
            </div>

            {/* Property */}
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
              <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Propiedad</p>
                <p className="text-sm font-medium">{retorno.propertyTitle}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Detalle del pago</h4>
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
                <div className="px-4 py-3 space-y-1.5 text-xs">
                  {retorno.paymentMethod === "card" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tarjeta</span>
                        <span className="font-mono">**** **** **** {retorno.cardLastFour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Titular</span>
                        <span>{retorno.cardholderName}</span>
                      </div>
                    </>
                  )}
                  {retorno.paymentMethod === "bank_transfer" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Banco</span>
                        <span>{retorno.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Referencia</span>
                        <span className="font-mono">{retorno.transferReference}</span>
                      </div>
                      {retorno.transferProofName && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Comprobante</span>
                          <span className="flex items-center gap-1 text-primary">
                            <Paperclip className="size-3" />
                            {retorno.transferProofName}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Procesado el {formatDateTime(retorno.createdAt)}
            </div>

            {/* Ticket / Observation */}
            {!ticket ? (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-sm font-medium">¿Tienes alguna observación?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Si el monto o los detalles no son correctos, puedes abrir una observación y nuestro equipo la revisará.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 rounded-xl gap-1.5"
                  onClick={() => setCreateTicketOpen(true)}
                >
                  <Flag className="size-4" />
                  Abrir observación
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Flag className="size-3.5" />
                    Tu observación
                  </h4>
                  <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-semibold", ticketCfg?.color)}>
                    {ticketCfg?.label}
                  </span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Asunto</p>
                    <p className="text-sm font-medium">{ticket.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{ticketCfg?.description}</p>

                  {ticket.status === "resolved" && resolvedActivity && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-emerald-700">Respuesta del equipo</p>
                      <RichTextContent html={resolvedActivity.description ?? ""} />
                      {resolvedActivity.attachments && resolvedActivity.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {resolvedActivity.attachments.map((a, i) => (
                            <a
                              key={i}
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Paperclip className="size-3" />
                              {a.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl gap-1.5"
                      onClick={() => setActivityOpen(true)}
                    >
                      <History className="size-4" />
                      Ver historial
                    </Button>
                    {ticket.status === "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50"
                        onClick={() => setReopenOpen(true)}
                      >
                        <RotateCcw className="size-4" />
                        Reabrir caso
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CreateTicketDialog
        retorno={retorno}
        open={createTicketOpen}
        onOpenChange={setCreateTicketOpen}
        userName={userName}
      />

      <ReopenTicketDialog
        retorno={retorno}
        open={reopenOpen}
        onOpenChange={setReopenOpen}
        userName={userName}
      />

      <UserTicketActivitySheet
        retorno={retorno}
        open={activityOpen}
        onOpenChange={setActivityOpen}
      />
    </>
  );
}
