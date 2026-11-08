"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CircleCheck,
  Crown,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  Split,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { ComplianceChecklist } from "@/components/premium/ComplianceChecklist";
import { ReservationStepper } from "@/components/premium/ReservationStepper";
import { WindowClock } from "@/components/premium/WindowClock";
import { trackingHref } from "@/components/premium/reservation-ui";
import { useCurrentUser } from "@/contexts/user-context";
import { useNotifications } from "@/contexts/notifications-context";
import { getAllPremiumProperties, getPremiumPropertyById } from "@/lib/premium/mock-data";
import { getAvailability } from "@/lib/premium/availability";
import { canRequestReservation, useCompliance } from "@/lib/premium/compliance";
import {
  FUNDING_PLAN_LABELS,
  requestReservation,
  useReservations,
  type FundingPlan,
  type PremiumReservation,
} from "@/lib/premium/reservations";
import { getEstimatedTerm, getPremiumScenarios } from "@/lib/premium/scenarios";
import { getMaxForCurrency } from "@/lib/invest/payment-limits";
import { formatCurrency } from "@/lib/currency";
import type { PremiumProperty } from "@/lib/premium/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "expediente", label: "Expediente" },
  { id: "cuenta", label: "Validar cuenta" },
  { id: "aporte", label: "Aporte" },
  { id: "enviar", label: "Enviar solicitud" },
] as const;

const ACKS = [
  { id: "file", label: "Revisé el expediente, los costos y los riesgos de esta oportunidad." },
  { id: "estimate", label: "Entiendo que el retorno es estimado y no está garantizado; puede ser menor o negativo." },
  { id: "title", label: "Entiendo que financiar el 100% no equivale a adquirir la propiedad registral de forma automática." },
];

export default function PremiumReservationPage() {
  return (
    <Suspense>
      <ReservationFlow />
    </Suspense>
  );
}

function ReservationFlow() {
  const searchParams = useSearchParams();
  const { user, isPremium } = useCurrentUser();
  const reservations = useReservations();
  const propertyId = searchParams.get("property");
  const property = propertyId ? getPremiumPropertyById(propertyId) : undefined;
  const [submitted, setSubmitted] = useState<PremiumReservation | null>(null);

  if (!isPremium) return <Gate />;
  if (submitted && property) return <Success reservation={submitted} property={property} />;
  if (!property) return <PickProperty userId={user.id} />;

  const availability = getAvailability(property, reservations, user.id);
  if (availability.kind === "mine") {
    return (
      <StateCard
        icon={CircleCheck}
        title="Ya tienes una reserva para esta oportunidad"
        body="Sigue su avance, firma documentos y registra tus aportes desde el seguimiento."
        primary={{ label: "Ver seguimiento", href: trackingHref(availability.reservation.id) }}
      />
    );
  }
  if (availability.kind !== "available") {
    return (
      <StateCard
        icon={AlertCircle}
        title="Esta oportunidad ya no admite solicitudes"
        body={
          availability.kind === "held"
            ? "Otro inversionista envió una solicitud antes. Si no se aprueba, volverá a estar disponible y te avisaremos."
            : "La ventana Premium cerró. Puedes participar en inversión colectiva desde S/ 500."
        }
        primary={{ label: "Ver oportunidades disponibles", href: "/dashboard/premium-properties?filter=available" }}
      />
    );
  }

  return <Wizard property={property} onSubmitted={setSubmitted} />;
}

