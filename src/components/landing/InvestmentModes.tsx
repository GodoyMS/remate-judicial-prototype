"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Crown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * "Dos formas de invertir" — second review, finding 29.
 *
 * The public landing presented only the collective mode, so the Premium mode
 * appeared for the first time inside the product, after registering. Both are
 * stated here, and Premium is differentiated by how you participate and what
 * it requires — not by a higher advertised return, which would turn an access
 * tier into a yield promise.
 */

const MODES = [
  {
    id: "estandar",
    icon: Users,
    eyebrow: "Estándar",
    title: "Participas colectivamente",
    desc: `Aportas desde el mínimo de cada oportunidad y el capital se reúne entre varios inversionistas. Es la modalidad abierta a cualquier cuenta verificada.`,
    points: [
      `Desde ${formatMoney(500)} por operación, según el mínimo de cada una`,
      "Puedes participar en varias operaciones a la vez",
      "Cuenta verificada (DNI o carné de extranjería) y nada más",
    ],
    ctaLabel: "Ver oportunidades abiertas",
    ctaHref: "/propiedades",
    featured: false,
  },
  {
    id: "premium",
    icon: Crown,
    eyebrow: "Premium",
    title: "Accedes individualmente a la operación completa",
    desc: "Tomas el 100% del capital requerido de una oportunidad Premium, sin compartirla con otros inversionistas y con acompañamiento dedicado durante todo el ciclo.",
    points: [
      "Capacidad de cubrir el total del capital de la operación",
      "Verificación reforzada y declaración de origen de fondos",
      "Ventana de decisión acotada antes de que la operación se abra al capital colectivo",
    ],
    ctaLabel: "Conocer Premium",
    ctaHref: "/premium",
    featured: true,
  },
] as const;

export function InvestmentModes() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="formas-de-invertir"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="type-h2 text-balance text-foreground">
            Dos formas de invertir con{" "}
            <span className="text-primary">{BRAND_NAME}</span>
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            La diferencia está en cómo participas y qué requiere cada
            modalidad, no en el retorno que se promete.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
          {MODES.map((mode, i) => {
            const Icon = mode.icon;
            return (
              <motion.article
                key={mode.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : i * 0.07,
                }}
                className={cn(
                  "flex flex-col rounded-3xl border p-6 sm:p-7",
                  mode.featured
                    ? "border-primary/30 bg-primary/5 ring-1 ring-primary/15"
                    : "border-border/70 bg-card"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      mode.featured
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-primary"
                    )}
                  >
                    <Icon className="size-5" strokeWidth={2.1} />
                  </span>
                  <p className="type-label text-primary">{mode.eyebrow}</p>
                </div>

                <h3 className="type-h3 mt-4 text-balance text-foreground">
                  {mode.title}
                </h3>
                <p className="mt-2.5 type-body text-pretty text-muted-foreground">
                  {mode.desc}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {mode.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-sm leading-relaxed text-foreground/80">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={mode.featured ? "default" : "outline"}
                  className={cn(
                    "mt-6 h-11 rounded-full font-semibold",
                    !mode.featured && "border-primary/35 text-primary hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Link href={mode.ctaHref}>
                    {mode.ctaLabel}
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
