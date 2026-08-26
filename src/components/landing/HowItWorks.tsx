"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Search,
  UserCheck,
  Banknote,
  Trophy,
  ArrowRight,
  Clock3,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = {
  icon: LucideIcon;
  step: string;
  action: string;
  duration: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
};

/**
 * Audit findings RM-004, RM-007 and RM-029.
 *
 * · RM-007 — the copy leaned on terms this audience may be meeting for the
 *   first time (KYC, pool, adjudicación, retorno). Each step now leads in
 *   everyday language and names the technical term only afterwards, so the
 *   vocabulary is available without being a prerequisite.
 * · RM-004 — the section promised "tu primera inversión en menos de 10
 *   minutos" while the compliance page states verification takes up to 24
 *   business hours. The durations below are what each step actually takes.
 * · RM-029 — step 4 used to jump straight from paying to collecting, hiding
 *   the months of judicial process in between. It now says so, and links to
 *   the stage-by-stage breakdown.
 */
const STEPS: Step[] = [
  {
    icon: UserCheck,
    step: "01",
    action: "Regístrate",
    duration: "5 minutos",
    title: "Crea tu cuenta y confirma quién eres",
    desc: "Te registras con tu correo y subes una foto de tu DNI y una selfie. Es la verificación de identidad que exige la ley peruana a toda plataforma financiera (se le llama KYC).",
    image: "/images/how-it-works/step-01.jpg",
    imageAlt: "Persona creando su cuenta desde el laptop",
  },
  {
    icon: Search,
    step: "02",
    action: "Explora",
    duration: "Verificación: hasta 24 h hábiles",
    title: "Revisa las propiedades disponibles",
    desc: "Mientras aprobamos tu verificación, ya puedes mirar las subastas abiertas. Cada propiedad muestra su número de expediente judicial, su precio base y qué se estima obtener de ella.",
    image: "/images/how-it-works/step-02.jpg",
    imageAlt: "Propiedad moderna verificada lista para explorar",
  },
  {
    icon: Banknote,
    step: "03",
    action: "Invierte",
    duration: "2 minutos",
    title: "Eliges cuánto pones, desde S/ 500",
    desc: "Tu dinero se junta con el de otros inversores para llegar al monto que la subasta requiere. Hasta que ese monto se completa, tu aporte permanece en una cuenta aparte y puede devolverse.",
    image: "/images/how-it-works/step-03.jpg",
    imageAlt: "Pago móvil seguro para invertir en segundos",
  },
  {
    icon: Trophy,
    step: "04",
    action: "Esperas y cobras",
    duration: "Entre 12 y 24 meses",
    title: "El proceso judicial sigue su curso, y luego cobras",
    desc: "Aquí está la parte que toma tiempo: ganar la subasta, inscribir la propiedad, tomar posesión y venderla. Recién entonces se reparte el resultado. Puedes seguir cada etapa desde tu panel.",
    image: "/images/how-it-works/step-04.jpg",
    imageAlt: "Crecimiento de retornos sobre la inversión",
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = STEPS[active];
  const Icon = current.icon;

  return (
    <section
      id="como-funciona"
      data-nav-tone="light"
      className="relative bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-350 section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.75rem] bg-primary/8 sm:rounded-[2rem] lg:rounded-[2.25rem]"
        >
          {/* Soft primary wash */}
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-primary/5"
            aria-hidden
          />

          <div className="relative px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            {/* Header */}
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <h2 className="type-h2 text-balance text-foreground">
                Abrir tu cuenta toma minutos.{" "}
                <span className="text-primary">
                  La operación, meses.
                </span>
              </h2>
              <p className="mt-4 max-w-lg type-lead text-pretty text-muted-foreground">
                Cuatro pasos, en orden y con sus tiempos reales. Toca cada uno
                para ver el detalle.
              </p>
              <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-7 font-bold shadow-lg shadow-primary/20"
                >
                  <Link href="/register">
                    Crear cuenta gratis
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                <Link
                  href="/proceso-de-inversion"
                  className="type-body font-semibold text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
                >
                  Ver las 8 etapas en detalle
                </Link>
              </div>
            </div>

            {/* Interactive process */}
            <div className="mt-12 grid items-stretch gap-8 lg:mt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
              {/* Steps list */}
              <div
                className="flex flex-col justify-center gap-1"
                role="tablist"
                aria-label="Pasos del proceso"
              >
                {STEPS.map((step, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={step.step}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="how-it-works-panel"
                      id={`how-step-tab-${step.step}`}
                      onClick={() => setActive(i)}
                      className={cn(
                        "group w-full cursor-pointer rounded-2xl text-left transition-all duration-300 ease-out",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "bg-card p-5 shadow-md shadow-foreground/5 ring-1 ring-border/60 sm:p-6"
                          : "px-5 py-4 hover:bg-card/60 sm:px-6"
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm font-semibold transition-colors duration-300",
                          isActive ? "text-primary" : "text-foreground/70"
                        )}
                      >
                        Paso {i + 1}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-lg font-bold tracking-tight transition-colors duration-300 sm:text-xl",
                          isActive ? "text-foreground" : "text-foreground/80"
                        )}
                      >
                        {step.title}
                      </p>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            key={`desc-${step.step}`}
                            initial={
                              reduceMotion
                                ? false
                                : { opacity: 0, height: 0, marginTop: 0 }
                            }
                            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                            exit={
                              reduceMotion
                                ? undefined
                                : { opacity: 0, height: 0, marginTop: 0 }
                            }
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
                          >
                            {step.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>

              {/* Visual panel */}
              <div className="relative flex items-center gap-4">
                <div
                  id="how-it-works-panel"
                  role="tabpanel"
                  aria-labelledby={`how-step-tab-${current.step}`}
                  className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-primary/15 shadow-xl shadow-primary/10 sm:rounded-[1.75rem] lg:aspect-auto lg:min-h-120 lg:flex-1"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={current.step}
                      initial={
                        reduceMotion ? false : { opacity: 0, scale: 1.02 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={current.image}
                        alt={current.imageAlt}
                        className="absolute inset-0 size-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-primary/20" />
                      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

                      <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-6 sm:top-6">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur-md">
                          <Icon className="size-5" strokeWidth={2.25} />
                        </span>
                        <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                          {current.action}
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                        <div>
                          <p className="font-mono text-4xl font-black leading-none tracking-tighter text-white/30 sm:text-5xl">
                            {current.step}
                          </p>
                          <p className="mt-2 max-w-56 text-sm font-semibold text-white sm:text-base">
                            {current.action}
                          </p>
                        </div>
                        {/* Durations vary in length now that they are honest
                            ("2 minutos" vs "Entre 12 y 24 meses"), so the pill
                            wraps instead of overflowing on narrow screens. */}
                        <span className="inline-flex max-w-[55%] shrink items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-right text-xs font-semibold text-white backdrop-blur-md">
                          <Clock3 className="size-3.5 shrink-0" />
                          {current.duration}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Vertical step indicator */}
                <div
                  className="hidden shrink-0 flex-col items-center gap-2 sm:flex"
                  aria-hidden
                >
                  {STEPS.map((step, i) => (
                    <button
                      key={step.step}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Ir al paso ${i + 1}`}
                      className={cn(
                        "cursor-pointer rounded-full transition-all duration-300",
                        i === active
                          ? "h-8 w-1.5 bg-primary"
                          : "size-1.5 bg-foreground/20 hover:bg-foreground/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
