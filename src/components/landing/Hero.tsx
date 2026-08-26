"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Gavel, MapPin, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney, formatPercent } from "@/lib/currency";
import { LANDING_HERO_VIDEO_SRC } from "@/lib/landing/media";

/**
 * Hero — audit findings RM-001, RM-004, RM-009, RM-014, RM-034, RM-035, RM-037.
 *
 * The previous first screen carried a value proposition, two CTAs, three trust
 * chips, a live auction card with eight figures and three floating pills. The
 * audit rated it critical: nothing told the user what to read or do first.
 *
 * The hierarchy is now fixed and deliberate:
 *   1. what this is + from how much  (headline)
 *   2. the single next action        (one primary CTA)
 *   3. one piece of verifiable proof (the expediente on the auction card)
 * Everything else moved to /proceso-de-inversion, /nosotros and the sections
 * below. The synthetic "investor feed" and countdown timer were removed
 * outright — manufactured urgency is the opposite of the trust this audience
 * needs (RM-023).
 */

const FEATURED = {
  title: "Penthouse en Miraflores",
  address: "Calle Berlín 847 · 195 m²",
  image:
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=450&fit=crop&auto=format",
  basePrice: 280_000,
  minTicket: 500,
  roi: 22,
  funded: 67,
  closesIn: "Cierra en 6 días",
  expediente: "2023-1847-LIMA",
  court: "3er Juzgado Civil de Lima",
};

export function Hero() {
  /* Funding progress fills once on load — the only motion left on the card. */
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 100], ["0%", "100%"]);
  useEffect(() => {
    const controls = animate(progress, FEATURED.funded, {
      duration: 1.6,
      delay: 0.8,
      ease: "easeOut",
    });
    return controls.stop;
  }, [progress]);

  return (
    <section
      data-nav-tone="light"
      className="relative flex min-h-svh items-center overflow-hidden pt-16"
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

      <div className="relative mx-auto w-full max-w-[1400px] section-padding py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ═══════════ LEFT — the message and the one action ═══════════ */}
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
              {BRAND_NAME} reúne a varios inversores para adquirir propiedades
              adjudicadas por el Poder Judicial, gestionar su venta y repartir
              el resultado entre todos.
            </motion.p>

            {/* One primary action. The second is a low-emphasis link, not a
                competing button (RM-014). */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
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
            </motion.div>

            {/* Friction remover + the risk statement, side by side and stated
                up front rather than buried in the footer (RM-018, RM-022). */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-col gap-1.5"
            >
              <p className="type-caption text-muted-foreground">
                Crear tu cuenta es gratis y no te obliga a invertir.
              </p>
              <p className="type-caption text-muted-foreground">
                Toda inversión conlleva riesgo de pérdida y los plazos dependen
                del proceso judicial.{" "}
                <Link
                  href="/politica-de-riesgos"
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Conoce los riesgos
                </Link>
                .
              </p>
            </motion.div>
          </div>

          {/* ═══════════ RIGHT — one opportunity, five facts ═══════════
              Mobile keeps only what a decision needs: what it is, where it is,
              how far along it is. Price, ROI and expediente appear from `sm`
              upward, where there is room to read them (RM-034). */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <article className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-foreground/10">
              <div className="relative h-44 overflow-hidden sm:h-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FEATURED.image}
                  alt={FEATURED.title}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                <span className="type-label absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-foreground backdrop-blur-sm">
                  Subasta abierta
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="type-h3 text-white drop-shadow">
                    {FEATURED.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 type-caption text-white/80">
                    <MapPin className="size-3 shrink-0" />
                    {FEATURED.address}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5">
                {/* Funding progress — the one figure that matters on any screen */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="type-caption text-muted-foreground">
                      Participación cubierta
                    </span>
                    <span className="type-body font-bold text-primary">
                      {formatPercent(FEATURED.funded)}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      style={{ width: progressWidth }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 type-caption text-muted-foreground">
                    <CalendarClock className="size-3.5 shrink-0" />
                    {FEATURED.closesIn}
                  </p>
                </div>

                {/* Secondary figures — desktop and tablet only */}
                <dl className="hidden grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid">
                  <div className="bg-muted px-3 py-3">
                    <dt className="type-caption text-muted-foreground">
                      Precio base
                    </dt>
                    <dd className="mt-0.5 type-body font-semibold text-foreground">
                      {formatMoney(FEATURED.basePrice)}
                    </dd>
                  </div>
                  <div className="bg-muted px-3 py-3">
                    <dt className="type-caption text-muted-foreground">
                      Retorno estimado
                    </dt>
                    <dd className="mt-0.5 type-body font-semibold text-foreground">
                      {formatPercent(FEATURED.roi)} anual
                      <span className="block type-caption font-normal text-muted-foreground">
                        referencial, no garantizado
                      </span>
                    </dd>
                  </div>
                </dl>

                {/* The verifiable proof: a real court record anyone can check
                    against the Poder Judicial (RM-023). */}
                <p className="hidden items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5 type-caption text-foreground/80 sm:flex">
                  <Gavel className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <span>
                    Exp. N° <strong className="text-foreground">
                      {FEATURED.expediente}
                    </strong>{" "}
                    · {FEATURED.court}
                  </span>
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full rounded-xl border-primary/40 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Link href="#propiedades">Ver subastas abiertas</Link>
                </Button>
              </div>
            </article>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
