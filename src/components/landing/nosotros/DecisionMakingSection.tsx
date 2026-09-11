"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  HandCoins,
  Scale,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
const PRINCIPLES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldAlert,
    title: "Antes del optimismo, el riesgo",
    description:
      "Evaluamos cada oportunidad con criterio técnico y un enfoque conservador",
  },
  {
    icon: Scale,
    title: "Cifras con origen verificable",
    description:
      "Toda la información proviene de fuentes oficiales y puede ser comprobada por ti",
  },
  {
    icon: HandCoins,
    title: "Nuestro margen depende del tuyo",
    description:
      "Solo ganamos si el proyecto genera valor para los inversionistas",
  },
];

export function DecisionMakingSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-nav-tone="light"
      className="relative overflow-hidden bg-muted/40 py-16 sm:py-20 lg:py-24 scroll-mt-24"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-primary/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="type-h2 text-balance text-foreground">
            Cómo tomamos decisiones
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Tres criterios que guían cada operación antes de publicarla en la
            plataforma.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3">
          {PRINCIPLES.map((principle, i) => {
            const Icon = principle.icon;
            return (
              <motion.article
                key={principle.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="marketing-card-shell h-full transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/25"
              >
                <div className="marketing-card-inner flex h-full flex-col p-6 shadow-sm">
                  <span
                    className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15"
                    aria-hidden
                  >
                    <Icon className="size-5.5" strokeWidth={2.1} />
                  </span>
                  <h3 className="type-h3 mt-5 text-balance text-foreground">
                    {principle.title}
                  </h3>
                  <p className="mt-2 flex-1 type-body text-pretty text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
