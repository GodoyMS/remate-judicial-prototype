"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoneyCompact, formatPercent } from "@/lib/currency";
import { cn } from "@/lib/utils";

type PillarIconProps = {
  className?: string;
};

function AccesoIcon({ className }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <ellipse cx="24" cy="34" rx="14" ry="4" />
      <ellipse cx="24" cy="28" rx="14" ry="4" />
      <ellipse cx="24" cy="22" rx="14" ry="4" />
      <circle cx="24" cy="16" r="8" />
      <rect x="21" y="14.5" width="6" height="5" rx="1" />
      <path d="M24 17.5v2" />
    </svg>
  );
}

function GestionIcon({ className }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M8 14h20l4 4v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z" />
      <path d="M28 14v4h4" />
      <path d="M14 24h12M14 29h8" />
      <path d="M34 30l4 4M38 30l-4 4" />
      <path d="M30 34h8v6" />
    </svg>
  );
}

function DiversificacionIcon({ className }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="24" cy="12" r="5" />
      <circle cx="12" cy="36" r="5" />
      <circle cx="24" cy="36" r="5" />
      <circle cx="36" cy="36" r="5" />
      <path d="M24 17v8M24 25l-9 6M24 25l9 6" />
    </svg>
  );
}

function SeguimientoIcon({ className }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="6" y="10" width="36" height="28" rx="3" />
      <path d="M6 18h36" />
      <circle cx="6" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" />
      <path d="M12 30h24" />
      <circle cx="16" cy="30" r="3" />
      <circle cx="28" cy="30" r="3" />
      <circle cx="40" cy="30" r="3" />
    </svg>
  );
}

type Pillar = {
  id: string;
  Icon: React.ComponentType<PillarIconProps>;
  eyebrow: string;
  title: string;
  desc: string;
};

const PILLARS: Pillar[] = [
  {
    id: "access",
    Icon: AccesoIcon,
    eyebrow: "Acceso",
    title: "Accede sin necesitar el capital completo de una propiedad",
    desc: "Participa desde el monto mínimo definido para cada oportunidad.",
  },
  {
    id: "managed",
    Icon: GestionIcon,
    eyebrow: "Gestión",
    title: "No enfrentas solo el proceso judicial",
    desc: `${BRAND_NAME} analiza la oportunidad y gestiona las etapas que correspondan hasta la liquidación.`,
  },
  {
    id: "spread",
    Icon: DiversificacionIcon,
    eyebrow: "Diversificación",
    title: "Distribuye tu capital entre distintas oportunidades",
    desc: "Puedes participar en más de una operación en lugar de concentrarte necesariamente en un solo inmueble.",
  },
  {
    id: "tracking",
    Icon: SeguimientoIcon,
    eyebrow: "Seguimiento",
    title: "Sigue tu inversión de principio a fin",
    desc: "Consulta estados, documentos, hitos y resultados desde tu cuenta.",
  },
];

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

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.Icon;
            return (
              <motion.article
                key={pillar.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : i * 0.07,
                }}
                className={cn(
                  "flex items-start gap-5 rounded-2xl border border-border/70",
                  "bg-card p-5 sm:gap-6 sm:p-6"
                )}
              >
                <Icon className="size-14 shrink-0 text-primary sm:size-16" />

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="type-label uppercase tracking-wide text-primary">
                    {pillar.eyebrow}
                  </p>
                  <h3 className="type-h3 mt-2 text-balance text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="type-body mt-2 text-pretty text-muted-foreground">
                    {pillar.desc}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12  py-5 sm:mt-14 sm:py-6"
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
