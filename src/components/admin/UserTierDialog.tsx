"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AdminUser, UserTier } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

interface UserTierDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: AdminUser, newTier: UserTier, notify: boolean) => void;
}

const tierBenefits: Record<UserTier, string[]> = {
  standard: [
    "Acceso a subastas publicadas",
    "Dashboard de inversiones",
    "Soporte por correo electrónico",
    "Comisión estándar del 1.5%",
  ],
  premium: [
    "Acceso anticipado a nuevas subastas",
    "Análisis detallado de propiedades",
    "Soporte prioritario 24/7",
    "Comisión reducida del 0.5%",
  ],
};

const tierMeta: Record<
  UserTier,
  { label: string; description: string; accent: string; iconBg: string }
> = {
  standard: {
    label: "Standard",
    description: "Plan base para todos los usuarios registrados",
    accent: "text-slate-600",
    iconBg: "bg-slate-100 text-slate-600",
  },
  premium: {
    label: "Premium",
    description: "Experiencia completa con beneficios exclusivos",
    accent: "text-amber-700",
    iconBg: "bg-amber-100 text-amber-700",
  },
};

export function UserTierDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: UserTierDialogProps) {
  const [notify, setNotify] = useState(true);
  const [loading, setLoading] = useState(false);

  const currentTier = user?.tier ?? "standard";
  const targetTier: UserTier = currentTier === "premium" ? "standard" : "premium";
  const isUpgrade = targetTier === "premium";

  useEffect(() => {
    if (open) {
      setNotify(true);
      setLoading(false);
    }
  }, [open, user?.id]);

  const handleConfirm = () => {
    if (!user) return;
    setLoading(true);
    window.setTimeout(() => {
      onConfirm(user, targetTier, notify);
      setLoading(false);
    }, 650);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 gap-0 overflow-hidden">
        <div
          className={cn(
            "px-6 pt-6 pb-5 border-b border-border/40",
            isUpgrade
              ? "bg-gradient-to-br from-amber-50/90 via-background to-background"
              : "bg-gradient-to-br from-slate-50/80 via-background to-background"
          )}
        >
          <DialogHeader className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ring-2 ring-background shadow-sm",
                  isUpgrade ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                )}
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg leading-tight">
                  {isUpgrade ? "Activar plan Premium" : "Volver a plan Standard"}
                </DialogTitle>
                <DialogDescription className="text-sm mt-0.5 truncate">
                  {user.name} · {user.email}
                </DialogDescription>
              </div>
              <Badge
                variant={currentTier === "premium" ? "default" : "outline"}
                className="shrink-0 text-[10px]"
              >
                {currentTier === "premium" ? (
                  <Crown className="size-3 mr-0.5" />
                ) : (
                  <User className="size-3 mr-0.5" />
                )}
                {tierMeta[currentTier].label}
              </Badge>
            </div>
          </DialogHeader>

          <div className="mt-5 flex items-center justify-center gap-3">
            <TierPill tier={currentTier} active />
            <motion.div
              key={targetTier}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-muted-foreground"
            >
              <ArrowRight className="size-4" />
            </motion.div>
            <TierPill tier={targetTier} highlight={isUpgrade} />
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={targetTier}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "rounded-xl border p-4",
                isUpgrade
                  ? "border-amber-200/80 bg-amber-50/40"
                  : "border-slate-200/80 bg-slate-50/50"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={cn(
                    "size-9 rounded-lg flex items-center justify-center shrink-0",
                    tierMeta[targetTier].iconBg
                  )}
                >
                  {isUpgrade ? (
                    <Sparkles className="size-4" />
                  ) : (
                    <User className="size-4" />
                  )}
                </div>
                <div>
                  <p className={cn("text-sm font-semibold", tierMeta[targetTier].accent)}>
                    {isUpgrade
                      ? "El usuario obtendrá acceso Premium"
                      : "El usuario volverá al plan Standard"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tierMeta[targetTier].description}
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {tierBenefits[targetTier].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-xs text-foreground/90">
                    <CheckCircle2
                      className={cn(
                        "size-3.5 shrink-0 mt-0.5",
                        isUpgrade ? "text-amber-600" : "text-slate-500"
                      )}
                    />
                    {benefit}
                  </li>
                ))}
              </ul>

              {!isUpgrade && (
                <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/50">
                  Se desactivarán los beneficios Premium de forma inmediata. Las inversiones
                  activas no se verán afectadas.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <Separator />

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-3">
            <Checkbox
              id="notify-user"
              checked={notify}
              onCheckedChange={(checked) => setNotify(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-0.5">
              <Label htmlFor="notify-user" className="text-sm font-medium cursor-pointer">
                Notificar al usuario por correo
              </Label>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Enviaremos un email confirmando el cambio de plan a {user.email}.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0 sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl sm:mr-auto"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "rounded-xl min-w-[140px]",
              isUpgrade && "bg-amber-600 hover:bg-amber-700 text-white"
            )}
          >
            {loading ? (
              "Aplicando..."
            ) : isUpgrade ? (
              <>
                <Crown className="size-4 mr-1.5" />
                Activar Premium
              </>
            ) : (
              <>
                <Zap className="size-4 mr-1.5" />
                Volver a Standard
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TierPill({
  tier,
  active,
  highlight,
}: {
  tier: UserTier;
  active?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
        tier === "premium"
          ? highlight
            ? "border-amber-300 bg-amber-100 text-amber-800 shadow-sm"
            : active
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-amber-100 bg-background text-amber-600"
          : highlight
            ? "border-slate-300 bg-slate-100 text-slate-800 shadow-sm"
            : active
              ? "border-slate-200 bg-slate-50 text-slate-700"
              : "border-slate-100 bg-background text-slate-600"
      )}
    >
      {tier === "premium" ? <Crown className="size-3" /> : <User className="size-3" />}
      {tierMeta[tier].label}
    </div>
  );
}
