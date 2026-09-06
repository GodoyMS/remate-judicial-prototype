"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, ShieldAlert, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunityCard } from "@/components/landing/OpportunityCard";
import {
  openOpportunities,
  upcomingOpportunities,
} from "@/lib/landing/opportunities";
import { cn } from "@/lib/utils";

/**
 * "Subastas abiertas ahora" — second review, findings 6, 7, 14 and 44.
 *
 * · 7 — the grid was titled "abiertas ahora" and included an operation the
 *   same card labelled "Próximo". Open and upcoming are now two separate
 *   blocks fed by two separate queries, so the section can never contradict
 *   its own heading again.
 * · 14 — the card carried a rationale paragraph, a worked "si inviertes
 *   S/ 500" example, two metric tiles, a court-record line and a CTA: too
 *   many layers to compare three properties at a glance. It is now a summary
 *   card — image, status, name and location, three metrics, closing date,
 *   one CTA — and everything else moved to the property page.
 * · 6 — "Ver esta oportunidad" resolves to the opportunity the reader
 *   clicked, on a public page, instead of sending everyone to /register.
 * · 44 — risk lives in its own closing container rather than being repeated
 *   inside every card.
 */

export function PropertyPreview() {
  const open = openOpportunities().slice(0, 3);
  const upcoming = upcomingOpportunities().slice(0, 3);

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
                Disponibles ahora
              </span>
            </div>
            <h2 className="type-h2 text-balance">
              Subastas abiertas <span className="text-primary">ahora</span>
            </h2>
            <p className="type-lead text-muted-foreground">
              Operaciones que están reuniendo capital en este momento. Puedes
              abrir el detalle completo de cualquiera de ellas sin crear una
              cuenta.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="h-11 shrink-0 rounded-full border-primary/40 bg-transparent px-6 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/propiedades">
              Ver todas las propiedades
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {open.map((o, i) => (
            <OpportunityCard key={o.id} opportunity={o} index={i} />
          ))}
        </div>

        {/* ── Próximamente — announced, not open. Never mixed above. ── */}
        {upcoming.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-8 rounded-3xl border border-border/60 bg-card p-5 sm:mt-10 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-muted-foreground" />
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  Próximamente
                </h3>
              </div>
              <p className="type-caption text-muted-foreground">
                Aún no aceptan aportes. Las cuentas Premium las ven antes de su
                apertura.
              </p>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/propiedades/${o.slug}`}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3 transition-colors",
                      "hover:border-primary/30 hover:bg-muted"
                    )}
                  >
                    <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={o.image}
                        alt=""
                        className="size-full object-cover opacity-80"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {o.name}
                      </span>
                      <span className="block truncate type-caption text-muted-foreground">
                        {o.district} · abre en {o.deadline}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ── Risk, once, after the opportunities (finding 14) ── */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-8 flex flex-col items-start gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-7"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-card text-primary ring-1 ring-primary/20">
              <ShieldAlert className="size-5" />
            </span>
            <div>
              <h3 className="type-h3 text-balance text-foreground">
                Toda decisión tiene un riesgo
              </h3>
              <p className="mt-1.5 type-body text-pretty text-muted-foreground">
                Los retornos son estimaciones referenciales y los plazos
                dependen de procesos judiciales. Antes de aportar, revisa qué
                puede salir mal y qué ocurre con tu capital en cada caso.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-11 shrink-0 rounded-full border-primary/40 bg-card px-6 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/politica-de-riesgos">
              Conoce los riesgos
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </motion.aside>
      </div>
    </section>
  );
}
