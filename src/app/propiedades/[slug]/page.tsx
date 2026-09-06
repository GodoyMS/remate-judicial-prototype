import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  FileLock2,
  Gavel,
  KeyRound,
  MapPin,
  Receipt,
  ShieldAlert,
  Users,
} from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney, formatPercent } from "@/lib/currency";
import {
  BASE_SCENARIO,
  FEES,
  getOpportunityBySlug,
  landingOpportunities,
  simulate,
} from "@/lib/landing/opportunities";
import { cn } from "@/lib/utils";

/**
 * Public property page — second review, findings 5, 6, 14 and 27.
 *
 * · 5 — registration used to be demanded before a reader could evaluate
 *   anything. Everything needed to decide whether an operation is worth
 *   considering is public here: status, location, base price, capital
 *   required, estimated return, term, amount still available, description,
 *   main risks and the fees that apply. The account is asked for only at the
 *   two committing actions — investing and the complete file.
 * · 14 — this is where the rationale paragraph and the worked example live
 *   now, off the comparison card.
 * · 27 — the worked example uses the same `simulate()` as the landing
 *   simulator, in the same reference scenario, so the two figures agree.
 */

export function generateStaticParams() {
  return landingOpportunities.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opportunity = getOpportunityBySlug(slug);
  if (!opportunity) return { title: `Propiedad no encontrada | ${BRAND_NAME}` };

  return {
    title: `${opportunity.name} | ${BRAND_NAME}`,
    description: `${opportunity.type} en ${opportunity.district}. Precio base ${formatMoney(
      opportunity.basePrice,
      opportunity.currency
    )}, retorno estimado ${formatPercent(opportunity.roi)} anual, inversión mínima ${formatMoney(
      opportunity.minTicket,
      opportunity.currency
    )}.`,
  };
}

