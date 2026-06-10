"use client";

import { Mail, Phone, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Complaint } from "@/lib/admin/types";
import { formatDateTime } from "@/lib/admin/formatters";
import { cn } from "@/lib/utils";
import { RichTextContent } from "@/components/admin/RichTextContent";

const typeLabels: Record<Complaint["type"], string> = {
  reclamo: "Reclamo",
  queja: "Queja",
  sugerencia: "Sugerencia",
  consulta: "Consulta",
};

const statusConfig: Record<
  Complaint["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pendiente",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  in_review: {
    label: "En revisión",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  resolved: {
    label: "Resuelto",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

interface ComplaintDetailSheetProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRespond: (complaint: Complaint) => void;
}

export function ComplaintDetailSheet({
  complaint,
  open,
  onOpenChange,
  onRespond,
}: ComplaintDetailSheetProps) {
  if (!complaint) return null;

  const status = statusConfig[complaint.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left">Detalle de reclamación</SheetTitle>
          <SheetDescription className="text-left font-mono text-xs">
            {complaint.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
                status.className
              )}
            >
              {status.label}
            </span>
            <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {typeLabels[complaint.type]}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Solicitante
            </h4>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
              <p className="font-medium">{complaint.fullName}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-3.5" />
                {complaint.email}
              </div>
              {complaint.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-3.5" />
                  {complaint.phone}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {complaint.documentType.toUpperCase()}: {complaint.documentNumber}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reclamación
            </h4>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
              <p className="font-medium">{complaint.subject}</p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                Registrado el {formatDateTime(complaint.createdAt)}
              </div>
            </div>
          </div>

          {complaint.response && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                <CheckCircle2 className="size-3.5" />
                Respuesta enviada
              </h4>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                <RichTextContent html={complaint.response.message} />
                <p className="text-xs text-muted-foreground">
                  Por {complaint.response.respondedBy} ·{" "}
                  {formatDateTime(complaint.response.respondedAt)}
                </p>
              </div>
            </div>
          )}

          {complaint.status !== "resolved" && (
            <Button
              className="w-full rounded-xl"
              onClick={() => {
                onOpenChange(false);
                onRespond(complaint);
              }}
            >
              <Mail className="mr-2 size-4" />
              Responder por correo
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
