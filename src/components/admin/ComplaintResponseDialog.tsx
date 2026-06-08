"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Complaint } from "@/lib/admin/types";
import { respondToComplaint } from "@/lib/complaints/store";
import { currentAdmin } from "@/lib/admin/mock-data";

interface ComplaintResponseDialogProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponded: (complaint: Complaint) => void;
}

export function ComplaintResponseDialog({
  complaint,
  open,
  onOpenChange,
  onResponded,
}: ComplaintResponseDialogProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!complaint || !message.trim()) return;

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

  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Responder reclamación</DialogTitle>
          <DialogDescription>
            Envía una respuesta por correo a {complaint.fullName} ({complaint.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reclamación original
            </p>
            <p className="text-sm font-medium">{complaint.subject}</p>
            <p className="text-xs text-muted-foreground line-clamp-3">{complaint.description}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">Tu respuesta *</Label>
            <Textarea
              id="response"
              placeholder="Escribe la respuesta que se enviará al correo del usuario..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            <Mail className="size-3.5 shrink-0" />
            <span>
              Prototipo: la respuesta se simulará como envío a{" "}
              <strong>{complaint.email}</strong>
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="rounded-xl"
          >
            <Send className="mr-2 size-4" />
            {loading ? "Enviando..." : "Enviar respuesta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
