"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusPill } from "@/components/premium/StatusPill";
import { FundsProgress } from "@/components/premium/FundsProgress";
import {
  CHECK_STATUS_LABELS,
  FUNDS_ORIGIN_LABELS,
  complianceStore,
  getComplianceFor,
  isFullyVerified,
  reviewSourceOfFunds,
} from "@/lib/premium/compliance";
import {
  CONTRIBUTION_STATUS_LABELS,
  FUNDING_PLAN_LABELS,
  OPERATION_STAGES,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_TONE,
  advanceOperation,
  approveRequest,
  getFunds,
  rejectRequest,
  reviewContribution,
  settleOperation,
  useReservations,
  type PremiumReservation,
} from "@/lib/premium/reservations";
import { formatLimaDate, formatLimaDateTime } from "@/lib/premium/dates";
import { formatCurrency } from "@/lib/currency";

/**
 * Panel de operaciones Premium de una oportunidad (lado admin). Cada acción
 * pasa por las mismas reglas que el "backend" del prototipo: no se puede
 * aprobar sin verificación completa, ni iniciar el proceso sin el 100% en
 * custodia.
 */
export function PremiumReservationsPanel({ propertyId }: { propertyId: string }) {
  const all = useReservations();
  const reservations = all
    .filter((r) => r.propertyId === propertyId)
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

  if (reservations.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Sin solicitudes de reserva</p>
        <p className="mt-1 text-sm text-muted-foreground">Cuando un inversionista Premium solicite esta oportunidad, la revisarás aquí.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Solicitudes y reservas">
      <h2 className="text-base font-semibold text-foreground">Solicitudes y reservas</h2>
      {reservations.map((r) => (
        <ReservationCard key={r.id} r={r} />
      ))}
    </section>
  );
}

