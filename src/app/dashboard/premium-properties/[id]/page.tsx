"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  FileText,
  Footprints,
  LineChart,
  MapPin,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { DetailSection } from "@/components/premium/DetailSection";
import { ReservationPanel, primaryAction } from "@/components/premium/ReservationPanel";
import { AdvisorDialog } from "@/components/premium/AdvisorDialog";
import { useCurrentUser } from "@/contexts/user-context";
import { getPremiumPropertyById } from "@/lib/premium/mock-data";
import { getAvailability } from "@/lib/premium/availability";
import { OPERATION_STAGES, useReservations } from "@/lib/premium/reservations";
import { getEstimatedTerm, getPremiumScenarios } from "@/lib/premium/scenarios";
import { formatLimaDate } from "@/lib/premium/dates";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

const RISKS = [
  "El retorno es una estimación y no está garantizado.",
  "El plazo depende del proceso judicial y puede extenderse.",
  "La venta puede cerrar por debajo de lo estimado (escenario adverso).",
  "La liquidez no es inmediata: el capital queda comprometido hasta la liquidación.",
  "Invertir el 100% no equivale a adquirir la propiedad registral de forma automática.",
];

export default function PremiumPropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = getPremiumPropertyById(id);
  const { user, isPremium } = useCurrentUser();
  const reservations = useReservations();
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [scenariosOpen, setScenariosOpen] = useState<boolean | undefined>(undefined);
  const [ctaVisible, setCtaVisible] = useState(true);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Barra fija en móvil: solo cuando el CTA del panel sale de la vista.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [property?.id]);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold">Oportunidad no encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">Puede que la ventana haya cerrado o que el enlace sea incorrecto.</p>
        <Button asChild variant="outline" className="mt-5 rounded-xl">
          <Link href="/dashboard/premium-properties">Ver oportunidades Premium</Link>
        </Button>
      </div>
    );
  }

  const availability = getAvailability(property, reservations, user.id);
  const scenarios = getPremiumScenarios(property);
  const term = getEstimatedTerm(property);
  const totalCosts = property.roiBasis.costs.reduce((s, c) => s + c.amount, 0);
  const action = primaryAction(property, availability, isPremium);
  const hidden = availability.kind === "taken";

  const showScenarios = () => {
    setScenariosOpen(true);
    requestAnimationFrame(() =>
      document.getElementById("escenarios")?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  if (hidden) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold">Esta oportunidad ya no está disponible</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Otro inversionista completó su aporte. Te avisaremos cuando se abra una nueva ventana.</p>
        <Button asChild variant="outline" className="mt-5 rounded-xl">
          <Link href="/dashboard/premium-properties?filter=available">Ver oportunidades disponibles</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", action && "pb-24 lg:pb-0")}>
      <Link
        href="/dashboard/premium-properties"
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Oportunidades Premium
      </Link>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <PremiumBadge size="md" />
          <CurrencyBadge currency={property.currency} />
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl text-balance">
          {property.name}
        </h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{property.address}</span>
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((img, i) => (
                  <CarouselItem key={img}>
                    <div className="relative aspect-[16/10]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${property.name}, foto ${i + 1}`} className="size-full object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {property.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-3 border-0 bg-card/90 shadow-md hover:bg-card" />
                  <CarouselNext className="right-3 border-0 bg-card/90 shadow-md hover:bg-card" />
                </>
              )}
            </Carousel>
          </div>

          {/* En móvil el panel de decisión va justo después de la foto */}
          <div className="lg:hidden">
            <ReservationPanel
              property={property}
              availability={availability}
              isPremium={isPremium}
              onOpenAdvisor={() => setAdvisorOpen(true)}
              onShowScenarios={showScenarios}
              ctaRef={ctaRef}
            />
          </div>

          <DetailSection
            title="Resumen de la oportunidad"
            icon={ScrollText}
            summary={`${property.type} · ${property.area} · ${property.judicial.etapa}`}
            defaultOpenMobile
          >
            <p className="text-sm leading-relaxed text-muted-foreground">{property.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
              <Fact label="Tipo" value={property.type} />
              <Fact label="Área" value={property.area} />
              <Fact label="Distrito" value={property.district} />
              <Fact label="Etapa judicial" value={property.judicial.etapa} />
              {term && isPremium && <Fact label="Plazo estimado" value={term} />}
              <Fact label="Publicada" value={formatLimaDate(property.createdAt)} />
            </dl>
          </DetailSection>

          <DetailSection
            title="¿Por qué es Premium?"
            icon={BadgeCheck}
            summary={`${property.premiumCriteria.length} criterios verificables`}
            locked={!isPremium}
          >
            <ul className="space-y-2">
              {property.premiumCriteria.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-foreground">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary dark:text-accent-foreground" />
                  {c}
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection
            title="Expediente y documentos"
            icon={ShieldCheck}
            summary={`Exp. ${property.judicial.expediente} · ${property.verification.documents.length} documentos`}
            locked={!isPremium}
          >
            <dl className="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
              <Fact label="N.º de expediente" value={property.judicial.expediente} mono />
              <Fact label="Juzgado" value={property.judicial.juzgado} />
              <Fact label="Etapa actual" value={property.judicial.etapa} />
              <Fact label="Revisado por Rematto" value={formatLimaDate(property.verification.verifiedAt)} />
            </dl>
            {property.verification.scope.length > 0 && (
              <>
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Qué se revisó</p>
                <ul className="space-y-1.5">
                  {property.verification.scope.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {property.verification.documents.length > 0 && (
              <>
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documentos</p>
                <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
                  {property.verification.documents.map((d) => (
                    <li key={d.label}>
                      <a href={d.url} className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted/50">
                        <FileText className="size-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1">{d.label}</span>
                        <span className="text-xs font-medium text-primary">Ver</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {property.judicial.sourceUrl && (
              <a
                href={property.judicial.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Consultar el expediente en el Poder Judicial
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </DetailSection>

          <DetailSection
            id="escenarios"
            title="Escenarios y costos"
            icon={LineChart}
            summary={`Esperado ${property.roiBasis.netRoi}% neto · adverso ${scenarios[0].netRoi}%`}
            locked={!isPremium}
            open={scenariosOpen}
            onOpenChange={setScenariosOpen}
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {scenarios.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "rounded-xl border p-3",
                    s.tone === "base" ? "border-primary/30 bg-primary/5" : "border-border/60 bg-muted/40"
                  )}
                >
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-bold tabular-nums",
                      s.netRoi < 0 ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {s.netRoi > 0 ? "+" : ""}
                    {s.netRoi}%
                  </p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {s.netGain >= 0 ? "Ganancia" : "Pérdida"} neta: {formatCurrency(Math.abs(s.netGain), property.currency)}
                  </p>
                  <p className="mt-2 text-xs leading-snug text-muted-foreground">{s.caption}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supuestos</p>
                <dl className="space-y-1.5 text-sm">
                  {property.roiBasis.assumptions.map((a) => (
                    <div key={a.label} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{a.label}</dt>
                      <dd className="text-right font-medium tabular-nums">{a.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Costos estimados</p>
                <dl className="space-y-1.5 text-sm">
                  {property.roiBasis.costs.map((c) => (
                    <div key={c.label} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{c.label}</dt>
                      <dd className="text-right font-medium tabular-nums">{formatCurrency(c.amount, property.currency)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 border-t border-border/60 pt-1.5">
                    <dt className="font-medium text-foreground">Total</dt>
                    <dd className="text-right font-semibold tabular-nums">{formatCurrency(totalCosts, property.currency)}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Retorno bruto {property.roiBasis.grossRoi}% · neto {property.roiBasis.netRoi}% en el escenario esperado, sobre la operación completa. Estimaciones de referencia, no promesas.
            </p>
          </DetailSection>

          <DetailSection
            title="Qué hace Rematto después de tu aporte"
            icon={Footprints}
            summary="Subasta, adjudicación, formalización y salida"
            locked={!isPremium}
          >
            <ol className="relative space-y-4 border-l border-border pl-5">
              {OPERATION_STAGES.map((s, i) => (
                <li key={s.id} className="relative">
                  <span className="absolute -left-[29px] flex size-5 items-center justify-center rounded-full bg-card text-[11px] font-bold text-foreground ring-1 ring-border">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
              Te notificamos cada hito, publicamos cada documento en tu seguimiento y tienes una asesora asignada durante toda la operación.
            </p>
          </DetailSection>

          <DetailSection title="Riesgos" icon={AlertTriangle} summary="Lee esto antes de solicitar la reserva" locked={!isPremium}>
            <ul className="space-y-2">
              {RISKS.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                  {r}
                </li>
              ))}
            </ul>
            <Link href="/politica-de-riesgos" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Ver política de riesgos completa
              <ArrowRight className="size-3.5" />
            </Link>
          </DetailSection>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ReservationPanel
              property={property}
              availability={availability}
              isPremium={isPremium}
              onOpenAdvisor={() => setAdvisorOpen(true)}
              onShowScenarios={showScenarios}
            />
          </div>
        </aside>
      </div>

      {/* Barra de acción fija en móvil (aparece cuando el CTA del panel sale de vista) */}
      {action && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-md transition-transform duration-300 lg:hidden",
            ctaVisible ? "translate-y-full" : "translate-y-0"
          )}
          aria-hidden={ctaVisible}
          inert={ctaVisible ? true : undefined}
        >
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">Capital requerido</p>
              <p className="truncate text-base font-bold tabular-nums text-foreground">
                {formatCurrency(property.totalValue, property.currency)}
              </p>
            </div>
            <Button asChild className="h-11 shrink-0 rounded-xl px-5 font-semibold">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          </div>
        </div>
      )}

      <AdvisorDialog open={advisorOpen} onOpenChange={setAdvisorOpen} context={property.name} />
    </div>
  );
}

function Fact({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("mt-0.5 font-medium text-foreground", mono && "font-mono text-[13px] break-all")}>{value}</dd>
    </div>
  );
}
