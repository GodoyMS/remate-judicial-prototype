"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Crown, FileText, Gavel, PenLine, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumUpgradeBanner } from "@/components/dashboard/PremiumUpgradeBanner";
import { InvestmentCard } from "@/components/dashboard/InvestmentCard";
import { InvestmentDetailSheet } from "@/components/dashboard/InvestmentDetailSheet";
import { PortfolioOverview } from "@/components/dashboard/home/PortfolioOverview";
import { KpiCards } from "@/components/dashboard/home/KpiCards";
import { PriorityActions, type PriorityAction } from "@/components/dashboard/home/PriorityActions";
import { SectionBar } from "@/components/dashboard/home/SectionBar";
import { RecentActivity } from "@/components/dashboard/home/RecentActivity";
import { FeaturedOpportunity } from "@/components/dashboard/home/FeaturedOpportunity";
import { AccountTiers } from "@/components/dashboard/home/AccountTiers";
import { useCurrentUser } from "@/contexts/user-context";
import { useNotifications } from "@/contexts/notifications-context";
import { premiumProperties } from "@/lib/premium/mock-data";
import {
  getActiveInvestmentsForUser,
  getPropertyById,
  formatDateTime,
  dashboardProperties,
} from "@/lib/dashboard/mock-data";
import { getOutcomeReturnAmount } from "@/lib/dashboard/outcome";
import { PROCESS_STAGE_LABELS } from "@/lib/dashboard/types";
import { formatMixedCurrencyTotals, sumByCurrency } from "@/lib/currency";
import type { ActiveInvestmentView } from "@/lib/dashboard/mock-data";

/** Entrada suave y escalonada, común a todas las secciones de Inicio. */
const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35, ease: "easeOut" as const },
});

export default function DashboardPage() {
  const { user, isPremium } = useCurrentUser();
  const { notifications } = useNotifications();
  const availablePremium = premiumProperties.filter((p) => p.status === "available");

  const [selectedInvestment, setSelectedInvestment] = useState<ActiveInvestmentView | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // "Información actualizada" solo se conoce al montar en el cliente: fijarla
  // durante el render de servidor produciría un mismatch de hidratación,
  // porque SSR y cliente evalúan Date.now() en instantes distintos.
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  useEffect(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

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

  // Acciones prioritarias (E-004): verificación pendiente + hitos del proceso
  // que piden algo al usuario. Máximo tres, en orden de urgencia.
  const priorityActions = useMemo<PriorityAction[]>(() => {
    const actions: PriorityAction[] = [];
    if (!user.verified) {
      actions.push({
        id: "kyc",
        title: "Verificación de identidad en proceso",
        description: "Completa tu verificación para invertir sin límites.",
        cta: "Ver estado",
        href: "/dashboard/account",
        icon: ShieldCheck,
      });
    }
    const inFormalization = inProgress.find((i) => i.stage === "formalizacion");
    if (inFormalization) {
      actions.push({
        id: `doc-${inFormalization.id}`,
        title: "Documento pendiente de revisión",
        description: `Ya está disponible el informe legal de ${inFormalization.property.name}.`,
        cta: "Revisar",
        href: "/dashboard/my-investments",
        icon: FileText,
      });
    }
    const nextAuction = inProgress
      .filter((i) => i.stage === "subasta" && i.property.deadlineDays > 0)
      .sort((a, b) => a.property.deadlineDays - b.property.deadlineDays)[0];
    if (nextAuction) {
      actions.push({
        id: `auction-${nextAuction.id}`,
        title: "Subasta próxima",
        description: `${nextAuction.property.name} se subasta en ${nextAuction.property.deadlineDays} días.`,
        cta: "Ver detalles",
        href: `/dashboard/properties/${nextAuction.propertyId}`,
        icon: Gavel,
      });
    }
    const pendingSignature = investments.find((i) => i.status === "pending");
    if (pendingSignature) {
      actions.push({
        id: `sign-${pendingSignature.id}`,
        title: "Firma pendiente",
        description: `Revisa y firma el documento de participación de ${pendingSignature.property.name}.`,
        cta: "Ver detalle",
        href: "/dashboard/my-investments",
        icon: PenLine,
      });
    }
    return actions.slice(0, 3);
  }, [user.verified, inProgress, investments]);

  // Oportunidad destacada: la de mayor retorno estimado que aún no tiene.
  const featured = useMemo(() => {
    const ownPropertyIds = new Set(investments.map((i) => i.propertyId));
    const active = dashboardProperties.filter((p) => p.status === "Activo");
    const pool = active.filter((p) => !ownPropertyIds.has(p.id));
    return [...(pool.length > 0 ? pool : active)].sort((a, b) => b.roi - a.roi)[0];
  }, [investments]);

  const recentUpdates = notifications.slice(0, 5);

  return (
    <div className="w-full flex flex-col gap-8 pb-4">
      {/* 1. Encabezado y resumen */}
      <motion.div {...reveal(0)}>
        <PortfolioOverview firstName={user.name.split(" ")[0]} isPremium={isPremium} />
      </motion.div>

      {/* 2. KPIs principales (E-009) */}
      <motion.div {...reveal(0.06)}>
        <KpiCards
          totalInvested={formatMixedCurrencyTotals(investedByCurrency)}
          inProgress={{ count: inProgress.length, breakdown: stageBreakdown.join(" · ") }}
          realizedGains={formatMixedCurrencyTotals(realizedGains)}
          lastUpdated={lastUpdated ? formatDateTime(lastUpdated) : null}
        />
      </motion.div>

      {/* 3. Acciones prioritarias (E-004) */}
      <motion.div {...reveal(0.12)}>
        <PriorityActions actions={priorityActions} viewAllHref="/dashboard/notifications" />
      </motion.div>

      {/* 4. Inversiones activas (WP-2.3) */}
      <section aria-labelledby="home-investments" className="flex flex-col gap-3">
        <SectionBar
          id="home-investments"
          title="Inversiones activas"
          action={{ label: "Ver todas", href: "/dashboard/my-investments" }}
        />
        {investments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            Aún no tienes inversiones. Explora oportunidades para empezar.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {investments.slice(0, 4).map((inv, i) => (
              <motion.div key={inv.id} {...reveal(0.15 + i * 0.05)}>
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
      </section>

      {/* 5. Actividad reciente + oportunidad destacada (E-029, E-030) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-3">
        <RecentActivity items={recentUpdates} />
        {featured && <FeaturedOpportunity property={featured} />}
      </div>

      {/* Tu cuenta Estándar vs. Premium (E-026, E-027) */}
      {!isPremium && <AccountTiers />}

      {/* 6. Oportunidades Premium (E-008, E-015, E-022) */}
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