function ReservationCard({ r }: { r: PremiumReservation }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [gain, setGain] = useState("");
  const compliance = getComplianceFor(complianceStore.useValue(), r.userId);
  const funds = getFunds(r);
  const verified = isFullyVerified(compliance);
  const stageIdx = r.stage ? OPERATION_STAGES.findIndex((s) => s.id === r.stage) : -1;

  const run = (fn: () => { ok: boolean; message?: string }, success: string) => {
    const res = fn();
    if (!res.ok) toast.error((res as { message: string }).message);
    else toast.success(success);
  };

  return (
    <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm" data-testid={`admin-res-${r.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={RESERVATION_STATUS_TONE[r.status]}>{RESERVATION_STATUS_LABELS[r.status]}</StatusPill>
            <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
          </div>
          <p className="mt-2 text-base font-semibold text-foreground">{r.userName}</p>
          <p className="text-xs text-muted-foreground">
            {r.userEmail} · solicitada el {formatLimaDateTime(r.requestedAt)} · {FUNDING_PLAN_LABELS[r.fundingPlan]}
          </p>
        </div>
        <p className="text-lg font-bold tabular-nums text-foreground">{formatCurrency(r.amount, r.currency)}</p>
      </div>

      {r.status === "requested" && (
        <div className="mt-4 rounded-xl border border-border/60 p-4">
          <p className="text-sm font-semibold text-foreground">Verificación reforzada</p>
          <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
            <Check label="Identidad" status={CHECK_STATUS_LABELS[compliance.identity.status]} ok={compliance.identity.status === "complete"} />
            <Check
              label="Origen de fondos"
              status={`${CHECK_STATUS_LABELS[compliance.sourceOfFunds.status]}${compliance.sourceOfFunds.origin ? ` · ${FUNDS_ORIGIN_LABELS[compliance.sourceOfFunds.origin]}` : ""}`}
              ok={compliance.sourceOfFunds.status === "complete"}
            />
            <Check label="Cuenta bancaria" status={`${compliance.bankAccount.bank} ···${compliance.bankAccount.last4}`} ok={compliance.bankAccount.status === "complete"} />
          </dl>
          {compliance.sourceOfFunds.status === "in_review" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-info/8 p-3 text-sm">
              <ShieldAlert className="size-4 text-info" />
              <span className="flex-1 text-foreground">
                Declaración enviada{compliance.sourceOfFunds.supportFileName ? ` · ${compliance.sourceOfFunds.supportFileName}` : ""}
              </span>
              <Button size="sm" variant="outline" className="rounded-lg" onClick={() => { reviewSourceOfFunds(r.userId, false); toast.success("Declaración devuelta al inversionista"); }}>
                Pedir más sustento
              </Button>
              <Button size="sm" className="rounded-lg" onClick={() => { reviewSourceOfFunds(r.userId, true); toast.success("Origen de fondos validado"); }} data-testid="admin-approve-sof">
                Validar origen de fondos
              </Button>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              className="rounded-xl"
              disabled={!verified}
              onClick={() => run(() => approveRequest(r.id), "Reserva aprobada · el inversionista tiene 5 días para aportar")}
              data-testid="admin-approve-request"
            >
              <CheckCircle2 />
              Aprobar reserva
            </Button>
            <Button variant="outline" className="rounded-xl text-destructive hover:text-destructive" onClick={() => setRejecting(true)}>
              <XCircle />
              No aprobar
            </Button>
            {!verified && <p className="self-center text-xs text-muted-foreground">Valida la verificación reforzada para poder aprobar.</p>}
          </div>
        </div>
      )}

      {(r.status === "reserved" || r.status === "in_custody") && (
        <div className="mt-4 space-y-3">
          {r.reservedUntil && <p className="text-xs text-muted-foreground">Plazo de aporte: {formatLimaDateTime(r.reservedUntil)}</p>}
          <FundsProgress amount={r.amount} confirmed={funds.confirmed} inReview={funds.inReview} currency={r.currency} detailed />
          {r.contributions.length > 0 && (
            <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
              {r.contributions.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold tabular-nums text-foreground">{formatCurrency(c.amount, r.currency)}</p>
                    <p className="text-xs text-muted-foreground">
                      Op. {c.operationNumber} · {formatLimaDate(c.transferDate)}
                      {c.fileName ? ` · ${c.fileName}` : ""}
                    </p>
                  </div>
                  {c.status === "in_review" ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-lg" onClick={() => run(() => reviewContribution(r.id, c.id, false, "No encontramos la transferencia en el banco."), "Aporte observado")}>
                        Observar
                      </Button>
                      <Button size="sm" className="rounded-lg" onClick={() => run(() => reviewContribution(r.id, c.id, true), "Aporte conciliado")} data-testid={`admin-confirm-${c.id}`}>
                        Conciliar
                      </Button>
                    </div>
                  ) : (
                    <StatusPill tone={c.status === "confirmed" ? "success" : "danger"} size="xs">
                      {CONTRIBUTION_STATUS_LABELS[c.status]}
                    </StatusPill>
                  )}
                </li>
              ))}
            </ul>
          )}
          {r.status === "in_custody" && (
            <Button className="rounded-xl" onClick={() => run(() => advanceOperation(r.id), "Proceso iniciado: subasta")} data-testid="admin-advance">
              Iniciar proceso (subasta)
            </Button>
          )}
        </div>
      )}

      {r.status === "in_process" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-foreground">
            Etapa actual: <span className="font-semibold">{OPERATION_STAGES[stageIdx]?.label}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {stageIdx < OPERATION_STAGES.length - 1 ? (
              <Button className="rounded-xl" onClick={() => run(() => advanceOperation(r.id), `Etapa actualizada: ${OPERATION_STAGES[stageIdx + 1].label}`)} data-testid="admin-advance">
                Pasar a {OPERATION_STAGES[stageIdx + 1].label.toLowerCase()}
              </Button>
            ) : (
              <>
                <Input
                  inputMode="decimal"
                  value={gain}
                  onChange={(e) => setGain(e.target.value.replace(/[^\d.-]/g, ""))}
                  placeholder="Ganancia neta"
                  className="h-10 w-40 rounded-xl"
                  aria-label="Ganancia neta de la liquidación"
                />
                <Button className="rounded-xl" disabled={gain === ""} onClick={() => run(() => settleOperation(r.id, Number(gain)), "Operación liquidada")}>
                  Registrar liquidación
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {r.status === "rejected" && r.rejectionReason && (
        <p className="mt-3 text-sm text-muted-foreground">Motivo: {r.rejectionReason}</p>
      )}

      <AlertDialog open={rejecting} onOpenChange={setRejecting}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>No aprobar la solicitud</AlertDialogTitle>
            <AlertDialogDescription>
              {r.userName} verá el motivo. La oportunidad vuelve a estar disponible y no se realiza ningún cobro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo" className="rounded-xl" />
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive hover:bg-destructive/90"
              disabled={!reason.trim()}
              onClick={() => run(() => rejectRequest(r.id, reason.trim()), "Solicitud no aprobada")}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}

function Check({ label, status, ok }: { label: string; status: string; ok: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={ok ? "font-medium text-success" : "font-medium text-foreground"}>{status}</dd>
    </div>
  );
}
