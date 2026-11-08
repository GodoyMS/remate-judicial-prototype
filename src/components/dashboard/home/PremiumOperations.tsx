"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionBar } from "./SectionBar";
import { StatusPill } from "@/components/premium/StatusPill";
import { FundsProgress } from "@/components/premium/FundsProgress";
import { nextStepFor, trackingHref } from "@/components/premium/reservation-ui";
import { getPremiumPropertyById } from "@/lib/premium/mock-data";
import {
  OPERATION_STAGES,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_TONE,
  getFunds,
  type PremiumReservation,
} from "@/lib/premium/reservations";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * Operaciones Premium activas en Inicio. El usuario Premium necesita
 * controlar procesos, no ver una vitrina: cada tarjeta dice en qué está la
 * operación y qué sigue, con acceso directo al seguimiento.
 */
export function PremiumOperations({ reservations }: { reservations: PremiumReservation[] }) {
  if (reservations.length === 0) return null;
  return (
    <section aria-labelledby="home-premium-ops" className="flex flex-col gap-3">
      <SectionBar
        id="home-premium-ops"
        title="Operaciones Premium activas"
        action={{ label: "Ver todas", href: "/dashboard/my-investments?tab=premium" }}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {reservations.map((r) => (
          <OperationCard key={r.id} r={r} />
        ))}
      </div>
    </section>
  );
}

function OperationCard({ r }: { r: PremiumReservation }) {
  const p = getPremiumPropertyById(r.propertyId);
  const funds = getFunds(r);
  const next = nextStepFor(r);
  const stageIdx = r.stage ? OPERATION_STAGES.findIndex((s) => s.id === r.stage) : -1;

  return (
    <Link
      href={trackingHref(r.id)}
      className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-primary/30"
      data-testid={`home-op-${r.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-foreground">{p?.name ?? r.propertyId}</p>
          <p className="text-xs text-muted-foreground">Capital comprometido</p>
          <p className="text-lg font-bold tabular-nums text-foreground">{formatCurrency(r.amount, r.currency)}</p>
        </div>
        <StatusPill tone={RESERVATION_STATUS_TONE[r.status]} size="xs">
          {RESERVATION_STATUS_LABELS[r.status]}
        </StatusPill>
      </div>

      {r.status === "in_process" ? (
        <div className="flex gap-1" aria-label={`Etapa ${stageIdx + 1} de ${OPERATION_STAGES.length}`}>
          {OPERATION_STAGES.map((s, i) => (
            <span key={s.id} className={cn("h-1.5 flex-1 rounded-full", i <= stageIdx ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
      ) : r.status === "requested" ? (
        <div className="h-1.5 rounded-full bg-muted" />
      ) : (
        <FundsProgress amount={r.amount} confirmed={funds.confirmed} inReview={funds.inReview} currency={r.currency} />
      )}

      <div className="flex items-center justify-between gap-3">
        <p className={cn("min-w-0 text-xs", next.actionable ? "font-semibold text-foreground" : "text-muted-foreground")}>
          {next.text}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
          Seguimiento
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
