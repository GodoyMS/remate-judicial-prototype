"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_PHOTOS } from "@/lib/landing/media";

const BADGES = ["Más personas", "Más oportunidades", "Un mejor mercado"];

export function ForYouCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-nav-tone="light"
      className="relative overflow-hidden bg-muted/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid overflow-hidden rounded-[1.75rem] border border-border/70 bg-card lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
        >
          <div className="relative min-h-[280px] sm:min-h-[360px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LANDING_PHOTOS.forYou}
              alt="Fachada de una vivienda contemporánea en un barrio residencial"
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h2 className="type-h2 mt-5 text-balance text-foreground">
              Invertir en remates también puede ser para ti
            </h2>
            <p className="mt-4 max-w-[48ch] type-lead text-pretty text-muted-foreground">
              Desde que abrimos una operación hasta que el dinero vuelve a tu
              cuenta, etapa por etapa y con plazos reales.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="h-13 rounded-full px-8 font-bold"
              >
                <Link href="/proceso-de-inversion">
                  Ver el proceso de inversión
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-13 rounded-full px-8 font-semibold"
              >
                <Link href="/politica-de-riesgos">Leer la política de riesgos</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
