"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, MessageCircle, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumUpgradeDialog } from "@/components/dashboard/PremiumUpgradeDialog";
import { StatusPill } from "./StatusPill";
import { ComplianceChecklist } from "./ComplianceChecklist";
import { AdvisorDialog, PREMIUM_ADVISOR } from "./AdvisorDialog";
import { useCurrentUser } from "@/contexts/user-context";
import { isFullyVerified, useCompliance } from "@/lib/premium/compliance";
import { isActive, useReservations } from "@/lib/premium/reservations";

const COMPARISON = [
  { label: "Participación", standard: "Colectiva, desde S/ 500", premium: "Individual: 100% del capital" },
  { label: "Oportunidades", standard: "Abiertas al colectivo", premium: "Ventana anticipada y exclusiva" },
  { label: "Acción principal", standard: "Invertir", premium: "Solicitar reserva" },
  { label: "Verificación", standard: "KYC estándar", premium: "KYC reforzado y origen de fondos" },
  { label: "Seguimiento", standard: "Aporte compartido", premium: "Operación completa + asesora" },
];

/**
 * Mi cuenta → Acceso Premium. Muestra el estado real del acceso: Premium
 * "activo" solo cuando corresponde, y qué validación falta si algo bloquea
 * nuevas solicitudes.
 */
export function PremiumAccessSection() {
  const { user, isPremium, upgradeRequest, refreshUpgradeRequest } = useCurrentUser();
  const compliance = useCompliance(user.id);
  const reservations = useReservations();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const mine = reservations.filter((r) => r.userId === user.id);
  const active = mine.filter(isActive).length;
  const settled = mine.filter((r) => r.status === "settled").length;
  const blocked = compliance.sourceOfFunds.status === "action_required";

  return (
    <div className="flex flex-col gap-5" data-testid="premium-access">
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Acceso Premium</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isPremium
                ? blocked
                  ? "Tu acceso está activo, pero las nuevas solicitudes de reserva están en pausa hasta actualizar tu verificación."
                  : "Puedes solicitar reservas en las ventanas Premium abiertas."
                : "Para quienes pueden financiar individualmente el 100% de una operación."}
            </p>
          </div>
          {isPremium ? (
            <StatusPill tone={blocked ? "warning" : "success"}>{blocked ? "Acción requerida" : "Activo"}</StatusPill>
          ) : upgradeRequest?.status === "pending" ? (
            <StatusPill tone="info">Solicitud en revisión</StatusPill>
          ) : (
            <StatusPill tone="muted">Cuenta Estándar</StatusPill>
          )}
        </div>

        {isPremium && (
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Operaciones activas" value={String(active)} />
            <Stat label="Liquidadas" value={String(settled)} />
            <div className="col-span-2 flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3 sm:col-span-1">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Tu asesora</dt>
                <dd className="truncate text-sm font-semibold text-foreground">{PREMIUM_ADVISOR.name}</dd>
              </div>
              <Button size="icon" variant="outline" className="size-9 shrink-0 rounded-lg" onClick={() => setAdvisorOpen(true)} aria-label="Contactar a tu asesora">
                <MessageCircle />
              </Button>
            </div>
          </dl>
        )}

        {!isPremium && upgradeRequest?.status === "pending" && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-info/8 p-4">
            <Clock className="mt-0.5 size-4 shrink-0 text-info" />
            <p className="flex-1 text-sm text-foreground">
              Revisamos tu solicitud en 1 a 2 días hábiles. Premium se activará solo cuando tu verificación reforzada esté completa.
            </p>
            <Button variant="ghost" size="icon-sm" className="shrink-0 rounded-lg" onClick={refreshUpgradeRequest} aria-label="Actualizar estado">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        )}

        {!isPremium && upgradeRequest?.status === "rejected" && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-destructive/5 p-4">
            <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">Tu solicitud no fue aprobada</p>
              {upgradeRequest.rejectionReason && <p className="mt-0.5 text-muted-foreground">{upgradeRequest.rejectionReason}</p>}
            </div>
          </div>
        )}

        {!isPremium && upgradeRequest?.status !== "pending" && (
          <Button className="mt-5 h-11 w-full rounded-xl sm:w-auto" onClick={() => setUpgradeOpen(true)}>
            {upgradeRequest?.status === "rejected" ? "Volver a solicitar acceso" : "Solicitar acceso Premium"}
            <ArrowRight />
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground">Verificación reforzada</h3>
          {isFullyVerified(compliance) && <StatusPill tone="success" size="xs">Completa</StatusPill>}
        </div>
        <ComplianceChecklist profile={compliance} inlineForm={isPremium} />
        {!isPremium && (
          <p className="mt-3 text-xs text-muted-foreground">
            Si solicitas acceso Premium te pediremos completar estas validaciones.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
        <h3 className="border-b border-border/60 px-5 py-4 text-base font-semibold text-foreground sm:px-6">Estándar y Premium</h3>
        <div className="hidden grid-cols-[10rem_1fr_1fr] gap-4 bg-muted/40 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
          <span />
          <span>Estándar</span>
          <span>Premium</span>
        </div>
        <ul className="divide-y divide-border/60">
          {COMPARISON.map((row) => (
            <li key={row.label} className="grid gap-1 px-5 py-3 text-sm sm:grid-cols-[10rem_1fr_1fr] sm:gap-4 sm:px-6">
              <span className="font-medium text-foreground">{row.label}</span>
              <span className="text-muted-foreground">
                <span className="sm:hidden">Estándar: </span>
                {row.standard}
              </span>
              <span className="flex items-start gap-1.5 text-foreground">
                <Check className="mt-0.5 hidden size-3.5 shrink-0 text-primary sm:block" />
                <span>
                  <span className="sm:hidden text-muted-foreground">Premium: </span>
                  {row.premium}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-border/60 px-5 py-3 text-xs text-muted-foreground sm:px-6">
          Tu cuenta Estándar no cambia con Premium. Las comisiones y condiciones de cada operación se informan en su expediente.{" "}
          <Link href="/premium" className="font-medium text-primary hover:underline">Más sobre Premium</Link>
        </p>
      </div>

      <PremiumUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} onRequested={refreshUpgradeRequest} />
      <AdvisorDialog open={advisorOpen} onOpenChange={setAdvisorOpen} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}
