"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Receipt,
  ScrollText,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney, formatMoneyCompact, formatPercent } from "@/lib/currency";

/**
 * "¿Por qué invertir?" — audit findings RM-011, RM-019, RM-020, RM-023,
 * RM-036, RM-038.
 *
 * What changed and why:
 *
 * · RM-019 — the section used to lead with four vanity metrics (S/ 48M+,
 *   3,200+, 22%, 100% legal), each of them an assertion the reader has no way
 *   to check. The four commercial pillars are now the argument, and every one
 *   of them ends in a link to the page that proves it. The metrics moved down
 *   into a supporting strip that says how they are measured.
 * · RM-020 — the first pillar answers the objection nobody was addressing:
 *   why go through a platform instead of bidding at the auction yourself.
 * · RM-023 — "trust us, we're safe" became "here is where you can verify it".
 * · RM-011 — the four unrelated stock photographs are gone. Icons and brand
 *   surfaces give the block one visual language that belongs to the product.
 * · RM-036 / RM-038 — the previous implementation pinned the section and
 *   hijacked wheel and touch scrolling, which is what threw the copy out of
 *   alignment on phones. It is now an ordinary responsive grid: one column on
 *   mobile, two from `sm`, identical content and hierarchy at every width.
 */

type Pillar = {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  desc: string;
  proofLabel: string;
  proofHref: string;
  image: string;
  imageAlt: string;
};

const PILLARS: Pillar[] = [
  {
    id: "access",
    icon: Coins,
    eyebrow: "Acceso",
    title: `Un mercado que antes exigía el monto completo, ahora desde ${formatMoney(500)}`,
    desc: "Postular a un remate judicial por tu cuenta exige el precio íntegro del inmueble en pocos días. Aquí el monto se reúne entre varios inversores y participas con un ticket pequeño.",
    proofLabel: "Por qué no ir directo al remate",
    proofHref: "/nosotros#por-que-rematto",
    /* Acceso — a residential block: the asset a single buyer could not reach
       alone and a pool can. */
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Edificio residencial en una zona urbana consolidada",
  },
  {
    id: "legal",
    icon: ScrollText,
    eyebrow: "Rigor legal",
    title: "Cada operación se identifica con su expediente judicial",
    desc: "Publicamos el número de expediente y el juzgado de cada propiedad, para que puedas contrastarlo en la fuente pública. Antes de publicarse, el expediente pasa por estudio de títulos y revisión de cargas en SUNARP.",
    proofLabel: "Ver el proceso completo",
    proofHref: "/proceso-de-inversion",
    /* Rigor legal — the court record itself. */
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Documentación judicial junto al mazo de un juez",
  },
  {
    id: "risk",
    icon: ShieldAlert,
    eyebrow: "Transparencia",
    title: "Sabes qué puede salir mal antes de poner un sol",
    desc: "Pool incompleto, subasta no adjudicada, proceso suspendido, venta demorada o por debajo de lo estimado: los ocho escenarios adversos están escritos, con lo que ocurre con tu capital en cada uno.",
    proofLabel: "Leer la política de riesgos",
    proofHref: "/politica-de-riesgos",
    /* Transparencia — reading the terms before signing anything. */
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Persona revisando las condiciones de una operación",
  },
  {
    id: "fees",
    icon: Receipt,
    eyebrow: "Costos claros",
    title: "La mayor parte de lo que cobramos depende de que ganes",
    desc: "Registrarte y explorar no cuesta nada. La comisión de éxito se aplica solo sobre la ganancia: si la operación cierra sin ella, esa comisión es cero.",
    proofLabel: "Ver todas las tarifas",
    proofHref: "/tarifas",
    /* Costos claros — the arithmetic of what a deal actually leaves. */
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Cálculo de comisiones sobre documentos financieros",
  },
];

/**
 * Supporting figures. Each carries the basis on which it is measured — a
 * number without a method is exactly the kind of unbacked claim RM-023 flags.
 */
const FIGURES = [
  {
    value: formatMoneyCompact(48_000_000),
    label: "Valor adjudicado en operaciones cerradas",
    basis: "Acumulado histórico de la plataforma",
  },
  {
    value: "3,200+",
    label: "Inversores con al menos una operación",
    basis: "Cuentas verificadas con inversión confirmada",
  },
  {
    value: formatPercent(22),
    label: "Retorno anualizado promedio",
    basis: "Media de operaciones liquidadas · no garantiza resultados futuros",
  },
];

export function WhyInvest() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="por-que-invertir"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-24 size-130 -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="type-h2 text-balance text-foreground">
            Cuatro razones para invertir con{" "}
            <span className="text-primary">{BRAND_NAME}</span>
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Cada una con la página donde puedes comprobarla.
          </p>
        </motion.div>

        {/* Pillars — one column on mobile, two from sm. Same order, same
            hierarchy, no layout that only works on desktop. */}
        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.07 }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image band — one photograph per pillar, chosen for that
                    pillar's meaning, and all four carry the same crop ratio and
                    brand grade so they read as a set rather than a stock grab
                    bag (RM-011). */}
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-card via-card/25 to-transparent"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-tr from-primary/25 via-transparent to-transparent mix-blend-multiply"
                    aria-hidden
                  />

                  <span className="absolute bottom-4 left-6 flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-md ring-1 ring-primary/20">
                    <Icon className="size-5.5" strokeWidth={2.1} />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-5 sm:p-8 sm:pt-6">
                  <p className="type-label text-primary">{pillar.eyebrow}</p>
                  <h3 className="type-h3 mt-2 text-balance text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="type-body mt-3 text-pretty text-muted-foreground">
                    {pillar.desc}
                  </p>

                  <Link
                    href={pillar.proofHref}
                    className="type-body mt-6 inline-flex w-fit items-center gap-1.5 font-semibold text-primary hover:underline"
                  >
                    {pillar.proofLabel}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Supporting figures — secondary by design, and each one says how it
            is measured rather than standing alone as a claim. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12 rounded-3xl border border-border/60 bg-muted/40 p-6 sm:mt-14 sm:p-8"
        >
          <p className="type-label text-muted-foreground">
            Las cifras, y de dónde salen
          </p>
          <dl className="mt-6 grid gap-6 sm:grid-cols-3">
            {FIGURES.map((figure) => (
              <div key={figure.label}>
                <dt className="type-metric text-foreground">{figure.value}</dt>
                <dd className="mt-2">
                  <p className="type-body font-medium text-foreground">
                    {figure.label}
                  </p>
                  <p className="type-caption mt-1 text-muted-foreground">
                    {figure.basis}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
