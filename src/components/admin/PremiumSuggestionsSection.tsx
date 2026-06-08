"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Crown,
  Sparkles,
  TrendingUp,
  Building2,
  ShieldCheck,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserTierDialog } from "@/components/admin/UserTierDialog";
import type { PremiumCandidate } from "@/lib/admin/analytics";
import type { AdminUser, UserTier } from "@/lib/admin/types";
import { formatCurrency } from "@/lib/admin/formatters";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PremiumSuggestionsSectionProps {
  candidates: PremiumCandidate[];
  onTierChange?: (userId: string, tier: UserTier) => void;
}

export function PremiumSuggestionsSection({
  candidates,
  onTierChange,
}: PremiumSuggestionsSectionProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localCandidates, setLocalCandidates] = useState(candidates);

  const handleUpgradeClick = (candidate: PremiumCandidate) => {
    setSelectedUser(candidate.user);
    setDialogOpen(true);
  };

  const handleConfirm = (user: AdminUser, newTier: UserTier, notify: boolean) => {
    setLocalCandidates((prev) => prev.filter((c) => c.user.id !== user.id));
    onTierChange?.(user.id, newTier);
    setDialogOpen(false);
    toast.success(
      notify
        ? `${user.name} ahora es Premium. Se envió notificación por correo.`
        : `${user.name} ahora es Premium.`
    );
  };

  if (localCandidates.length === 0) {
    return (
      <Card className="rounded-2xl border-border/60 border-dashed">
        <CardContent className="py-12 text-center">
          <div className="size-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Crown className="size-7 text-amber-600" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No hay candidatos Premium pendientes
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Todos los inversores destacados ya tienen plan Premium o no cumplen los criterios
            mínimos de scoring.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {localCandidates.map((candidate, i) => (
          <motion.div
            key={candidate.user.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={cn(
                "rounded-2xl border-border/60 overflow-hidden h-full transition-shadow hover:shadow-md",
                candidate.score >= 70 && "border-amber-200/80 bg-gradient-to-br from-amber-50/30 to-background"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "size-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                        candidate.score >= 70
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {candidate.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold truncate">
                        {candidate.user.name}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {candidate.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[10px] font-bold tabular-nums",
                      candidate.score >= 70
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-slate-200"
                    )}
                  >
                    {candidate.score}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span>Score de elegibilidad Premium</span>
                    <span className="font-semibold">{candidate.score}/100</span>
                  </div>
                  <Progress
                    value={candidate.score}
                    className={cn("h-2", candidate.score >= 70 && "[&>div]:bg-amber-500")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <MetricPill
                    icon={TrendingUp}
                    label="Invertido"
                    value={formatCurrency(candidate.metrics.totalInvested)}
                  />
                  <MetricPill
                    icon={Building2}
                    label="Propiedades"
                    value={String(candidate.metrics.propertiesCount)}
                  />
                  <MetricPill
                    icon={ShieldCheck}
                    label="Ganancias"
                    value={formatCurrency(candidate.metrics.totalGains)}
                  />
                  <MetricPill
                    icon={Calendar}
                    label="Antigüedad"
                    value={`${Math.floor(candidate.metrics.daysActive / 30)} meses`}
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Por qué se sugiere
                  </p>
                  <ul className="space-y-1">
                    {candidate.reasons.map((reason) => (
                      <li
                        key={reason}
                        className="flex items-start gap-1.5 text-[11px] text-foreground/85 leading-snug"
                      >
                        <Sparkles className="size-3 shrink-0 mt-0.5 text-amber-500" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white h-9"
                    onClick={() => handleUpgradeClick(candidate)}
                  >
                    <Crown className="size-3.5 mr-1.5" />
                    Activar Premium
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl h-9 px-3"
                    asChild
                  >
                    <Link href="/admin/users">
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-200/60 bg-amber-50/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Crown className="size-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-900">
            <strong>{localCandidates.length} inversores</strong> identificados como candidatos
            Premium según capital, actividad y rendimiento.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="rounded-lg text-amber-700 hover:text-amber-800 shrink-0" asChild>
          <Link href="/admin/users">
            Ver todos los usuarios
            <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      <UserTierDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function MetricPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wide">
        <Icon className="size-2.5" />
        {label}
      </div>
      <p className="text-xs font-semibold mt-0.5 truncate">{value}</p>
    </div>
  );
}