function Wizard({ property, onSubmitted }: { property: PremiumProperty; onSubmitted: (r: PremiumReservation) => void }) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { addNotification } = useNotifications();
  const compliance = useCompliance(user.id);
  const [step, setStep] = useState(0);
  const [acks, setAcks] = useState<Record<string, boolean>>({});
  const [plan, setPlan] = useState<FundingPlan | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scenarios = getPremiumScenarios(property);
  const term = getEstimatedTerm(property);
  const totalCosts = property.roiBasis.costs.reduce((s, c) => s + c.amount, 0);
  const cardMax = getMaxForCurrency("card", property.currency);

  const canContinue = [
    ACKS.every((a) => acks[a.id]),
    canRequestReservation(compliance),
    plan !== null,
    true,
  ][step];

  const blockedHint = [
    "Confirma las tres declaraciones para continuar.",
    compliance.sourceOfFunds.status === "action_required"
      ? "Envía tu declaración de origen de fondos para continuar."
      : "Completa tu verificación para continuar.",
    "Elige cómo harás el aporte.",
    "",
  ][step];

  const submit = () => {
    setSending(true);
    setError(null);
    setTimeout(() => {
      const result = requestReservation({ user, property, fundingPlan: plan! });
      setSending(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      addNotification({
        category: "premium",
        title: `Solicitud de reserva enviada — ${property.name}`,
        description: "La revisaremos en 1 día hábil. Enviar la solicitud no generó ningún cobro.",
        href: trackingHref(result.value.id),
      });
      onSubmitted(result.value);
      window.scrollTo({ top: 0 });
    }, 900);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else submit();
  };
  const back = () => {
    if (step === 0) router.push(`/dashboard/premium-properties/${property.id}`);
    else {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-28 lg:pb-0">
      <Link
        href={`/dashboard/premium-properties/${property.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a la ficha
      </Link>

      <div className="mb-5">
        <div className="mb-1.5 flex items-center gap-2">
          <PremiumBadge size="md" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Solicitar reserva</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa las condiciones antes de comprometer capital. Enviar la solicitud no genera ningún cobro.
        </p>
      </div>

      <StepHeader step={step} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex min-w-0 flex-col gap-4 [&>*]:min-w-0"
            >
              {step === 0 && (
                <>
                  <Card title="Qué estás solicitando">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Reservar en exclusiva el <strong className="text-foreground">100% del capital</strong> de{" "}
                      <strong className="text-foreground">{property.name}</strong>. Si la aprobamos, firmarás un contrato de reserva
                      y tendrás <strong className="text-foreground">5 días hábiles</strong> para completar el aporte.
                    </p>
                  </Card>
                  <Card title="Condiciones clave">
                    <dl className="divide-y divide-border/60 text-sm">
                      <Row label="Capital requerido" value={formatCurrency(property.totalValue, property.currency)} strong />
                      <Row
                        label="Retorno neto estimado"
                        value={`${property.roiBasis.netRoi}% esperado · ${scenarios[0].netRoi}% adverso`}
                      />
                      {term && <Row label="Plazo estimado" value={term} />}
                      <Row label="Costos estimados de la operación" value={formatCurrency(totalCosts, property.currency)} />
                      <Row label="Expediente" value={property.judicial.expediente} mono />
                    </dl>
                    <Link
                      href={`/dashboard/premium-properties/${property.id}#escenarios`}
                      className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                    >
                      Ver escenarios, documentos y riesgos
                    </Link>
                  </Card>
                  <Card title="Antes de continuar">
                    <div className="flex flex-col gap-3">
                      {ACKS.map((a) => (
                        <label key={a.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 p-3 text-sm text-foreground has-[[data-state=checked]]:border-primary/40 has-[[data-state=checked]]:bg-primary/5">
                          <Checkbox
                            checked={!!acks[a.id]}
                            onCheckedChange={(v) => setAcks((s) => ({ ...s, [a.id]: v === true }))}
                            className="mt-0.5"
                          />
                          <span className="leading-relaxed">{a.label}</span>
                        </label>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {step === 1 && (
                <Card
                  title="Verificación reforzada"
                  description="Las operaciones Premium exigen identidad, origen de fondos y una cuenta bancaria a tu nombre."
                >
                  <ComplianceChecklist profile={compliance} />
                </Card>
              )}

              {step === 2 && (
                <>
                  <Card title="¿Cómo harás el aporte?" description="Lo podrás ajustar con tu asesora antes de transferir.">
                    <div role="radiogroup" aria-label="Plan de aporte" className="grid gap-3 sm:grid-cols-2">
                      <PlanOption
                        selected={plan === "single"}
                        onSelect={() => setPlan("single")}
                        icon={Banknote}
                        title={FUNDING_PLAN_LABELS.single}
                        body={`Una transferencia de ${formatCurrency(property.totalValue, property.currency)}.`}
                      />
                      <PlanOption
                        selected={plan === "staged"}
                        onSelect={() => setPlan("staged")}
                        icon={Split}
                        title={FUNDING_PLAN_LABELS.staged}
                        body="Varias transferencias hasta completar el 100% dentro del plazo de la reserva."
                      />
                    </div>
                  </Card>
                  <Card title="Medio de pago">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/70">
                        <Landmark className="size-4" />
                      </span>
                      <div className="min-w-0 text-sm">
                        <p className="font-semibold text-foreground">Transferencia bancaria</p>
                        <p className="text-muted-foreground">
                          Desde tu cuenta verificada {compliance.bankAccount.bank} ···{compliance.bankAccount.last4}.
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                      Tarjeta y Yape no están disponibles para este monto
                      {cardMax ? ` (la tarjeta admite hasta ${formatCurrency(cardMax, property.currency)} por operación)` : ""}.
                    </p>
                  </Card>
                  <Card title="Dónde estará tu dinero">
                    <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                      <Bullet>Transfieres a una cuenta de custodia exclusiva para operaciones Premium. Verás sus datos al aprobarse la reserva.</Bullet>
                      <Bullet>Cada transferencia se concilia y la ves como &quot;Confirmado&quot; en tu seguimiento.</Bullet>
                      <Bullet>Si la operación no se formaliza, el aporte se devuelve a tu cuenta verificada.</Bullet>
                    </ul>
                  </Card>
                </>
              )}

              {step === 3 && (
                <>
                  <Card title="Revisa tu solicitud">
                    <dl className="divide-y divide-border/60 text-sm">
                      <Row label="Oportunidad" value={property.name} />
                      <Row label="Capital a reservar" value={formatCurrency(property.totalValue, property.currency)} strong />
                      <Row label="Plan de aporte" value={plan ? FUNDING_PLAN_LABELS[plan] : "—"} />
                      <Row label="Medio" value={`Transferencia desde ${compliance.bankAccount.bank} ···${compliance.bankAccount.last4}`} />
                      <Row label="Cobro al enviar" value="Ninguno" />
                    </dl>
                  </Card>
                  <Card title="Qué pasa después">
                    <ol className="flex flex-col gap-3 text-sm">
                      {[
                        ["Revisión", "Validamos tu cuenta y la solicitud en 1 día hábil. Mientras tanto, nadie más puede solicitarla."],
                        ["Firma", "Si se aprueba, firmas el contrato de reserva desde tu seguimiento."],
                        ["Aporte", "Transfieres a la cuenta de custodia dentro de 5 días hábiles."],
                        ["Si no se aprueba", "La oportunidad se libera y no se realiza ningún cobro."],
                      ].map(([t, b], i) => (
                        <li key={t} className="flex gap-3">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{i + 1}</span>
                          <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{t}. </span>
                            {b}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </Card>
                  {error && (
                    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                      <div>
                        <p className="font-semibold text-foreground">No pudimos enviar la solicitud</p>
                        <p className="mt-0.5 text-muted-foreground">{error}</p>
                        <Link href="/dashboard/premium-properties?filter=available" className="mt-2 inline-flex font-medium text-primary hover:underline">
                          Ver otras oportunidades
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navegación (escritorio) */}
          <div className="mt-6 hidden items-center justify-between gap-3 lg:flex">
            <Button variant="ghost" className="h-11 rounded-xl" onClick={back}>
              <ArrowLeft />
              {step === 0 ? "Volver a la ficha" : "Atrás"}
            </Button>
            <div className="flex items-center gap-3">
              {!canContinue && blockedHint && <p className="text-xs text-muted-foreground">{blockedHint}</p>}
              <Button className="h-11 min-w-48 rounded-xl font-semibold" disabled={!canContinue || sending} onClick={next} data-testid="wizard-next">
                {sending ? <Loader2 className="animate-spin" /> : null}
                {step === STEPS.length - 1 ? (sending ? "Enviando…" : "Enviar solicitud de reserva") : "Continuar"}
                {!sending && step < STEPS.length - 1 && <ArrowRight />}
              </Button>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Summary property={property} plan={plan} />
          </div>
        </aside>
      </div>

      {/* Navegación (móvil): barra fija al alcance del pulgar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md lg:hidden">
        {!canContinue && blockedHint && <p className="mb-2 text-center text-xs text-muted-foreground">{blockedHint}</p>}
        <div className="mx-auto flex max-w-xl gap-2">
          <Button variant="outline" className="h-11 rounded-xl px-4" onClick={back} aria-label={step === 0 ? "Volver a la ficha" : "Atrás"}>
            <ArrowLeft />
          </Button>
          <Button className="h-11 flex-1 rounded-xl font-semibold" disabled={!canContinue || sending} onClick={next} data-testid="wizard-next-mobile">
            {sending ? <Loader2 className="animate-spin" /> : null}
            {step === STEPS.length - 1 ? (sending ? "Enviando…" : "Enviar solicitud") : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ step }: { step: number }) {
  return (
    <div>
      <div className="flex gap-1.5 sm:hidden" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s.id} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground sm:hidden">
        Paso {step + 1} de {STEPS.length} · <span className="font-semibold text-foreground">{STEPS[step].label}</span>
      </p>
      <ol className="hidden items-center gap-2 sm:flex" aria-label="Pasos de la solicitud">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2" aria-current={i === step ? "step" : undefined}>
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                i < step && "bg-primary text-primary-foreground",
                i === step && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                i > step && "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn("whitespace-nowrap text-sm font-medium", i <= step ? "text-foreground" : "text-muted-foreground")}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <span className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Summary({ property, plan }: { property: PremiumProperty; plan: FundingPlan | null }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={property.img} alt="" className="aspect-[16/9] w-full object-cover" />
      <div className="p-4">
        <p className="text-sm font-semibold leading-snug text-foreground">{property.name}</p>
        <p className="text-xs text-muted-foreground">{property.district}</p>
        <div className="my-4 h-px bg-border/70" />
        <p className="text-xs text-muted-foreground">Capital requerido</p>
        <p className="text-2xl font-bold tabular-nums text-foreground">{formatCurrency(property.totalValue, property.currency)}</p>
        {plan && <p className="mt-1 text-xs text-muted-foreground">{FUNDING_PLAN_LABELS[plan]}</p>}
        <WindowClock deadline={property.premiumDeadline} className="mt-4" />
      </div>
    </div>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value, strong, mono }: { label: string; value: string; strong?: boolean; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("text-foreground sm:text-right", strong ? "text-base font-bold tabular-nums" : "font-medium", mono && "font-mono text-[13px] break-all")}>
        {value}
      </dd>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary dark:text-accent-foreground" />
      <span>{children}</span>
    </li>
  );
}

function PlanOption({
  selected,
  onSelect,
  icon: Icon,
  title,
  body,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: typeof Banknote;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/70 hover:border-primary/40"
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70")}>
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{body}</span>
      </span>
    </button>
  );
}

function Success({ reservation, property }: { reservation: PremiumReservation; property: PremiumProperty }) {
  return (
    <div className="mx-auto w-full max-w-2xl py-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8"
        data-testid="reservation-success"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-success/12 text-success">
          <CircleCheck className="size-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Solicitud enviada</h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Reservamos <strong className="text-foreground">{property.name}</strong> para ti mientras revisamos tu solicitud. Te responderemos en 1 día hábil. No se realizó ningún cobro.
        </p>
        <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Código de solicitud</span>
          <span className="font-mono font-semibold text-foreground">{reservation.code}</span>
        </div>
        <ReservationStepper status="requested" className="mt-6" />
        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <Link href="/dashboard/premium-properties">Volver a oportunidades</Link>
          </Button>
          <Button asChild className="h-11 rounded-xl font-semibold">
            <Link href={trackingHref(reservation.id)}>
              Ver seguimiento
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function StateCard({
  icon: Icon,
  title,
  body,
  primary,
}: {
  icon: typeof Lock;
  title: string;
  body: string;
  primary: { label: string; href: string };
}) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-foreground/70">
        <Icon className="size-6" />
      </span>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Button asChild className="mt-6 h-11 rounded-xl">
        <Link href={primary.href}>{primary.label}</Link>
      </Button>
    </div>
  );
}

function Gate() {
  return (
    <StateCard
      icon={Crown}
      title="Las reservas Premium requieren acceso Premium"
      body="Premium está pensado para quienes pueden financiar individualmente el 100% de una operación. Revisa los requisitos en tu cuenta."
      primary={{ label: "Conocer Premium", href: "/dashboard/account?section=premium" }}
    />
  );
}

function PickProperty({ userId }: { userId: string }) {
  const reservations = useReservations();
  const options = useMemo(
    () => getAllPremiumProperties().filter((p) => getAvailability(p, reservations, userId).kind === "available"),
    [reservations, userId]
  );
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Solicitar reserva</h1>
      <p className="mt-1 text-sm text-muted-foreground">Elige una oportunidad con ventana abierta.</p>
      <ul className="mt-6 flex flex-col gap-3">
        {options.map((p) => (
          <li key={p.id}>
            <Link
              href={`/dashboard/premium-invest?property=${p.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-3 shadow-sm hover:border-primary/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-sm font-bold tabular-nums text-foreground">{formatCurrency(p.totalValue, p.currency)}</p>
                <WindowClock deadline={p.premiumDeadline} compact />
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
        {options.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No hay ventanas abiertas en este momento.
          </li>
        )}
      </ul>
    </div>
  );
}
