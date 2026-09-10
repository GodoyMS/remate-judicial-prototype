"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  Layers,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { LANDING_PHOTOS } from "@/lib/landing/media";

const CHANGES: { icon: LucideIcon; text: string }[] = [
  {
    icon: Banknote,
    text: "Participas desde S/ 500 junto a otros inversores.",
  },
  {
    icon: BadgeCheck,
    text: "Auditamos cada expediente antes de publicarlo.",
  },
  {
    icon: Layers,
    text: "Diversificas el mismo capital en varias operaciones.",
  },
  {
    icon: Wrench,
    text: "Gestionamos el inmueble hasta la liquidación.",
  },
];

export function AnotherWay() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="por-que-rematto"
      data-nav-tone="light"
      className="relative overflow-hidden bg-muted/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] sm:min-h-[440px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LANDING_PHOTOS.anotherWay}
              alt="Espacio de trabajo donde se analiza una operación inmobiliaria"
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-foreground/50 via-transparent to-transparent"
              aria-hidden
            />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08 }}
          >
            <h2 className="type-h2 text-balance text-foreground">
              ¿Y si este proceso pudiera hacerse de otra manera?
            </h2>
            <p className="mt-4 max-w-[54ch] type-lead text-pretty text-muted-foreground">
              Creamos {BRAND_NAME} para derribar esas barreras y convertir los
              remates en una oportunidad real, transparente y accesible para
              más personas.
            </p>

            <p className="type-label mt-8 text-primary">
              Qué cambia con {BRAND_NAME}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {CHANGES.map((change) => {
                const Icon = change.icon;
                return (
                  <li
                    key={change.text}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" strokeWidth={2.1} />
                    </span>
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {change.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
