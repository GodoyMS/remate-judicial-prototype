"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { AdminUser } from "@/lib/admin/types";

interface DmUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DmUserDialog({ user, open, onOpenChange }: DmUserDialogProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!user || !subject || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast.success("Mensaje enviado", {
        description: `Notificación directa enviada a ${user.name}`,
      });
      setSubject("");
      setMessage("");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Enviar mensaje directo</DialogTitle>
          <DialogDescription>
            {user ? `Comunicación directa con ${user.name} (${user.email})` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              placeholder="Ej. Actualización de tu inversión"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje aquí..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={!subject || !message || loading}
            className="rounded-xl"
          >
            <Send className="size-4 mr-1" />
            {loading ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
