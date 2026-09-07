import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ChevronRight,
  CircleDollarSign,
  FileText,
  Info,
  KeyRound,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney, formatPercent } from "@/lib/currency";
import {
  BASE_SCENARIO,
  getOpportunityBySlug,
  landingOpportunities,
  simulate,
} from "@/lib/landing/opportunities";
import { cn } from "@/lib/utils";

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

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-muted/50 px-3 py-3 sm:px-4 sm:py-3.5",
        className
      )}
    >
      <dt className="type-caption text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-bold tabular-nums text-foreground sm:text-base">
        {value}
      </dd>
    </div>
  );
}

function PropertyGallery({
  name,
  images,
  fallback,
}: {
  name: string;
  images: string[];
  fallback: string;
}) {
  const main = images[0] ?? fallback;
  const thumbs = images.length > 1 ? images.slice(1, 4) : [];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={main}
        alt={name}
        className="aspect-video w-full object-cover"
        decoding="async"
      />
      {thumbs.length > 0 && (
        <div className="grid grid-cols-3 gap-px bg-border">
          {thumbs.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`${name} — vista ${i + 2}`}
              className="aspect-4/3 w-full bg-card object-cover"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      )}
    </div>
  );
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
  const termMonths = expected.scenario.months;

  const availableLabel = isOpen ? money(available) : "Por confirmar";

  const details: {
    icon: typeof FileText;
    title: string;
    description: string;
    content?: ReactNode;
  }[] = [
    {
      icon: FileText,
      title: "Descripción de la oportunidad",
      description: o.rationale || o.description,
    },
    {
      icon: ShieldAlert,
      title: "Riesgos principales",
      description:
        "El resultado y el plazo pueden variar según el precio final de venta, la ocupación del inmueble y el desarrollo del proceso judicial.",
    },
    {
      icon: CircleDollarSign,
      title: "Costos y comisiones",
      description: "Por confirmar",
      content: isOpen ? (
        <>
          Estructuración, gestión y comisión de éxito — detalle en{" "}
          <Link
            href="/tarifas"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Tarifas
          </Link>
          .
        </>
      ) : undefined,
    },
  ];

  return (
    <LegalPageLayout>
      <section className=" py-8 sm:py-10">
        <div className="mx-auto max-w-350 section-padding">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Inicio
            </Link>
            <ChevronRight className="size-3.5 shrink-0" aria-hidden />
            <Link
              href="/propiedades"
              className="transition-colors hover:text-foreground"
            >
              Propiedades
            </Link>
            <ChevronRight className="size-3.5 shrink-0" aria-hidden />
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
          <p className="mt-2 flex items-start gap-1.5 type-body text-muted-foreground sm:items-center">
            <MapPin className="mt-0.5 size-4 shrink-0 sm:mt-0" aria-hidden />
            <span>
              {o.address} · {o.type} · {o.area}
            </span>
          </p>

        </div>
      </section>

      <section className="pb-10 sm:pb-14">
        <div className="mx-auto max-w-350 section-padding">
          {/*
            Mobile: gallery → decision panel → details.
            Desktop: gallery + details left, sticky decision panel right.
          */}
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-12">
            {/* Gallery */}
            <div className="order-1 min-w-0 lg:col-start-1 lg:row-start-1">
              <PropertyGallery
                name={o.name}
                images={o.images}
                fallback={o.image}
              />
            </div>

            {/* Decision panel */}
            <aside className="order-2 min-w-0 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-foreground/5 sm:p-6">
                <dl className="grid grid-cols-2 gap-3">
                  <StatCard label="Precio base" value={money(o.basePrice)} />
                  <StatCard
                    label="Inversión mínima"
                    value={money(o.minTicket)}
                  />
                </dl>

                <dl className="mt-3 grid grid-cols-2 gap-3">
                  <StatCard
                    label="Retorno estimado"
                    value={`${formatPercent(o.roi)} anual est.`}
                    className="col-span-2"
                  />
                  <StatCard
                    label="Plazo estimado"
                    value={`${termMonths} meses`}
                  />
                  <StatCard
                    label="Monto disponible"
                    value={availableLabel}
                  />
                </dl>

                <div className="mt-5 rounded-xl border border-primary/20 bg-primary/8 p-4 sm:p-5">
                  <p className="type-label text-primary">
                    Si inviertes {money(o.minTicket)}
                  </p>
                  <p className="mt-2 text-pretty text-base font-medium leading-snug text-foreground sm:text-lg">
                    Podrías recibir aproximadamente{" "}
                    <strong className="font-bold">
                      {money(Math.round(expected.net))}
                    </strong>{" "}
                    en unos{" "}
                    <strong className="font-bold">{termMonths} meses</strong>.
                  </p>
                  <p className="mt-2 type-caption text-pretty text-muted-foreground">
                    Equivale a {formatPercent(o.roi)} anual estimado. Cifra
                    referencial antes de impuestos, sujeta al precio de venta y
                    al plazo real.{" "}
                    <Link
                      href="/politica-de-riesgos"
                      className="font-semibold text-primary underline underline-offset-2"
                    >
                      Ver riesgos
                    </Link>
                    .
                  </p>
                </div>

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
                          Crear cuenta para ver el expediente
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
              </div>
            </aside>

            {/* Details */}
            <div className="order-3 min-w-0 space-y-6 lg:col-start-1 lg:row-start-2">
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="flex gap-4 p-4 sm:p-5">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                        aria-hidden
                      >
                        <Icon className="size-4.5" strokeWidth={2.1} />
                      </span>
                      <div className="min-w-0">
                        <p className="type-body font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 type-caption text-pretty text-muted-foreground">
                          {item.content ?? item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/8 p-4 sm:p-5">
                <Info
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden
                />
                <p className="type-caption text-pretty text-primary">
                  La información completa del expediente judicial y del juzgado
                  está disponible al crear una cuenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
