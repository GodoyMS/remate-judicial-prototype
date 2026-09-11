"use client";

import { useState } from "react";
import { Crown, Sparkles, TrendingUp, Shield, Clock, CheckCircle2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/contexts/user-context";
import { saveUpgradeRequest, getUpgradeRequestForUser } from "@/lib/app-store";

interface PremiumUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequested?: () => void;
}

const PREMIUM_BENEFITS = [
  {
    icon: Crown,
    title: "Financia el 100% de una operación",
    description: "Eres el único inversionista de esa operación en particular",
  },
  {
    icon: TrendingUp,
    title: "Ventana de exclusividad",
    description: "Decides antes de que la operación se abra al capital colectivo",
  },
  {
    icon: Clock,
    title: "Acceso anticipado",
    description: "Ve las propiedades antes que otros inversores",
  },
  {
    icon: Shield,
    title: "Comisión reducida 0.5%",
    description: "Menos del tercio de la comisión estándar (1.5%)",
  },
  {
    icon: Sparkles,
    title: "Asesor asignado",
    description: "Acompañamiento dedicado durante todo el ciclo de la operación",
  },
];

export function PremiumUpgradeDialog({
  open,
  onOpenChange,
  onRequested,
}: PremiumUpgradeDialogProps) {
  const { user, refreshUpgradeRequest } = useCurrentUser();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const existingRequest = getUpgradeRequestForUser(user.id);
  const alreadyRequested =
    existingRequest?.status === "pending" || existingRequest?.status === "approved";

  const handleRequest = () => {
    setLoading(true);
    // Simulate a brief processing moment
    setTimeout(() => {
      const prior = getUpgradeRequestForUser(user.id);
      saveUpgradeRequest({
        id: prior?.status === "rejected" ? prior.id : `ur-${user.id}-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        totalInvested: user.totalInvested,
        submittedAt: new Date().toISOString(),
        status: "pending",
      });
      setLoading(false);
      setSubmitted(true);
      refreshUpgradeRequest();
      onRequested?.();
    }, 800);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset submitted state after dialog closes
    setTimeout(() => setSubmitted(false), 300);
  };

  const showSuccess = submitted || alreadyRequested;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden gap-0">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-premium to-premium/80 p-6 text-premium-foreground">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-premium-foreground/20 flex items-center justify-center">
                  <Crown className="size-5 text-premium-foreground" />
                </div>
                <DialogTitle className="text-lg font-bold text-premium-foreground">
                  Acceso Premium
                </DialogTitle>
              </div>
              <button
                onClick={handleClose}
                className="size-8 rounded-lg bg-premium-foreground/10 hover:bg-premium-foreground/20 flex items-center justify-center transition-colors"
              >
                <X className="size-4 text-premium-foreground" />
              </button>
            </div>
            <p className="text-sm text-premium-foreground/80 mt-2 text-left">
              Premium cambia cómo participas, no cuánto ganas: accedes individualmente
              a operaciones antes de que se abran al capital colectivo.
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          {/* Capacidad financiera, desde el inicio (P-012): Premium no es un
              plan con más beneficios, cambia radicalmente el ticket. */}
          {!showSuccess && (
            <div className="rounded-xl bg-muted/50 border border-border/60 p-3">
              <p className="text-xs text-foreground leading-relaxed">
                Premium está diseñado para inversionistas que pueden financiar
                individualmente el capital total requerido de una oportunidad —desde
                decenas de miles hasta más de un millón de soles o dólares, según la
                operación.
              </p>
            </div>
          )}
          {showSuccess ? (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="size-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-success" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">
                  Solicitud enviada
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Tu solicitud de upgrade a Premium está siendo revisada por nuestro equipo.
                  Te notificaremos cuando sea aprobada.
                </p>
              </div>
              <div className="w-full rounded-xl bg-warning/10 border border-warning/20 p-4 text-left">
                <p className="text-xs font-semibold text-warning mb-2">Estado</p>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-warning animate-pulse" />
                  <span className="text-sm text-warning font-medium">
                    Pendiente de aprobación
                  </span>
                </div>
                <p className="text-xs text-warning mt-2">
                  Tiempo estimado: 1-2 días hábiles
                </p>
              </div>
              <Button onClick={handleClose} className="w-full rounded-xl h-11">
                Entendido
              </Button>
            </div>
          ) : (
            <>
              {/* Benefits list */}
              <div className="space-y-3">
                {PREMIUM_BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-premium/10 flex items-center justify-center shrink-0 mt-0.5">
                      <benefit.icon className="size-4 text-premium" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison — nunca por ROI: mismo riesgo judicial, distinta
                  forma de participar (ver /premium). */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="rounded-xl border p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">
                    Estándar
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Participación colectiva</li>
                    <li>Comisión 1.5%</li>
                    <li>Acceso cuando abre al público</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-premium/20 bg-premium/10 p-3">
                  <p className="text-[10px] font-semibold text-premium uppercase mb-2">
                    Premium ✦
                  </p>
                  <ul className="space-y-1 text-xs text-foreground font-medium">
                    <li>100% individual</li>
                    <li>Comisión 0.5%</li>
                    <li>Ventana de exclusividad</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  onClick={handleRequest}
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-premium to-premium/80 hover:from-premium/90 hover:to-premium/70 text-premium-foreground font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="size-4 border-2 border-premium-foreground/40 border-t-premium-foreground rounded-full animate-spin" />
                      Enviando solicitud...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Crown className="size-4" />
                      Solicitar upgrade a Premium
                    </span>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Un administrador revisará tu solicitud y te contactará
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
