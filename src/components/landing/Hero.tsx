"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Gavel, MapPin, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney, formatPercent } from "@/lib/currency";
import { LANDING_HERO_VIDEO_SRC } from "@/lib/landing/media";
import { openOpportunities } from "@/lib/landing/opportunities";

/**
 * Hero — second review, findings 2, 15, 16 and 44.
 *
 * · 15 — the first screen carried six competing first-level elements. It now
 *   reads in three deliberate levels: (1) headline + what the model is,
 *   (2) one primary action with a low-emphasis secondary, (3) one opportunity
 *   shown explicitly as a demonstration. The "crear tu cuenta es gratis"
 *   line became a caption under the CTA, and the risk statement moved out of
 *   the reading column into the secondary strip that closes the section.
 * · 2 — the model description said the platform "adquiere propiedades
 *   adjudicadas", which put the investor after the adjudication rather than
 *   before it, and read as if adjudicated stock already existed. The copy now
 *   states the actual sequence: capital first, adjudication conditional,
 *   management and liquidation after.
 * · 16 — the card gave seven figures the same weight. Header = status and
 *   property, body = price and estimated return (the only two figures with
 *   high hierarchy), footer = funding covered and closing date.
 * · 44 — "gratis · sin obligación de invertir" survives here and in the
 *   closing CTA only; every other section now carries a contextual message.
 */

const FEATURED = openOpportunities()[0]!;

export function Hero() {
  /* Funding progress fills once on load — the only motion left on the card. */
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 100], ["0%", "100%"]);
  useEffect(() => {
    const controls = animate(progress, FEATURED.fundedPct, {
      duration: 1.6,
      delay: 0.8,
      ease: "easeOut",
    });
    return controls.stop;
  }, [progress]);

  return (
    <section
      data-nav-tone="light"
      className="relative flex min-h-svh flex-col overflow-hidden pt-16"
    >
      {/* ── Video background ── */}
      <video
        className="absolute inset-0 size-full object-cover pointer-events-none"
        src={LANDING_HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none bg-background/85 dark:bg-background/80"
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none bg-linear-to-b from-background/40 via-transparent to-background/70"
        aria-hidden
      />

      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-[1400px] section-padding py-14 sm:py-18 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* ═══════ LEVEL 1 & 2 — the message and the one action ═══════ */}
            <div className="flex flex-col gap-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="type-display max-w-xl text-balance text-foreground"
              >
                Invierte en inmuebles en{" "}
                <span className="text-primary">remate judicial</span> desde{" "}
                <span className="whitespace-nowrap text-primary">
                  {formatMoney(FEATURED.minTicket)}
                </span>
                .
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="type-lead max-w-lg text-pretty text-muted-foreground"
              >
                {BRAND_NAME} reúne a varios inversionistas para participar
                colectivamente en oportunidades de remate judicial. Si la
                operación completa el capital y obtiene la adjudicación,{" "}
                {BRAND_NAME} gestiona el inmueble hasta su posterior venta y
                liquidación del resultado.
              </motion.p>

              {/* One primary action; the second is a link, not a rival button. */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    asChild
                    className="group h-13 w-full rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-xl shadow-primary/25 hover:bg-primary/90 sm:w-auto"
                  >
                    <Link href="/register">
                      Crear cuenta gratis
                      <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Link
                    href="#como-funciona"
                    className="type-body font-semibold text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
                  >
                    Ver cómo funciona
                  </Link>
                </div>

                {/* Caption, not a third message block (finding 15). */}
                <p className="type-caption text-muted-foreground">
                  Crear tu cuenta es gratis y no te obliga a invertir.
                </p>
              </motion.div>
            </div>

            {/* ═══════════ LEVEL 3 — one opportunity, as a demonstration ═══════════ */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <p className="type-label mb-3 text-muted-foreground">
                Ejemplo de oportunidad
              </p>

              <article className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-foreground/10">
                {/* Header — status + which property it is */}
                <div className="relative h-40 overflow-hidden sm:h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FEATURED.image}
                    alt={FEATURED.name}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                  <span className="type-label absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-foreground backdrop-blur-sm">
                    {FEATURED.statusLabel}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="type-h3 text-white drop-shadow">
                      {FEATURED.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 type-caption text-white/80">
                      <MapPin className="size-3 shrink-0" />
                      {FEATURED.address} · {FEATURED.area}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5">
                  {/* Body — the two figures with high hierarchy, and only these */}
                  <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                    <div className="bg-muted px-4 py-3.5">
                      <dt className="type-caption text-muted-foreground">
                        Precio base
                      </dt>
                      <dd className="mt-1 text-xl font-black tracking-tight tabular-nums text-foreground sm:text-2xl">
                        {formatMoney(FEATURED.basePrice, FEATURED.currency)}
                      </dd>
                    </div>
                    <div className="bg-muted px-4 py-3.5">
                      <dt className="type-caption text-muted-foreground">
                        Retorno estimado
                      </dt>
                      <dd className="mt-1 text-xl font-black tracking-tight tabular-nums text-primary sm:text-2xl">
                        {formatPercent(FEATURED.roi)}
                        <span className="text-base font-bold"> anual</span>
                      </dd>
                      <dd className="type-caption font-normal text-muted-foreground">
                        referencial, no garantizado
                      </dd>
                    </div>
                  </dl>

                  {/* Footer — progress and date, deliberately low contrast */}
                  <div>
                    <div className="flex items-baseline justify-between type-caption text-muted-foreground">
                      <span>Financiamiento cubierto</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {formatPercent(FEATURED.fundedPct)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        style={{ width: progressWidth }}
                        className="h-full rounded-full bg-primary/70"
                      />
                    </div>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 type-caption text-muted-foreground">
                      <span>Cierra en {FEATURED.deadline}</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Gavel className="size-3 shrink-0 text-primary" />
                        Exp. N° {FEATURED.expediente}
                      </span>
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full rounded-xl border-primary/40 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Link href={`/propiedades/${FEATURED.slug}`}>
                      Ver esta oportunidad
                    </Link>
                  </Button>
                </div>
              </article>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Secondary strip — the risk statement, out of the reading column
             but still above the fold (finding 15). ── */}
      <div className="relative border-t border-border/60 bg-muted/60 backdrop-blur-sm">
        <div className="mx-auto max-w-[1400px] section-padding py-3.5">
          <p className="flex items-start justify-center gap-2 type-caption text-pretty text-center text-muted-foreground">
            <ShieldAlert className="mt-px size-3.5 shrink-0 text-primary" />
            <span>
              Toda inversión conlleva riesgo de pérdida y los plazos dependen
              del proceso judicial.{" "}
              <Link
                href="/politica-de-riesgos"
                className="font-semibold text-foreground underline underline-offset-2 hover:text-primary"
              >
                Conoce los riesgos
              </Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
