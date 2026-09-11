"use client";

import { Fragment } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/dashboard/mock-data";
import { describeOutcome, getOutcomeReturnAmount } from "@/lib/dashboard/outcome";
import { PROCESS_STAGE_LABELS, PROCESS_STAGE_ORDER } from "@/lib/dashboard/types";
import type { ActiveInvestmentView } from "@/lib/dashboard/mock-data";

interface InvestmentCardProps {
  investment: ActiveInvestmentView;
  onViewDetail: (investment: ActiveInvestmentView) => void;
}

/**
 * Ficha de inversión rediseñada (WP-2.3): responde "¿y ahora qué?" con una
 * mini-línea de proceso, un CTA explícito y el ROI traducido a dinero. La
 * foto baja a miniatura — la ficha es financiera, no una vitrina.
 */
export function InvestmentCard({ investment, onViewDetail }: InvestmentCardProps) {
  const { property } = investment;
  const stageIndex = PROCESS_STAGE_ORDER.indexOf(investment.stage);
  const { label: outcomeLabel, tone } = describeOutcome(investment.outcome);
  const returnAmount = getOutcomeReturnAmount(investment.outcome, investment.amount);

  const deadlineText =
    investment.stage === "subasta" && investment.daysUntilRoi > 0
      ? `Cierra en ${investment.daysUntilRoi} días`
      : investment.daysUntilRoi < 0
        ? `En revisión desde hace ${Math.abs(investment.daysUntilRoi)} días`
        : `Etapa: ${PROCESS_STAGE_LABELS[investment.stage]}`;

  return (
    <button
      type="button"
      onClick={() => onViewDetail(investment)}
      className="w-full text-left flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:bg-secondary/8 transition-colors group"
    >
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.img}
          alt=""
          className="size-9 rounded-lg object-cover shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{property.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{property.district}</p>
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{deadlineText}</span>
      </div>

      {/* Mini línea de proceso (E-003) */}
      <div className="flex items-center gap-1 px-0.5" aria-label="Etapa del proceso judicial">
        {PROCESS_STAGE_ORDER.map((stage, i) => (
          <Fragment key={stage}>
            <div
              className={cn(
                "flex items-center justify-center size-4 rounded-full text-[9px] shrink-0",
                i < stageIndex && "bg-primary text-primary-foreground",
                i === stageIndex && "bg-primary text-primary-foreground ring-2 ring-primary/20",
                i > stageIndex && "bg-muted text-muted-foreground"
              )}
              title={PROCESS_STAGE_LABELS[stage]}
            >
              {i < stageIndex ? <Check className="size-2.5" /> : i + 1}
            </div>
            {i < PROCESS_STAGE_ORDER.length - 1 && (
              <div className={cn("h-0.5 flex-1", i < stageIndex ? "bg-primary" : "bg-border")} />
            )}
          </Fragment>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground -mt-1.5">
        Etapa actual: <span className="font-medium text-foreground">{PROCESS_STAGE_LABELS[investment.stage]}</span>
      </p>

      {/* Dos columnas (E-021) */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/50">
        <div>
          <p className="text-[10px] text-muted-foreground">Tu inversión</p>
          <p className="text-sm font-bold text-foreground tabular-nums">
            {formatCurrency(investment.amount, investment.currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Retorno estimado</p>
          <p
            className={cn(
              "text-sm font-bold tabular-nums",
              tone === "success" && "text-success",
              tone === "destructive" && "text-destructive",
              tone === "muted" && "text-muted-foreground"
            )}
          >
            {investment.outcome.kind === "estimated" || investment.outcome.kind === "revised"
              ? formatCurrency(returnAmount, investment.currency)
              : outcomeLabel}
          </p>
        </div>
      </div>

      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
        Ver seguimiento
        <ArrowRight className="size-3.5" />
      </span>
    </button>
  );
}
