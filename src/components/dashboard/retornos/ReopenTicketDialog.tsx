"use client";

import { useRef, useState } from "react";
import { RotateCcw, Paperclip, X, Loader2 } from "lucide-react";
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
import { reopenTicket } from "@/lib/retornos/store";
import type { Retorno, TicketAttachment } from "@/lib/retornos/types";
import { isRichTextEmpty } from "@/lib/rich-text";

interface ReopenTicketDialogProps {
  retorno: Retorno | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export function ReopenTicketDialog({
  retorno,
  open,
  onOpenChange,
  userName,
}: ReopenTicketDialogProps) {
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleClose() {
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

  async function handleSubmit() {
    if (!retorno || isRichTextEmpty(description)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    reopenTicket(retorno.id, description, attachments, userName);
    setSubmitting(false);
    toast.success("Observación adicional enviada. El equipo volverá a revisar tu caso.");
    handleClose();
  }

  if (!retorno?.ticket) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="size-4 text-orange-500" />
            Reabrir observación
          </DialogTitle>
          <DialogDescription>
            Describe por qué no estás conforme con la respuesta recibida. Tu caso será revisado nuevamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
            <p className="text-xs text-muted-foreground">Ticket anterior</p>
            <p className="mt-0.5 text-sm font-medium">{retorno.ticket.title}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tu nueva observación <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Explica por qué no estás conforme con la respuesta..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Adjuntos (opcional)
            </Label>
            <div className="flex flex-wrap gap-2">
              {attachments.map((a, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs">
                  <Paperclip className="size-3 text-muted-foreground" />
                  <span className="max-w-[140px] truncate">{a.name}</span>
                  <button onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}>
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
          <Button variant="ghost" onClick={handleClose} disabled={submitting} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || isRichTextEmpty(description)}
            className="rounded-xl"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 size-4" />
                Reabrir caso
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
