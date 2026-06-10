"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Ticket,
  User,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import type { Complaint } from "@/lib/admin/types";
import { respondToComplaint } from "@/lib/complaints/store";
import { currentAdmin } from "@/lib/admin/mock-data";
import { formatDateTime } from "@/lib/admin/formatters";
import { isRichTextEmpty, stripHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

interface ComplaintResponseDialogProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponded: (complaint: Complaint) => void;
}

const RESPONSE_TEMPLATES = [
  {
    label: "Saludo estándar",
    html: "<p>Estimado/a cliente,</p><p><br></p><p>Gracias por contactarnos. Hemos revisado su caso y le informamos lo siguiente:</p><p><br></p>",
  },
  {
    label: "Solicitar información",
    html: "<p>Para continuar con la revisión, necesitamos que nos envíe la siguiente información adicional:</p><ul><li></li></ul><p><br></p>",
  },
  {
    label: "Cierre cordial",
    html: "<p><br></p><p>Quedamos atentos a cualquier consulta adicional.</p><p>Saludos cordiales,<br>Equipo de Atención al Cliente — Remata</p>",
  },
] as const;

const typeLabels: Record<Complaint["type"], string> = {
  reclamo: "Reclamo",
  queja: "Queja",
  sugerencia: "Sugerencia",
  consulta: "Consulta",
};

export function ComplaintResponseDialog({
  complaint,
  open,
  onOpenChange,
  onResponded,
}: ComplaintResponseDialogProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const plainLength = stripHtml(message).length;
  const canSend = !isRichTextEmpty(message) && plainLength <= 4000;

  const handleSend = () => {
    if (!complaint || !canSend) return;

    setLoading(true);
    setTimeout(() => {
      const updated = respondToComplaint(complaint.id, {
        message: message.trim(),
        respondedBy: currentAdmin.name,
      });

      if (updated) {
        onResponded(updated);
        toast.success("Respuesta enviada por correo", {
          description: `Se envió la respuesta a ${complaint.email} (simulado)`,
        });
      }

      setLoading(false);
      setMessage("");
      onOpenChange(false);
    }, 1500);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setMessage("");
    onOpenChange(next);
  };

  const applyTemplate = (html: string) => {
    setMessage((prev) => (prev ? `${prev}${html}` : html));
  };

  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="border-b border-border/60 bg-muted/20 px-6 py-5">
          <DialogHeader className="text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Ticket className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg">Responder reclamación</DialogTitle>
                <DialogDescription className="mt-1">
                  Redacta una respuesta profesional que se enviará por correo al solicitante.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* Ticket context panel */}
          <aside className="space-y-4 border-b border-border/60 bg-muted/10 p-5 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                {complaint.id}
              </span>
              <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                {typeLabels[complaint.type]}
              </span>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="size-4 text-muted-foreground" />
                {complaint.fullName}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="size-3.5" />
                {complaint.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {formatDateTime(complaint.createdAt)}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Asunto
              </p>
              <p className="text-sm font-medium leading-snug">{complaint.subject}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Descripción
              </p>
              <p className="max-h-40 overflow-y-auto text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
          </aside>

          {/* Composer panel */}
          <div className="flex flex-col p-5">
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="response" className="text-sm font-semibold">
                  Tu respuesta *
                </Label>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    plainLength > 4000 ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {plainLength}/4000
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {RESPONSE_TEMPLATES.map((template) => (
                  <Button
                    key={template.label}
                    type="button"
                    variant="outline"
                    size="xs"
                    className="rounded-lg"
                    onClick={() => applyTemplate(template.html)}
                  >
                    <Sparkles className="size-3" />
                    {template.label}
                  </Button>
                ))}
              </div>

              <RichTextEditor
                id="response"
                value={message}
                onChange={setMessage}
                placeholder="Escribe la respuesta que se enviará al correo del usuario..."
                minHeight="220px"
              />
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs text-blue-700">
                <Mail className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Prototipo: la respuesta se simulará como envío a{" "}
                  <strong>{complaint.email}</strong>
                </span>
              </div>

              <DialogFooter className="gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!canSend || loading}
                  className="rounded-xl"
                >
                  <Send className="mr-2 size-4" />
                  {loading ? "Enviando..." : "Enviar respuesta"}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
