"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Home, Building2, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { dashboardProperties } from "@/lib/dashboard/mock-data";
import { formatMoney, formatPercent } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * Audit findings RM-006, RM-016 and RM-021.
 *
 * · RM-006 — "ROI est. 22%" told a reader who does not work in finance that
 *   something good was on offer, without saying what it means for their own
 *   money. Every card now translates the percentage into the concrete
 *   question: if I put in S/ 500, what comes back and when — labelled
 *   referential, because it is.
 * · RM-021 — the cards were a wall of prices and percentages with nothing
 *   explaining where the upside comes from. Each one carries a one-line
 *   rationale plus its court record, which is the part a reader can verify.
 * · RM-016 — all monetary values go through the shared formatters instead of
 *   being hand-typed, so soles and dollars render identically everywhere.
 */

/** Plain-language rationale per opportunity — the "why this one". */
const RATIONALE: Record<number, string> = {
  1: "Precio base por debajo del valor comercial de la zona, en un distrito con alta rotación de venta.",
  2: "Inmueble desocupado: sin lanzamiento judicial pendiente, la puesta en venta puede iniciar antes.",
  3: "Expediente en etapa avanzada y sin cargas registrales observadas en el estudio de títulos.",
};

/** Illustrative horizon used for the plain-language projection. */
const HORIZON_MONTHS = 14;
const SAMPLE_TICKET = 500;

const properties = dashboardProperties.slice(0, 3).map((p) => ({
  id: p.id,
  title: p.name,
  address: p.address,
  type: p.type,
  area: p.area,
  price: p.price,
  currency: p.currency,
  roi: p.roi,
  minInvestment: p.minInvestment,
  deadline: p.deadline,
  status: p.status,
  img: p.img,
  rationale: RATIONALE[p.id] ?? "",
  featured: p.id === 1,
}));

/** Simple pro-rata projection for the sample ticket over the sample horizon. */
function projectedReturn(ticket: number, annualRoi: number) {
  return Math.round(ticket * (1 + (annualRoi / 100) * (HORIZON_MONTHS / 12)));
}

export function PropertyPreview() {
  return (
    <section
      id="propiedades"
      data-nav-tone="light"
      className="relative overflow-hidden bg-muted/40 py-16 text-foreground sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 10%, transparent) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex max-w-xl flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Building2 className="size-3.5 text-primary" />
              <span className="type-label text-primary">
                Propiedades disponibles
              </span>
            </div>
            <h2 className="type-h2 text-balance">
              Subastas abiertas <span className="text-primary">ahora</span>
            </h2>
            <p className="type-lead text-muted-foreground">
              Cada operación con su expediente judicial, su precio base y qué
              representaría para una inversión de {formatMoney(SAMPLE_TICKET)}.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="h-11 shrink-0 rounded-full border-primary/40 bg-transparent px-6 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/register">
              Ver todas las propiedades
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                "group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                p.featured
                  ? "border-primary/40 ring-1 ring-primary/20"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                <span className="type-label absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-foreground backdrop-blur-sm">
                  {p.status}
                </span>
                <span className="type-caption absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-medium text-white backdrop-blur-sm">
                  Cierra en {p.deadline}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <div className="mb-1.5 flex items-center gap-2 type-caption text-muted-foreground">
                    <Home className="size-3.5" />
                    <span>
                      {p.type} · {p.area}
                    </span>
                    <CurrencyBadge currency={p.currency} className="ml-auto" />
                  </div>
                  <h3 className="type-h3 text-foreground">{p.title}</h3>
                  <div className="mt-1 flex items-center gap-1 type-caption text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{p.address}</span>
                  </div>
                </div>

                {/* RM-021 — why this property is an opportunity, in one line */}
                {p.rationale && (
                  <p className="type-caption rounded-xl bg-muted/70 p-3 text-muted-foreground">
                    {p.rationale}
                  </p>
                )}

                {/* RM-006 — the percentage, translated into money and time */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="type-label text-primary">
                    Si inviertes {formatMoney(SAMPLE_TICKET, p.currency)}
                  </p>
                  <p className="mt-1.5 type-body text-foreground">
                    Podrías recibir aproximadamente{" "}
                    <strong className="font-bold">
                      {formatMoney(
                        projectedReturn(SAMPLE_TICKET, p.roi),
                        p.currency
                      )}
                    </strong>{" "}
                    en unos {HORIZON_MONTHS} meses.
                  </p>
                  <p className="type-caption mt-1.5 text-muted-foreground">
                    Equivale a {formatPercent(p.roi)} anual estimado. Cifra
                    referencial antes de impuestos, sujeta al precio de venta y
                    al plazo real.{" "}
                    <Link
                      href="/politica-de-riesgos"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      Ver riesgos
                    </Link>
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                  <div className="bg-muted px-3 py-3">
                    <dt className="type-caption text-muted-foreground">
                      Precio base
                    </dt>
                    <dd className="mt-0.5 type-body font-semibold text-foreground">
                      {formatMoney(p.price, p.currency)}
                    </dd>
                  </div>
                  <div className="bg-muted px-3 py-3">
                    <dt className="type-caption text-muted-foreground">
                      Inversión mínima
                    </dt>
                    <dd className="mt-0.5 type-body font-semibold text-foreground">
                      {formatMoney(p.minInvestment, p.currency)}
                    </dd>
                  </div>
                </dl>

                <p className="flex items-start gap-1.5 type-caption text-muted-foreground">
                  <Gavel className="mt-0.5 size-3 shrink-0 text-primary" />
                  Expediente judicial y juzgado disponibles en la ficha completa.
                </p>

                <Button
                  className="mt-auto h-10 w-full rounded-xl font-semibold"
                  variant="outline"
                  asChild
                >
                  <Link href="/register">Ver esta oportunidad</Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
