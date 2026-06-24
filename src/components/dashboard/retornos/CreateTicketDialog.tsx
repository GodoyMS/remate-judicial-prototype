"use client";

import { useRef, useState } from "react";
import { Paperclip, X, Loader2, Flag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { openTicket } from "@/lib/retornos/store";
import type { Retorno, TicketReason, TicketAttachment } from "@/lib/retornos/types";
import { isRichTextEmpty } from "@/lib/rich-text";

const REASONS: { value: TicketReason; label: string; description: string }[] = [
  { value: "wrong_amount", label: "Monto incorrecto", description: "El monto recibido no corresponde al esperado" },
  { value: "not_received", label: "No recibido", description: "No he recibido el retorno en mi cuenta" },
  { value: "wrong_property", label: "Propiedad incorrecta", description: "Este retorno no corresponde a mi inversión" },
  { value: "processing_error", label: "Error de procesamiento", description: "Hubo un problema al procesar el pago" },
  { value: "other", label: "Otro motivo", description: "Otro tipo de observación" },
];

interface CreateTicketDialogProps {
  retorno: Retorno | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export function CreateTicketDialog({
  retorno,
  open,
  onOpenChange,
  userName,
}: CreateTicketDialogProps) {
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState<TicketReason | "">("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    setTitle("");
    setReason("");
    setDescription("");
    setAttachments([]);
    onOpenChange(false);
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const added: TicketAttachment[] = Array.from(files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      mimeType: f.type,
    }));
    setAttachments((prev) => [...prev, ...added]);
  }

  function removeAttachment(i: number) {
    setAttachments((prev) => prev.filter((_, idx) => idx !== i));
  }

  const canSubmit =
    title.trim().length >= 3 && reason && !isRichTextEmpty(description);

  async function handleSubmit() {
    if (!retorno || !canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    openTicket(
      retorno.id,
      { title: title.trim(), reason: reason as TicketReason, description, attachments },
      userName
    );
    setSubmitting(false);
    toast.success("Observación enviada. Nuestro equipo la revisará pronto.");
    handleClose();
  }

  if (!retorno) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="size-4 text-amber-500" />
            Abrir observación
          </DialogTitle>
          <DialogDescription>
            Describe tu observación sobre este retorno. El equipo revisará tu solicitud.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm">
            <p className="text-xs text-muted-foreground">Retorno relacionado</p>
            <p className="mt-0.5 font-medium">{retorno.propertyTitle}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Ej: El monto no coincide con mi cálculo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Select value={reason} onValueChange={(v) => setReason(v as TicketReason)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecciona un motivo..." />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <div>
                      <span className="font-medium">{r.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{r.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Descripción <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Explica con detalle tu observación..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Adjuntos (opcional)
            </Label>
            <div className="flex flex-wrap gap-2">
              {attachments.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs"
                >
                  <Paperclip className="size-3 text-muted-foreground" />
                  <span className="max-w-[140px] truncate">{a.name}</span>
                  <button onClick={() => removeAttachment(i)}>
                    <X className="size-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
              >
                <Paperclip className="size-3" />
                Adjuntar archivo
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={submitting} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="rounded-xl"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Flag className="mr-2 size-4" />
                Enviar observación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
