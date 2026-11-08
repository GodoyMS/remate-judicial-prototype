"use client";

import Link from "next/link";
import { useState, type Ref } from "react";
import { ArrowRight, Bell, BellRing, Info, Lock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "./StatusPill";
import { WindowClock } from "./WindowClock";
import { FundsProgress } from "./FundsProgress";
import { availabilityPill, trackingHref } from "./reservation-ui";
import type { Availability } from "@/lib/premium/availability";
import type { PremiumProperty } from "@/lib/premium/types";
import { getFunds, RESERVATION_STATUS_LABELS } from "@/lib/premium/reservations";
import { formatCurrency } from "@/lib/currency";
import { formatLimaDate, formatLimaDateTime } from "@/lib/premium/dates";
import { cn } from "@/lib/utils";

interface ReservationPanelProps {
  property: PremiumProperty;
  availability: Availability;
  isPremium: boolean;
  onOpenAdvisor: () => void;
  onShowScenarios: () => void;
  /** Ref al CTA principal para mostrar la barra fija en móvil cuando sale de vista. */
  ctaRef?: Ref<HTMLDivElement>;
}

export function primaryAction(property: PremiumProperty, availability: Availability, isPremium: boolean) {
  if (!isPremium) return { label: "Conocer Premium", href: "/dashboard/account?section=premium" };
  switch (availability.kind) {
    case "available":
      return { label: "Solicitar reserva", href: `/dashboard/premium-invest?property=${property.id}` };
    case "mine":
      return { label: "Ver seguimiento", href: trackingHref(availability.reservation.id) };
    case "collective":
      return { label: "Ver en inversión colectiva", href: "/dashboard/properties" };
    default:
      return null;
  }
}

/**
 * Panel de decisión de la ficha. Jerarquía: capital requerido (lo que se
 * compromete) → retorno neto estimado (con su advertencia) → ventana →
 * una sola acción principal. Sin dorado en botones ni montos.
 */
export function ReservationPanel({
  property: p,
  availability,
  isPremium,
  onOpenAdvisor,
  onShowScenarios,
  ctaRef,
}: ReservationPanelProps) {
  const [notify, setNotify] = useState(false);
  const pill = availabilityPill(availability);
  const action = primaryAction(p, availability, isPremium);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm" data-testid="reservation-panel">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Capital requerido</p>
        {isPremium && (
          <StatusPill tone={pill.tone} size="xs">
            {pill.label}
          </StatusPill>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-foreground">
        {formatCurrency(p.totalValue, p.currency)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Financiado por un solo inversionista (100%)</p>

      <div className="my-5 h-px bg-border/70" />

      {isPremium ? (
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm text-muted-foreground">Retorno neto estimado</p>
            <p className="text-lg font-bold tabular-nums text-foreground">{p.roiBasis.netRoi}%</p>
          </div>
          <p className="text-xs text-muted-foreground">Escenario esperado · no garantizado</p>
          <button
            type="button"
            onClick={onShowScenarios}
            className="pt-1 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Consultar escenarios y riesgos
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            El expediente completo, los escenarios de retorno y la solicitud de reserva están disponibles con acceso Premium.
          </p>
        </div>
      )}

      {isPremium && availability.kind === "available" && (
        <WindowClock deadline={p.premiumDeadline} className="mt-5" />
      )}

      {isPremium && availability.kind === "mine" && (
        <MineSummary availability={availability} />
      )}

      {isPremium && availability.kind === "held" && (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-muted/60 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Otro inversionista tiene una solicitud en revisión. Si no se aprueba antes del{" "}
            <span className="font-medium text-foreground">{formatLimaDateTime(p.premiumDeadline)}</span>, volverá a estar disponible.
          </p>
        </div>
      )}

      {isPremium && availability.kind === "collective" && (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-muted/60 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            La ventana Premium cerró el {formatLimaDate(p.premiumDeadline)}. Ahora puedes participar en conjunto con otros inversionistas desde S/ 500.
          </p>
        </div>
      )}

      <div ref={ctaRef} className="mt-5 flex flex-col gap-2">
        {action ? (
          <Button asChild className="h-11 w-full rounded-xl text-[15px] font-semibold" data-testid="panel-primary-cta">
            <Link href={action.href}>
              {action.label}
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button
            variant={notify ? "secondary" : "default"}
            className="h-11 w-full rounded-xl text-[15px] font-semibold"
            onClick={() => {
              setNotify((v) => !v);
              toast.success(notify ? "Aviso desactivado" : "Te avisaremos si se libera", {
                description: notify ? undefined : "Recibirás una notificación y un correo.",
              });
            }}
          >
            {notify ? <BellRing /> : <Bell />}
            {notify ? "Te avisaremos si se libera" : "Avisarme si se libera"}
          </Button>
        )}
        {isPremium && availability.kind === "available" && (
          <p className="text-center text-xs text-muted-foreground">Enviar la solicitud no genera ningún cobro.</p>
        )}
        {isPremium && (
          <Button variant="outline" className="h-11 w-full rounded-xl" onClick={onOpenAdvisor}>
            <MessageCircle />
            Hablar con un asesor
          </Button>
        )}
      </div>
    </div>
  );
}

function MineSummary({ availability }: { availability: Extract<Availability, { kind: "mine" }> }) {
  const r = availability.reservation;
  const funds = getFunds(r);
  return (
    <div className="mt-5 space-y-3 rounded-xl bg-muted/50 p-3">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">Tu reserva</span>
        <span className="font-mono text-xs text-foreground">{r.code}</span>
      </div>
      <p className={cn("text-sm font-semibold text-foreground")}>{RESERVATION_STATUS_LABELS[r.status]}</p>
      {r.status === "requested" && (
        <p className="text-xs text-muted-foreground">Solicitud enviada el {formatLimaDate(r.requestedAt)}. Te responderemos en 1 día hábil.</p>
      )}
      {(r.status === "reserved" || r.status === "in_custody") && (
        <FundsProgress amount={r.amount} confirmed={funds.confirmed} inReview={funds.inReview} currency={r.currency} />
      )}
    </div>
  );
}
