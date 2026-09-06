"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  LayoutGrid,
  LineChart,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney, formatMoneyCompact, formatPercent } from "@/lib/currency";

/**
 * "¿Por qué invertir?" — second review, findings 18, 19, 35, 38 and 44.
 *
 * · 18 — the four reasons were platform attributes (rigour, transparency,
 *   clear costs) rather than things the reader gets. Each pillar now names a
 *   concrete benefit and what it replaces: capital, judicial process,
 *   concentration and visibility. Transparency, costs and risk stay as trust
 *   arguments, but in the sections that actually prove them — the verification
 *   carousel, /tarifas and /politica-de-riesgos.
 * · 19 — "la mayor parte de lo que cobramos depende de que ganes" was not
 *   supported by the published fee schedule (a structuring fee and an annual
 *   management fee are charged regardless). The aligned-interests claim now
 *   lives in the costs card of the verification section, worded to match what
 *   /tarifas actually says.
 * · 38 — the low ticket is argued as portfolio capability, not just as a low
 *   barrier: it lets capital be spread across operations.
 * · 35 — each supporting figure is its own container: number → metric name →
 *   how it is measured, so no number floats free of its definition.
 * · 44 — the pillar links are contextual value ("Explora las oportunidades",
 *   "Revisa el proceso completo") instead of another "crear cuenta gratis".
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
    title: `Accede sin necesitar el capital completo de una propiedad`,
    desc: `Postular a un remate por tu cuenta exige el precio íntegro del inmueble en pocos días hábiles. Con ${BRAND_NAME} participas desde el mínimo de cada oportunidad: ${formatMoney(500)} en las que abren en soles. Y no necesitas concentrar todo tu capital en una sola propiedad: puedes distribuirlo entre diferentes oportunidades, sujeto al mínimo y disponibilidad de cada una.`,
    proofLabel: "Por qué no ir directo al remate",
    proofHref: "/nosotros#por-que-rematto",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Edificio residencial en una zona urbana consolidada",
  },
  {
    id: "managed",
    icon: Scale,
    eyebrow: "Gestión",
    title: "No enfrentas solo el proceso judicial",
    desc: `${BRAND_NAME} analiza la oportunidad antes de publicarla —expediente, cargas registrales y estado de ocupación— y gestiona las etapas que correspondan: participación en el remate, inscripción, posesión, venta y liquidación del resultado.`,
    proofLabel: "Revisa el proceso completo",
    proofHref: "/proceso-de-inversion",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Documentación judicial junto al mazo de un juez",
  },
  {
    id: "spread",
    icon: LayoutGrid,
    eyebrow: "Distribución",
    title: "Distribuye tu capital entre distintas oportunidades",
    desc: "Puedes participar en más de una operación en lugar de concentrarte necesariamente en un solo inmueble. Cada operación tiene su propio expediente, su propio plazo y su propio resultado, independiente del de las demás.",
    proofLabel: "Explora las oportunidades",
    proofHref: "/propiedades",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Distintos inmuebles residenciales de una misma cartera",
  },
  {
    id: "tracking",
    icon: LineChart,
    eyebrow: "Seguimiento",
    title: "Sigues tu inversión de principio a fin",
    desc: "Desde tu cuenta consultas el estado de cada operación, los documentos que respaldan tu participación, los hitos del proceso judicial y el resultado cuando se liquida. Sin llamadas ni correos para saber en qué va.",
    proofLabel: "Ver qué gestiona el equipo por ti",
    proofHref: "#gestion",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Seguimiento de una operación desde el panel del inversionista",
  },
];

/**
 * Supporting figures — number, what it measures, and on what basis. A figure
 * without its method is exactly the unbacked claim the first audit flagged.
 */
const FIGURES = [
  {
    value: formatMoneyCompact(48_000_000),
    label: "Valor adjudicado en operaciones cerradas",
    basis: "Acumulado histórico de la plataforma desde 2021",
  },
  {
    value: "3,200+",
    label: "Inversionistas con al menos una operación",
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
            Lo que obtienes gracias a la plataforma, y dónde puedes comprobarlo.
          </p>
        </motion.div>

        {/* Pillars — one column on mobile, two from sm. */}
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

        {/* Supporting figures — one container each (finding 35). */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12 rounded-3xl border border-border/60 bg-muted/40 p-5 sm:mt-14 sm:p-6"
        >
          <p className="type-label px-1 text-muted-foreground">
            Las cifras, y de dónde salen
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            {FIGURES.map((figure) => (
              <div
                key={figure.label}
                className="flex flex-col rounded-2xl border border-border/70 bg-card p-5"
              >
                <dt className="type-metric text-foreground">{figure.value}</dt>
                <dd className="mt-2 flex flex-1 flex-col">
                  <p className="type-body font-semibold text-foreground">
                    {figure.label}
                  </p>
                  <p className="type-caption mt-2 border-t border-border/60 pt-2 text-muted-foreground">
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
