"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Clock3, Gavel, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney, formatPercent } from "@/lib/currency";
import { LANDING_HERO_BG_SRC } from "@/lib/landing/media";
import {
  SAMPLE_TICKET,
  landingOpportunities,
} from "@/lib/landing/opportunities";

const FEATURED =
  landingOpportunities.find((o) => o.slug === "penthouse-en-miraflores") ??
  landingOpportunities[0]!;

export function Hero() {
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
      {/* Faint architectural background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LANDING_HERO_BG_SRC}
          alt=""
          className="size-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-linear-to-br from-background via-background/95 to-primary/5" />
      </div>

      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-[1400px] section-padding py-14 sm:py-18 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left — headline, model, access note, CTAs */}
            <div className="flex flex-col gap-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="type-display max-w-xl text-balance text-foreground"
              >
                Invierte en inmuebles en{" "}
                <span className="text-primary">
                  remate judicial desde {formatMoney(SAMPLE_TICKET)}.
                </span>
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

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="max-w-lg rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4"
              >
                <p className="type-label text-primary">Acceso</p>
                <p className="mt-1.5 type-body text-pretty text-muted-foreground">
                  No necesitas concentrar todo tu capital en una sola propiedad:
                  puedes distribuirlo entre diferentes oportunidades, sujeto al
                  mínimo y disponibilidad de cada una.
                </p>
              </motion.div>

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

                <p className="type-caption text-pretty text-muted-foreground">
                  Crear tu cuenta es gratis y no te obliga a invertir. Toda
                  inversión conlleva riesgo —{" "}
                  <Link
                    href="/politica-de-riesgos"
                    className="font-semibold text-foreground underline underline-offset-2 hover:text-primary"
                  >
                    conoce los riesgos
                  </Link>{" "}
                  antes de aportar.
                </p>
              </motion.div>
            </div>

            {/* Right — featured opportunity card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <article className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-foreground/10">
                <div className="relative h-44 overflow-hidden sm:h-52">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FEATURED.image}
                    alt={FEATURED.name}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                  <span className="type-label absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1.5 uppercase tracking-wide text-foreground backdrop-blur-sm">
                    {FEATURED.statusLabel}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="type-h3 text-white drop-shadow">
                      {FEATURED.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 type-caption text-white/85">
                      <MapPin className="size-3 shrink-0" />
                      {FEATURED.address.split(",")[0]} · {FEATURED.area}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5">
                  <div>
                    <div className="flex items-baseline justify-between type-caption text-muted-foreground">
                      <span>Participación cubierta</span>
                      <span className="text-base font-bold tabular-nums text-primary">
                        {formatPercent(FEATURED.fundedPct)}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        style={{ width: progressWidth }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 type-caption text-muted-foreground">
                      <Clock3 className="size-3.5 shrink-0 text-primary" />
                      Cierra en {FEATURED.deadline}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                    <div className="bg-muted/80 px-4 py-3.5">
                      <dt className="type-caption text-muted-foreground">
                        Precio base
                      </dt>
                      <dd className="mt-1 text-xl font-black tracking-tight tabular-nums text-foreground sm:text-2xl">
                        {formatMoney(FEATURED.basePrice, FEATURED.currency)}
                      </dd>
                    </div>
                    <div className="bg-muted/80 px-4 py-3.5">
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

                  <div className="flex items-start gap-2 rounded-2xl bg-primary/8 px-4 py-3 ring-1 ring-primary/15">
                    <Gavel className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p className="type-caption text-pretty text-muted-foreground">
                      Exp. N°{" "}
                      <span className="font-semibold text-foreground">
                        {FEATURED.expediente}
                      </span>{" "}
                      · {FEATURED.court}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-full border-primary/50 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Link href="/propiedades">Ver subastas abiertas</Link>
                  </Button>
                </div>
              </article>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
