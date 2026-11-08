"use client";

import { Suspense, use, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Clock,
  FileText,
  Flag,
  Hourglass,
  Landmark,
  MessageCircle,
  PenLine,
  Scale,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusPill } from "@/components/premium/StatusPill";
import { ReservationStepper } from "@/components/premium/ReservationStepper";
import { FundsProgress } from "@/components/premium/FundsProgress";
import { WindowClock } from "@/components/premium/WindowClock";
import { AdvisorDialog, PREMIUM_ADVISOR } from "@/components/premium/AdvisorDialog";
import {
  ContributionDialog,
  CustodyAccount,
  IncidentDialog,
  SignContractDialog,
  WithdrawDialog,
} from "@/components/premium/TrackingDialogs";
import { useCurrentUser } from "@/contexts/user-context";
import { getPremiumPropertyById } from "@/lib/premium/mock-data";
import { useCompliance } from "@/lib/premium/compliance";
import {
  CONTRIBUTION_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  FUNDING_PLAN_LABELS,
  OPERATION_STAGES,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_TONE,
  getContractDocument,
  getFunds,
  needsSignature,
  useReservations,
  type ContributionStatus,
  type DocumentStatus,
  type PremiumReservation,
  type StatusTone,
} from "@/lib/premium/reservations";
import { formatLimaDate, formatLimaDateTime } from "@/lib/premium/dates";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

const CONTRIB_TONE: Record<ContributionStatus, StatusTone> = { in_review: "info", confirmed: "success", rejected: "danger" };
const DOC_TONE: Record<DocumentStatus, StatusTone> = { approved: "success", confirmed: "success", in_review: "info", to_sign: "warning" };
const TABS = ["resumen", "aportes", "documentos", "actividad"] as const;
type TabId = (typeof TABS)[number];

export default function PremiumTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense>
      <Tracking id={id} />
    </Suspense>
  );
}

