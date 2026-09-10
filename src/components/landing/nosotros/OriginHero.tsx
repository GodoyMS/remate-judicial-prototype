"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BRAND_NAME } from "@/lib/brand";
import { LANDING_PHOTOS } from "@/lib/landing/media";

export function OriginHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-nav-tone="dark"
      className="relative isolate min-h-[100dvh] overflow-hidden bg-foreground text-background"
    >
      <div className="absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LANDING_PHOTOS.originHero}
          alt=""
          className="size-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-foreground/55" />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/45 to-foreground/25" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 50%, color-mix(in oklch, var(--brand) 22%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center section-padding pt-28 pb-24 lg:pt-36 lg:pb-28">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="type-label text-primary">Por qué existe {BRAND_NAME}</p>
            <h1 className="type-display mt-4 max-w-[16ch] text-balance text-background">
              Invertimos hoy en las historias del mañana
            </h1>
            <p className="mt-6 max-w-[54ch] type-lead text-pretty text-background/75">
              {BRAND_NAME} nace para abrir el acceso a las inversiones
              inmobiliarias en remates judiciales. Combinamos conocimiento,
              tecnología y un equipo experto que te acompaña en todo el
              proceso.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-background/20 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/55">
              Lo que hacemos posible
            </p>
            <p className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-background sm:text-4xl">
              Activos reales
            </p>
            <p className="mt-2 text-3xl font-bold leading-[1.15] tracking-tight text-primary sm:text-4xl">
              más personas
            </p>
            <p className="mt-2 text-3xl font-bold leading-[1.15] tracking-tight text-background/80 sm:text-4xl">
              más historias
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function OriginBanner() {
  return (
    <div
      data-nav-tone="dark"
      className="bg-primary px-6 py-5 text-center text-primary-foreground sm:py-6"
    >
      <p className="text-pretty text-base font-semibold tracking-tight sm:text-lg">
        Un mercado real, más personas, más oportunidades
      </p>
    </div>
  );
}
