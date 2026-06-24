"use client";

import { useRef, useState } from "react";
import { Check, Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { resolveTicket } from "@/lib/retornos/store";
import type { Retorno, TicketAttachment } from "@/lib/retornos/types";
import { isRichTextEmpty } from "@/lib/rich-text";

interface ResolveTicketDialogProps {
  retorno: Retorno | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resolverName: string;
  onResolved: () => void;
}

export function ResolveTicketDialog({
  retorno,
  open,
  onOpenChange,
  resolverName,
  onResolved,
}: ResolveTicketDialogProps) {
  const [response, setResponse] = useState("");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    setResponse("");
    setAttachments([]);
    onOpenChange(false);
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newAttachments: TicketAttachment[] = Array.from(files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      mimeType: f.type,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!retorno || isRichTextEmpty(response)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    resolveTicket(retorno.id, response, attachments, resolverName);
    setSubmitting(false);
    toast.success("Ticket resuelto y respuesta enviada al cliente");
    handleClose();
    onResolved();
  }

  if (!retorno?.ticket) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Resolver ticket</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {retorno.ticket.id} · {retorno.ticket.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Observación del cliente</p>
            <p className="mt-0.5 text-sm font-medium">{retorno.ticket.title}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Respuesta oficial <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              value={response}
              onChange={setResponse}
              placeholder="Escribe una respuesta clara y completa para el cliente..."
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
                  <button onClick={() => removeAttachment(i)} className="ml-1">
                    <X className="size-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <Paperclip className="size-3" />
                Adjuntar
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
          <Button variant="ghost" onClick={handleClose} className="rounded-xl" disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || isRichTextEmpty(response)}
            className="rounded-xl"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Check className="mr-2 size-4" />
                Resolver y enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