export default async function PropiedadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = getOpportunityBySlug(slug);
  if (!o) notFound();

  const isOpen = o.availability === "open";
  const available = Math.max(0, o.target - o.raised);
  const money = (value: number) => formatMoney(value, o.currency);
  const expected = simulate(o.minTicket, o.roi, BASE_SCENARIO);

  const facts = [
    { label: "Precio base", value: money(o.basePrice) },
    { label: "Capital requerido", value: money(o.target) },
    { label: "Retorno estimado", value: `${formatPercent(o.roi)} anual` },
    { label: "Inversión mínima", value: money(o.minTicket) },
    { label: "Plazo estimado", value: "12 a 24 meses" },
    {
      label: isOpen ? "Cierra en" : "Apertura prevista",
      value: o.deadline,
    },
  ];

  const fees = [
    {
      concept: "Estructuración",
      rate: `${formatPercent(FEES.structuring * 100, 1)} del monto invertido`,
      helper: "Se cobra al completarse el capital, antes de la subasta.",
    },
    {
      concept: "Gestión del activo",
      rate: `${formatPercent(FEES.management * 100, 1)} anual sobre el capital`,
      helper: "Prorrateada al liquidar la operación.",
    },
    {
      concept: "Comisión de éxito",
      rate: `${formatPercent(FEES.success * 100)} de la ganancia`,
      helper: "No se cobra si no existe ganancia.",
    },
  ];

  return (
    <LegalPageLayout>
      {/* ── Header ── */}
      <section className="border-b border-border bg-muted/50 py-8 sm:py-10">
        <div className="mx-auto max-w-[1400px] section-padding">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Inicio
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <Link
              href="/propiedades"
              className="transition-colors hover:text-foreground"
            >
              Propiedades
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <span className="font-medium text-foreground">{o.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "type-label rounded-full px-3 py-1.5",
                isOpen
                  ? "bg-primary/10 text-primary"
                  : "bg-foreground/10 text-foreground/70"
              )}
            >
              {o.statusLabel}
            </span>
            <CurrencyBadge currency={o.currency} />
          </div>

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {o.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 type-body text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {o.address} · {o.type} · {o.area}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-[1400px] gap-10 section-padding lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          {/* ── Main column ── */}
          <div className="min-w-0">
            {/* Gallery */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={o.images[0] ?? o.image}
                alt={o.name}
                className="aspect-[16/9] w-full object-cover"
              />
              {o.images.length > 1 && (
                <div className="grid grid-cols-3 gap-px bg-border">
                  {o.images.slice(1, 4).map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt={`${o.name} — vista ${i + 2}`}
                      className="aspect-[4/3] w-full bg-card object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Description + rationale */}
            <div className="mt-8">
              <h2 className="type-h2 text-foreground">La oportunidad</h2>
              <p className="mt-4 type-body text-pretty text-muted-foreground">
                {o.description}
              </p>
              {o.rationale && (
                <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 type-body text-pretty text-foreground/85">
                  <strong className="font-semibold">Por qué esta:</strong>{" "}
                  {o.rationale}
                </p>
              )}
            </div>

            {/* Judicial record */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h3 className="flex items-center gap-2 type-h3 text-foreground">
                <Gavel className="size-4.5 text-primary" />
                Expediente judicial
              </h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="type-caption text-muted-foreground">
                    N° de expediente
                  </dt>
                  <dd className="mt-1 type-body font-semibold text-foreground">
                    {o.expediente}
                  </dd>
                </div>
                <div>
                  <dt className="type-caption text-muted-foreground">Juzgado</dt>
                  <dd className="mt-1 type-body font-semibold text-foreground">
                    {o.court}
                  </dd>
                </div>
                <div>
                  <dt className="type-caption text-muted-foreground">
                    Estado de ocupación
                  </dt>
                  <dd className="mt-1 type-body font-semibold text-foreground">
                    {o.occupancy}
                  </dd>
                </div>
              </dl>
              <p className="type-caption mt-4 border-t border-border/70 pt-4 text-muted-foreground">
                Puedes contrastar este expediente en la{" "}
                <a
                  href="https://cej.pj.gob.pe/cej/forms/busquedaform.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  Consulta de Expedientes Judiciales del Poder Judicial
                </a>
                . El estudio de títulos completo y las actuaciones del proceso
                están en la documentación de la operación.
              </p>
            </div>

            {/* Worked example — same arithmetic as the simulator */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h3 className="type-h3 text-foreground">
                Qué representaría para {money(o.minTicket)}
              </h3>
              <p className="mt-3 type-body text-pretty text-muted-foreground">
                En el escenario esperado —la operación se comporta como fue
                modelada y se vende en {expected.scenario.months} meses—
                recibirías aproximadamente{" "}
                <strong className="font-bold text-foreground">
                  {money(Math.round(expected.net))}
                </strong>
                , ya con las comisiones descontadas. Es uno de tres escenarios
                de referencia, no una proyección.
              </p>
              <Link
                href="/#simulador"
                className="type-body mt-4 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                Simular con otro monto y ver los tres escenarios
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Risks */}
            <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 sm:p-6">
              <h3 className="flex items-center gap-2 type-h3 text-foreground">
                <ShieldAlert className="size-4.5 text-destructive" />
                Riesgos principales de esta operación
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {o.risks.map((risk) => (
                  <li
                    key={risk}
                    className="flex items-start gap-2.5 text-pretty type-body text-muted-foreground"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive"
                      aria-hidden
                    />
                    {risk}
                  </li>
                ))}
              </ul>
              <Link
                href="/politica-de-riesgos"
                className="type-body mt-4 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                Los ocho escenarios documentados
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Fees */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h3 className="flex items-center gap-2 type-h3 text-foreground">
                <Receipt className="size-4.5 text-primary" />
                Costos y comisiones aplicables
              </h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                {fees.map((fee) => (
                  <div key={fee.concept} className="flex flex-col">
                    <dt className="type-body font-semibold text-foreground">
                      {fee.concept}
                      <span className="block type-caption font-normal text-muted-foreground">
                        {fee.rate}
                      </span>
                    </dt>
                    <dd className="type-caption mt-2 border-t border-border/60 pt-2 text-muted-foreground">
                      {fee.helper}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="type-caption mt-4 border-t border-border/70 pt-4 text-muted-foreground">
                A esto se suman los costos de terceros (aranceles judiciales,
                gastos notariales y registrales, impuestos) que se descuentan
                del resultado de la operación.{" "}
                <Link
                  href="/tarifas"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  Ver todas las tarifas
                </Link>
                .
              </p>
            </div>
          </div>

          {/* ── Aside: the decision panel ── */}
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-foreground/5 sm:p-6">
              <dl className="grid grid-cols-2 gap-4">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="type-caption text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-base font-bold tabular-nums text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {isOpen && (
                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex items-baseline justify-between type-caption text-muted-foreground">
                    <span>Capital cubierto</span>
                    <span className="font-bold tabular-nums text-foreground">
                      {formatPercent(o.fundedPct)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, o.fundedPct)}%` }}
                    />
                  </div>
                  <p className="mt-3 flex items-center justify-between type-caption text-muted-foreground">
                    <span>
                      Disponible:{" "}
                      <strong className="font-semibold text-foreground">
                        {money(available)}
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" />
                      {o.investors} inversionistas
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2.5 border-t border-border pt-5">
                {isOpen ? (
                  <>
                    <Button
                      asChild
                      className="h-auto min-h-12 whitespace-normal rounded-2xl py-3 text-center text-base font-semibold leading-snug"
                    >
                      <Link href="/register">
                        <KeyRound className="mr-1.5 size-4 shrink-0" />
                        Crear cuenta para invertir
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto min-h-11 whitespace-normal rounded-2xl py-2.5 text-center font-semibold leading-snug"
                    >
                      <Link href="/register">
                        <FileLock2 className="mr-1.5 size-4 shrink-0" />
                        Crear cuenta para ver el expediente completo
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="rounded-xl bg-muted p-3 type-caption text-muted-foreground">
                      Esta operación todavía no acepta aportes. Las cuentas
                      Premium acceden a ella antes de su apertura.
                    </p>
                    <Button
                      asChild
                      className="h-12 rounded-full text-base font-semibold"
                    >
                      <Link href="/premium">Conocer Premium</Link>
                    </Button>
                  </>
                )}
                <Link
                  href="/contacto"
                  className="mt-1 text-center type-body font-semibold text-primary hover:underline"
                >
                  Hablar con un asesor
                </Link>
              </div>

              <p className="type-caption mt-5 border-t border-border pt-4 text-muted-foreground">
                Explorar y simular no requiere cuenta. La cuenta se pide solo
                para invertir o abrir la documentación completa.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </LegalPageLayout>
  );
}
