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
  ArrowUpRight,
  Clock3,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
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
 * "Cómo funciona" — second review, findings 34, 36, 39, 41 and 44.
 *
 * · 39 — the single most valuable protection of the model (the contribution
 *   sits in custody, and comes back if the capital is not completed or the
 *   adjudication is not obtained) was only reachable three pages deep. It is
 *   now a block inside this section, immediately before the auction stage.
 * · 36 — every step block was white, so the active one had no more presence
 *   than the closed ones and the numbering repeated the title. Closed steps
 *   now sit at lower contrast on a tinted surface; the active one keeps the
 *   white card, the primary label and an icon chip.
 * · 41 — the section closed at "cobras", as if the relationship ended with
 *   the first operation. It now states the continuity: portfolio, documents
 *   and status from the account.
 * · 34 — "pool" is introduced once as "capital colectivo de la operación
 *   (pool)"; every later mention across the product says capital colectivo.
 * · 44 — the CTA here is contextual ("Explora las oportunidades") instead of
 *   a fourth "crear cuenta gratis".
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
    action: "Participas",
    duration: "2 minutos",
    title: "Eliges cuánto aportas, desde S/ 500",
    desc: "Tu aporte se suma al de otros inversionistas hasta reunir el capital colectivo de la operación (lo que en el sector se llama pool). Ese capital es el que respalda la puja en el remate.",
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

/** Shown between "participas" and the auction stage (finding 39). */
function CustodyNote() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card p-4 sm:p-5">
      <span
        className="absolute inset-y-0 left-0 w-1.5 bg-primary"
        aria-hidden
      />
      <div className="flex items-start gap-3 pl-2">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-bold tracking-tight text-foreground">
              Antes de la adjudicación
            </p>
            <span className="type-label rounded-full bg-primary/10 px-2.5 py-1 text-primary">
              Aporte en custodia
            </span>
          </div>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
            Tu aporte permanece en custodia. Si no se completa el capital
            objetivo o {BRAND_NAME} no obtiene la adjudicación, se devuelve el
            aporte según las condiciones de la operación.
          </p>
          <Link
            href="/#tu-dinero"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Ver qué pasa con mi dinero
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

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
                <span className="text-primary">La operación, meses.</span>
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
                  <Link href="/propiedades">
                    Explora las oportunidades
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
                className="flex flex-col justify-center gap-2"
                role="tablist"
                aria-label="Pasos del proceso"
              >
                {STEPS.map((step, i) => {
                  const isActive = i === active;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.step} className="contents">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="how-it-works-panel"
                        id={`how-step-tab-${step.step}`}
                        onClick={() => setActive(i)}
                        className={cn(
                          "group w-full cursor-pointer rounded-2xl border text-left transition-all duration-300 ease-out",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isActive
                            ? "border-primary/25 bg-card p-5 shadow-md shadow-primary/10 sm:p-6"
                            : "border-transparent bg-foreground/[0.035] px-5 py-4 hover:border-primary/20 hover:bg-card/70 sm:px-6"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-foreground/8 text-foreground/45"
                            )}
                            aria-hidden
                          >
                            <StepIcon className="size-3.5" strokeWidth={2.3} />
                          </span>
                          <p
                            className={cn(
                              "text-sm font-semibold transition-colors duration-300",
                              isActive ? "text-primary" : "text-foreground/45"
                            )}
                          >
                            Paso {i + 1}
                          </p>
                          {isActive && (
                            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                              <Clock3 className="size-3" />
                              {step.duration}
                            </span>
                          )}
                        </div>

                        <p
                          className={cn(
                            "mt-2 text-lg font-bold tracking-tight transition-colors duration-300 sm:text-xl",
                            isActive ? "text-foreground" : "text-foreground/60"
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
                              animate={{
                                opacity: 1,
                                height: "auto",
                                marginTop: 12,
                              }}
                              exit={
                                reduceMotion
                                  ? undefined
                                  : { opacity: 0, height: 0, marginTop: 0 }
                              }
                              transition={{
                                duration: 0.28,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="overflow-hidden text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
                            >
                              {step.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </button>

                      {/* The protection that sits between paying and the
                          auction, stated where it happens (finding 39). */}
                      {i === 2 && <CustodyNote />}
                    </div>
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

            {/* Continuity after the fourth step (finding 41). */}
            <p className="mx-auto mt-10 max-w-2xl text-pretty text-center type-body text-muted-foreground">
              Y no termina ahí: desde tu cuenta puedes seguir cada operación,
              consultar documentos y mantener distintas participaciones en un
              solo portafolio.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
