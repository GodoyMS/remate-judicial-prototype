"use client";

import { useState } from "react";
import { CalendarClock, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/brand";
import { ResponsiveDialog } from "./ResponsiveDialog";

export const PREMIUM_ADVISOR = {
  name: "Lucía Paredes",
  role: "Asesora Premium",
  initials: "LP",
  email: "premium@rematto.pe",
  responseTime: "Responde en menos de 2 horas hábiles",
};

interface AdvisorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Para precargar el mensaje de WhatsApp con la operación en contexto. */
  context?: string;
}

/**
 * Vía humana para decisiones de seis cifras (P-023). Una persona con
 * nombre y tres canales concretos, en vez de un toast con un correo.
 */
export function AdvisorDialog({ open, onOpenChange, context }: AdvisorDialogProps) {
  const [scheduled, setScheduled] = useState(false);
  const message = encodeURIComponent(
    `Hola ${PREMIUM_ADVISOR.name.split(" ")[0]}, soy inversionista Premium${context ? ` y tengo una consulta sobre ${context}` : ""}.`
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Habla con tu asesora Premium"
      description="Revisa el expediente, los riesgos o el aporte con una persona antes de decidir."
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {PREMIUM_ADVISOR.initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{PREMIUM_ADVISOR.name}</p>
            <p className="text-xs text-muted-foreground">
              {PREMIUM_ADVISOR.role} · {PREMIUM_ADVISOR.responseTime}
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Button asChild className="h-11 justify-start rounded-xl">
            <a href={`https://wa.me/${CONTACT.whatsappNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              Escribir por WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="h-11 justify-start rounded-xl">
            <a href={`tel:${CONTACT.phoneHref}`}>
              <Phone />
              Llamar al {CONTACT.phone}
            </a>
          </Button>
          <Button
            variant="outline"
            className="h-11 justify-start rounded-xl"
            disabled={scheduled}
            onClick={() => {
              setScheduled(true);
              toast.success("Llamada solicitada", {
                description: `${PREMIUM_ADVISOR.name} te llamará hoy dentro del horario de atención.`,
              });
            }}
          >
            <CalendarClock />
            {scheduled ? "Llamada solicitada" : "Pedir que me llamen"}
          </Button>
          <Button asChild variant="ghost" className="h-10 justify-start rounded-xl text-muted-foreground">
            <a href={`mailto:${PREMIUM_ADVISOR.email}`}>
              <Mail />
              {PREMIUM_ADVISOR.email}
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Horario: {CONTACT.hours}</p>
      </div>
    </ResponsiveDialog>
  );
}
