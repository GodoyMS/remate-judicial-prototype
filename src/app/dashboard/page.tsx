"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Building2,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Crown,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { PremiumUpgradeBanner } from "@/components/dashboard/PremiumUpgradeBanner";
import { InvestmentCard } from "@/components/dashboard/InvestmentCard";
import { InvestmentDetailSheet } from "@/components/dashboard/InvestmentDetailSheet";
import { useCurrentUser } from "@/contexts/user-context";
import { useNotifications } from "@/contexts/notifications-context";
import { premiumProperties } from "@/lib/premium/mock-data";
import {
  getActiveInvestmentsForUser,
  getPropertyById,
  formatDateTime,
} from "@/lib/dashboard/mock-data";
import { getOutcomeReturnAmount } from "@/lib/dashboard/outcome";
import { PROCESS_STAGE_LABELS } from "@/lib/dashboard/types";
import { formatMixedCurrencyTotals, sumByCurrency } from "@/lib/currency";
import { CATEGORY_META } from "@/lib/dashboard/notifications";
import type { ActiveInvestmentView } from "@/lib/dashboard/mock-data";

export default function DashboardPage() {
  const { user, isPremium } = useCurrentUser();
  const { notifications, unreadCount } = useNotifications();
  const availablePremium = premiumProperties.filter((p) => p.status === "available");

  const [selectedInvestment, setSelectedInvestment] = useState<ActiveInvestmentView | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const investments = useMemo(() => getActiveInvestmentsForUser(), []);
  const inProgress = investments.filter((i) => i.status === "active" || i.status === "pending");

  const stageBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const inv of inProgress) {
      const label = PROCESS_STAGE_LABELS[inv.stage];
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return [...counts.entries()].map(([label, count]) => `${count} en ${label.toLowerCase()}`);
  }, [inProgress]);

  const investedByCurrency = sumByCurrency(
    investments.filter((i) => i.status !== "cancelled")
  );
  const realizedGains = investments
    .filter((i) => i.outcome.kind === "settled" && i.outcome.roi > 0)
    .reduce(
      (acc, i) => {
        acc[i.currency] = (acc[i.currency] ?? 0) + getOutcomeReturnAmount(i.outcome, i.amount);
        return acc;
      },
      {} as Partial<Record<"PEN" | "USD", number>>
    );

  const summaryCards = [
    {
      label: "Total invertido",
      value: formatMixedCurrencyTotals(investedByCurrency),
      change: null,
      icon: Wallet,
      color: "bg-info/10 text-info",
    },
    {
      label: "Inversiones en curso",
      value: String(inProgress.length),
      change: stageBreakdown.join(" · ") || "Sin inversiones en curso",
      icon: Building2,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Retornos generados",
      value: formatMixedCurrencyTotals(realizedGains),
      change: "Solo ganancias realizadas, sin capital devuelto",
      icon: TrendingUp,
      color: "bg-success/10 text-success",
    },
  ];

  const recentUpdates = notifications.slice(0, 5);

  // "Requiere tu atención" (E-004): estado de verificación + notificaciones sin leer.
  const attentionItem = !user.verified
    ? { text: "Tu verificación de identidad está en proceso.", href: "/dashboard/account" }
    : unreadCount > 0
      ? {
          text: `${unreadCount} notificación${unreadCount > 1 ? "es" : ""} nueva${unreadCount > 1 ? "s" : ""} por revisar.`,
          href: "/dashboard/notifications",
        }
      : null;

  // CTA contextual (E-013)
  const closingSoon = inProgress
    .filter((i) => i.stage === "subasta" && i.daysUntilRoi > 0)
    .sort((a, b) => a.daysUntilRoi - b.daysUntilRoi)[0];
  const contextualCta = attentionItem
    ? { label: "Revisar pendiente", href: attentionItem.href }
    : closingSoon
      ? { label: `Ver inversión que cierra en ${closingSoon.daysUntilRoi} días`, href: "/dashboard/my-investments" }
      : { label: "Explorar oportunidades", href: "/dashboard/properties" };

  return (
    <div className="w-full">
      {/* 1. Saludo + dato contextual + un solo CTA sólido (E-014) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="dash-title text-foreground whitespace-nowrap">
              Buenos días, {user.name.split(" ")[0]} 👋
            </h2>
            {isPremium && <PremiumBadge size="md" />}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Sigue cada etapa de tus inversiones desde un solo lugar.
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full sm:w-auto"
        >
          <Link href={contextualCta.href}>
            {contextualCta.label}
            <ArrowRight className="size-4 ml-1" />
          </Link>
        </Button>
      </motion.div>

      {/* 2. Requiere tu atención (E-004) */}
      <div className="mb-6 rounded-2xl border border-border/60 bg-secondary/5 p-4 flex items-center gap-3">
        <div
          className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
            attentionItem ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
          }`}
        >
          <CheckCircle2 className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Requiere tu atención
          </p>
          {attentionItem ? (
            <Link href={attentionItem.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {attentionItem.text}
            </Link>
          ) : (
            <p className="text-sm font-medium text-foreground">No tienes acciones pendientes.</p>
          )}
        </div>
      </div>

      {/* 3. Métricas del portafolio (E-009) */}
      <div className="grid sm:grid-cols-3 gap-4 mb-2">
        {summaryCards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-secondary/5 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <div className={`size-9 rounded-xl flex items-center justify-center ${c.color.split(" ")[0]}`}>
                <c.icon className={`size-4 ${c.color.split(" ")[1]}`} />
              </div>
            </div>
            <div>
              <p className="dash-display text-foreground">{c.value}</p>
              {c.change && (
                <p className="text-xs mt-1 flex items-center gap-1 text-muted-foreground">
                  {c.label === "Total invertido" && <ArrowUpRight className="size-3" />}
                  {c.change}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mb-8">
        Información actualizada: {formatDateTime(new Date().toISOString())}
      </p>

      {/* 4. Tus inversiones (WP-2.3) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Tus inversiones</h3>
          <Link
            href="/dashboard/my-investments"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 min-h-11 px-2 -mr-2"
          >
            Ver todas
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {investments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            Aún no tienes inversiones. Explora oportunidades para empezar.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {investments.slice(0, 4).map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.15 }}
              >
                <InvestmentCard
                  investment={inv}
                  onViewDetail={(investment) => {
                    setSelectedInvestment(investment);
                    setSheetOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Últimas actualizaciones de tu cuenta (E-029) */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-foreground">Últimas actualizaciones de tu cuenta</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">
          Cambios, documentos y movimientos relacionados con tus inversiones.
        </p>
        <div className="rounded-2xl border border-border/60 bg-secondary/5 p-4 flex flex-col">
          {recentUpdates.map((n, i) => {
            const meta = CATEGORY_META[n.category];
            return (
              <Link
                key={n.id}
                href={n.href ?? "/dashboard/notifications"}
                className={`flex items-start gap-3 py-3 hover:bg-secondary/10 -mx-2 px-2 rounded-lg transition-colors ${
                  i < recentUpdates.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${meta.bg}`}>
                  <FileText className={`size-3.5 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.timeAgo}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 6. Premium — compacto (E-008, E-015, E-022) */}
      {!isPremium ? (
        <PremiumUpgradeBanner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-premium/20 bg-premium/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-premium/15 flex items-center justify-center shrink-0">
              <Crown className="size-4 text-premium" />
            </div>
            <div>
              <p className="text-sm font-semibold">Oportunidades Premium activas</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {availablePremium.length} disponibles para inversión individual del 100% del capital.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-premium/40 text-premium shrink-0 w-full sm:w-auto">
            <Link href="/dashboard/premium-properties?filter=available">
              Ver oportunidades
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
        </motion.div>
      )}

      <InvestmentDetailSheet
        investment={selectedInvestment}
        property={selectedInvestment ? (getPropertyById(selectedInvestment.propertyId) ?? null) : null}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
