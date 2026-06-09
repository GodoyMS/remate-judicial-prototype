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
    title: "Captura al 100%",
    description: "Sé el único inversor de una propiedad exclusiva",
  },
  {
    icon: TrendingUp,
    title: "ROI hasta 52%",
    description: "Frente al 24% del plan estándar",
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
    title: "Soporte prioritario 24/7",
    description: "Atención dedicada para inversores premium",
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
  const alreadyRequested = !!existingRequest;

  const handleRequest = () => {
    setLoading(true);
    // Simulate a brief processing moment
    setTimeout(() => {
      saveUpgradeRequest({
        id: `ur-${user.id}-${Date.now()}`,
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
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Crown className="size-5 text-white" />
                </div>
                <DialogTitle className="text-lg font-bold text-white">
                  Plan Premium
                </DialogTitle>
              </div>
              <button
                onClick={handleClose}
                className="size-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="size-4 text-white" />
              </button>
            </div>
            <p className="text-sm text-white/80 mt-2 text-left">
              Accede a las inversiones más exclusivas con retornos excepcionales
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          {showSuccess ? (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-emerald-600" />
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
              <div className="w-full rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
                <p className="text-xs font-semibold text-amber-800 mb-2">Estado</p>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm text-amber-900 font-medium">
                    Pendiente de aprobación
                  </span>
                </div>
                <p className="text-xs text-amber-700 mt-2">
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
                    <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                      <benefit.icon className="size-4 text-amber-600" />
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

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="rounded-xl border p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">
                    Estándar
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>ROI hasta 24%</li>
                    <li>Comisión 1.5%</li>
                    <li>Acceso normal</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3">
                  <p className="text-[10px] font-semibold text-amber-700 uppercase mb-2">
                    Premium ✦
                  </p>
                  <ul className="space-y-1 text-xs text-foreground font-medium">
                    <li>ROI hasta 52%</li>
                    <li>Comisión 0.5%</li>
                    <li>Acceso anticipado</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  onClick={handleRequest}
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