function Tracking({ id }: { id: string }) {
  const { user } = useCurrentUser();
  const reservations = useReservations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const r = reservations.find((x) => x.id === id && x.userId === user.id);
  const [dialog, setDialog] = useState<null | "sign" | "contribute" | "withdraw" | "incident" | "advisor">(null);
  const [signDocId, setSignDocId] = useState<string | null>(null);

  const tabParam = searchParams.get("tab") as TabId | null;
  const tab: TabId = tabParam && TABS.includes(tabParam) ? tabParam : "resumen";
  const setTab = (t: string) =>
    router.replace(`/dashboard/my-investments/premium/${id}${t === "resumen" ? "" : `?tab=${t}`}`, { scroll: false });

  if (!r) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-foreground">No encontramos esta operación</p>
        <p className="mt-1 text-sm text-muted-foreground">Puede que el enlace sea incorrecto o que pertenezca a otra cuenta.</p>
        <Button asChild variant="outline" className="mt-5 rounded-xl">
          <Link href="/dashboard/my-investments?tab=premium">Ver mis operaciones Premium</Link>
        </Button>
      </div>
    );
  }

  const property = getPremiumPropertyById(r.propertyId);
  const funds = getFunds(r);
  const contract = getContractDocument(r);
  const toSign = r.documents.filter((d) => d.status === "to_sign");
  const docsToSign = toSign.length;
  const signTarget = r.documents.find((d) => d.id === signDocId && d.status === "to_sign") ?? toSign[0];
  const openSign = (docId?: string) => {
    setSignDocId(docId ?? (needsSignature(r) ? contract?.id ?? null : toSign[0]?.id ?? null));
    setDialog("sign");
  };

  return (
    <div className="w-full">
      <Link
        href="/dashboard/my-investments?tab=premium"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Mis inversiones Premium
      </Link>

      <header className="mb-5 flex items-start gap-4">
        {property && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={property.img} alt="" className="hidden size-16 shrink-0 rounded-2xl object-cover sm:block" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={RESERVATION_STATUS_TONE[r.status]}>{RESERVATION_STATUS_LABELS[r.status]}</StatusPill>
            <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl text-balance">
            {property?.name ?? r.propertyId}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatCurrency(r.amount, r.currency)} · 100% del capital · {FUNDING_PLAN_LABELS[r.fundingPlan].toLowerCase()}
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5" aria-label="Progreso">
            <ReservationStepper status={r.status} />
          </section>

          <NextStep
            r={r}
            pendingDocTitle={!needsSignature(r) ? toSign[0]?.title : undefined}
            onAction={(d) => (d === "sign" ? openSign() : setDialog(d))}
          />

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid h-10 w-full grid-cols-4 rounded-xl bg-muted/60 p-1 sm:inline-flex sm:w-auto">
              <TabsTrigger value="resumen" className="rounded-lg px-1 text-xs sm:px-4">Resumen</TabsTrigger>
              <TabsTrigger value="aportes" className="rounded-lg px-1 text-xs sm:px-4">
                Aportes
                {r.contributions.length > 0 && <span className="ml-1 hidden tabular-nums text-muted-foreground sm:inline">{r.contributions.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="documentos" className="rounded-lg px-1 text-xs sm:px-4">
                <span className="sm:hidden">Docs</span>
                <span className="hidden sm:inline">Documentos</span>
                {docsToSign > 0 && (
                  <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground" aria-label={`${docsToSign} por firmar`}>{docsToSign}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="actividad" className="rounded-lg px-1 text-xs sm:px-4">Actividad</TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="mt-4 flex flex-col gap-4">
              <Panel title="Hitos del proceso" icon={Scale}>
                {r.stageHistory.length === 0 && r.status !== "settled" ? (
                  <p className="text-sm text-muted-foreground">
                    El proceso judicial inicia cuando tu aporte esté completo y en custodia. Te avisaremos en cada hito.
                  </p>
                ) : (
                  <ol className="relative space-y-4 border-l border-border pl-5">
                    {OPERATION_STAGES.map((s) => {
                      const reached = r.stageHistory.find((h) => h.stage === s.id);
                      const current = r.status === "in_process" && r.stage === s.id;
                      return (
                        <li key={s.id} className="relative">
                          <span
                            className={cn(
                              "absolute -left-[27px] top-0.5 size-3.5 rounded-full ring-4 ring-card",
                              current ? "bg-primary" : reached ? "bg-primary/60" : "bg-muted-foreground/25"
                            )}
                          />
                          <p className={cn("text-sm font-semibold", reached ? "text-foreground" : "text-muted-foreground")}>
                            {s.label}
                            {current && <span className="ml-2 text-xs font-medium text-primary">· Etapa actual</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reached ? formatLimaDate(reached.at) : s.description}
                          </p>
                        </li>
                      );
                    })}
                    {r.status === "settled" && r.settlement && (
                      <li className="relative">
                        <span className="absolute -left-[27px] top-0.5 size-3.5 rounded-full bg-success ring-4 ring-card" />
                        <p className="text-sm font-semibold text-foreground">Liquidación</p>
                        <p className="text-xs text-muted-foreground">{formatLimaDate(r.settlement.settledAt)}</p>
                      </li>
                    )}
                  </ol>
                )}
              </Panel>
              <Panel title="Datos de la operación" icon={FileText}>
                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <Fact label="Capital comprometido" value={formatCurrency(r.amount, r.currency)} />
                  <Fact label="Plan de aporte" value={FUNDING_PLAN_LABELS[r.fundingPlan]} />
                  <Fact label="Solicitud" value={formatLimaDate(r.requestedAt)} />
                  {r.reviewedAt && <Fact label={r.status === "rejected" ? "Respuesta" : "Aprobación"} value={formatLimaDate(r.reviewedAt)} />}
                  {property && <Fact label="Retorno neto estimado" value={`${property.roiBasis.netRoi}% (esperado, no garantizado)`} />}
                  <ReturnAccount userId={r.userId} />
                </dl>
                {property && (
                  <Link href={`/dashboard/premium-properties/${property.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Ver ficha y expediente
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </Panel>
            </TabsContent>

            <TabsContent value="aportes" className="mt-4">
              <Panel title="Aportes" icon={Wallet}>
                {["requested", "rejected", "withdrawn"].includes(r.status) ? (
                  <p className="text-sm text-muted-foreground">Podrás registrar aportes cuando se apruebe tu reserva.</p>
                ) : (
                  <>
                    <FundsProgress amount={r.amount} confirmed={funds.confirmed} inReview={funds.inReview} currency={r.currency} detailed />
                    {r.contributions.length > 0 ? (
                      <ul className="mt-5 divide-y divide-border/60 rounded-xl border border-border/60">
                        {r.contributions.map((c) => (
                          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold tabular-nums text-foreground">{formatCurrency(c.amount, r.currency)}</p>
                              <p className="text-xs text-muted-foreground">
                                Op. {c.operationNumber} · {formatLimaDate(c.transferDate)}
                              </p>
                              {c.rejectionReason && <p className="mt-1 text-xs text-destructive">{c.rejectionReason}</p>}
                            </div>
                            <StatusPill tone={CONTRIB_TONE[c.status]} size="xs">
                              {CONTRIBUTION_STATUS_LABELS[c.status]}
                            </StatusPill>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm text-muted-foreground">Aún no registras transferencias.</p>
                    )}
                    {r.status === "reserved" && !needsSignature(r) && funds.pending > 0 && (
                      <Button className="mt-4 h-10 rounded-xl" onClick={() => setDialog("contribute")}>
                        Registrar transferencia
                      </Button>
                    )}
                  </>
                )}
              </Panel>
            </TabsContent>

            <TabsContent value="documentos" className="mt-4">
              <Panel title="Documentos de la operación" icon={FileText}>
                <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
                  {r.documents.map((d) => (
                    <li key={d.id} className="flex flex-wrap items-center gap-3 p-3" data-testid={`doc-${d.id}`}>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{d.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.description} · v{d.version} · {formatLimaDate(d.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusPill tone={DOC_TONE[d.status]} size="xs">
                          {DOCUMENT_STATUS_LABELS[d.status]}
                        </StatusPill>
                        {d.status === "to_sign" ? (
                          <Button size="sm" className="h-8 rounded-lg" onClick={() => openSign(d.id)}>
                            Firmar
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-8 rounded-lg text-primary">
                            Ver
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            </TabsContent>

            <TabsContent value="actividad" className="mt-4">
              <Panel title="Actividad" icon={Clock}>
                <ol className="relative space-y-4 border-l border-border pl-5">
                  {r.events.map((e) => (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full bg-primary/60 ring-4 ring-card" />
                      <p className="text-sm font-medium text-foreground">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatLimaDateTime(e.at)}
                        {e.detail ? ` · ${e.detail}` : ""}
                      </p>
                    </li>
                  ))}
                </ol>
              </Panel>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tu asesora</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {PREMIUM_ADVISOR.initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{PREMIUM_ADVISOR.name}</p>
                <p className="text-xs text-muted-foreground">{PREMIUM_ADVISOR.responseTime}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 h-10 w-full rounded-xl" onClick={() => setDialog("advisor")}>
              <MessageCircle />
              Contactar
            </Button>
            <button
              type="button"
              onClick={() => setDialog("incident")}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Flag className="size-3.5" />
              Reportar una incidencia
            </button>
          </div>
        </aside>
      </div>

      {signTarget && (
        <SignContractDialog
          reservation={r}
          document={signTarget}
          open={dialog === "sign"}
          onOpenChange={(o) => setDialog(o ? "sign" : null)}
        />
      )}
      <ContributionDialog reservation={r} open={dialog === "contribute"} onOpenChange={(o) => setDialog(o ? "contribute" : null)} />
      <WithdrawDialog reservation={r} userId={user.id} open={dialog === "withdraw"} onOpenChange={(o) => setDialog(o ? "withdraw" : null)} />
      <IncidentDialog reservation={r} open={dialog === "incident"} onOpenChange={(o) => setDialog(o ? "incident" : null)} />
      <AdvisorDialog open={dialog === "advisor"} onOpenChange={(o) => setDialog(o ? "advisor" : null)} context={`la operación ${r.code}`} />
    </div>
  );
}

/** Lo siguiente que pasa, con su única acción. Es el bloque más importante de la página. */
function NextStep({
  r,
  pendingDocTitle,
  onAction,
}: {
  r: PremiumReservation;
  /** Documento por firmar que no bloquea el aporte (p. ej. un anexo). */
  pendingDocTitle?: string;
  onAction: (d: "sign" | "contribute" | "withdraw" | "advisor") => void;
}) {
  const funds = getFunds(r);

  const shell = (tone: "action" | "wait" | "done" | "bad", icon: typeof Clock, title: string, body: React.ReactNode, actions?: React.ReactNode) => {
    const Icon = icon;
    return (
      <section
        data-testid="next-step"
        className={cn(
          "rounded-2xl border p-4 shadow-sm sm:p-5",
          tone === "action" && "border-primary/30 bg-primary/[0.04]",
          tone === "wait" && "border-border/60 bg-card",
          tone === "done" && "border-success/30 bg-success/[0.05]",
          tone === "bad" && "border-destructive/25 bg-destructive/[0.04]"
        )}
      >
        <div className="flex items-center gap-3 sm:items-start">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10",
              tone === "action" && "bg-primary text-primary-foreground",
              tone === "wait" && "bg-muted text-foreground/70",
              tone === "done" && "bg-success/15 text-success",
              tone === "bad" && "bg-destructive/10 text-destructive"
            )}
          >
            <Icon className="size-[18px] sm:size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {tone === "action" ? "Tu siguiente paso" : tone === "done" ? "Resultado" : "Qué está pasando"}
            </p>
            <h2 className="mt-0.5 hidden text-base font-semibold text-foreground sm:block">{title}</h2>
          </div>
        </div>
        {/* En móvil el título y el cuerpo van a ancho completo, sin sangría bajo el ícono */}
        <h2 className="mt-3 text-base font-semibold text-foreground sm:hidden">{title}</h2>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground sm:pl-[52px]">{body}</div>
        {actions && <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:pl-[52px]">{actions}</div>}
      </section>
    );
  };

  switch (r.status) {
    case "requested":
      return shell(
        "wait",
        Hourglass,
        "Estamos revisando tu solicitud",
        <>Validamos tu cuenta y la operación. Te responderemos en 1 día hábil. Mientras tanto, nadie más puede solicitar esta oportunidad.</>,
        <Button variant="outline" className="h-10 rounded-xl" onClick={() => onAction("withdraw")}>
          Retirar solicitud
        </Button>
      );
    case "rejected":
      return shell(
        "bad",
        AlertCircle,
        "Tu solicitud no fue aprobada",
        <>{r.rejectionReason ?? "No cumplió los requisitos de la operación."} No se realizó ningún cobro.</>,
        <>
          <Button asChild className="h-10 rounded-xl">
            <Link href="/dashboard/premium-properties?filter=available">Ver otras oportunidades</Link>
          </Button>
          <Button variant="outline" className="h-10 rounded-xl" onClick={() => onAction("advisor")}>
            Hablar con un asesor
          </Button>
        </>
      );
    case "withdrawn":
      return shell("wait", AlertCircle, "Retiraste esta solicitud", "La oportunidad volvió a estar disponible y no hubo ningún cargo.");
    case "expired":
      return shell("bad", AlertCircle, "La reserva venció", "No se completó el aporte dentro del plazo. Lo aportado se devuelve a tu cuenta verificada.");
    case "reserved":
      if (needsSignature(r)) {
        return shell(
          "action",
          PenLine,
          "Firma el contrato de reserva",
          <>Revisa el plazo, el aporte y las condiciones de devolución. Después podrás transferir a la cuenta de custodia.</>,
          <Button className="h-10 rounded-xl" onClick={() => onAction("sign")} data-testid="next-step-sign">
            Revisar y firmar
          </Button>
        );
      }
      if (funds.pending > 0) {
        return shell(
          "action",
          Landmark,
          `Transfiere ${formatCurrency(funds.pending, r.currency)} a la cuenta de custodia`,
          <div className="flex flex-col gap-4">
            {r.reservedUntil && <WindowClock deadline={r.reservedUntil} label="Completa tu aporte antes del" className="bg-card" />}
            <FundsProgress amount={r.amount} confirmed={funds.confirmed} inReview={funds.inReview} currency={r.currency} detailed />
            <CustodyAccount reservation={r} />
          </div>,
          <>
            <Button className="h-10 rounded-xl" onClick={() => onAction("contribute")} data-testid="next-step-contribute">
              Registrar transferencia
            </Button>
            {pendingDocTitle && (
              <Button variant="outline" className="h-10 rounded-xl" onClick={() => onAction("sign")}>
                <PenLine />
                Firmar {pendingDocTitle.toLowerCase()}
              </Button>
            )}
          </>
        );
      }
      return shell(
        "wait",
        Hourglass,
        "Conciliando tu aporte",
        <>Registraste el 100%. Confirmamos cada transferencia con el banco en hasta 1 día hábil.</>
      );
    case "in_custody":
      return shell(
        "wait",
        CircleCheck,
        "Aporte completo y en custodia",
        <>Tu capital está conciliado en la cuenta de custodia. El siguiente hito es la participación en la subasta; te avisaremos cuando ocurra.</>
      );
    case "in_process": {
      const stage = OPERATION_STAGES.find((s) => s.id === r.stage);
      return shell("wait", Scale, `Etapa actual: ${stage?.label ?? "En proceso"}`, stage?.description ?? "");
    }
    case "settled":
      return shell(
        "done",
        CircleCheck,
        "Operación liquidada",
        r.settlement ? (
          <dl className="mt-1 grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Capital devuelto</dt>
              <dd className="font-semibold tabular-nums text-foreground">{formatCurrency(r.settlement.capitalReturned, r.currency)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Ganancia neta</dt>
              <dd className="font-semibold tabular-nums text-success">{formatCurrency(r.settlement.gain, r.currency)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Abonado el</dt>
              <dd className="font-semibold text-foreground">{formatLimaDate(r.settlement.settledAt)}</dd>
            </div>
          </dl>
        ) : (
          "Capital y ganancia abonados a tu cuenta verificada."
        )
      );
  }
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Clock; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function ReturnAccount({ userId }: { userId: string }) {
  const c = useCompliance(userId);
  return <Fact label="Cuenta de devolución" value={`${c.bankAccount.bank} ···${c.bankAccount.last4}`} />;
}
