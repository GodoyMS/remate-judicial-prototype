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

const STEPS: Step[] = [
  {
    icon: UserCheck,
    step: "01",
    action: "Regístrate",
    duration: "2 min",
    title: "Crea tu cuenta y verifica tu identidad",
    desc: "Regístrate en minutos. Sube tu DNI y completa la verificación KYC para acceder a todas las subastas disponibles.",
    image: "/images/how-it-works/step-01.jpg",
    imageAlt: "Persona creando su cuenta desde el laptop",
  },
  {
    icon: Search,
    step: "02",
    action: "Explora",
    duration: "3 min",
    title: "Explora propiedades verificadas",
    desc: "Navega nuestro catálogo de propiedades en remate judicial. Cada una auditada legalmente con documentos disponibles.",
    image: "/images/how-it-works/step-02.jpg",
    imageAlt: "Propiedad moderna verificada lista para explorar",
  },
  {
    icon: Banknote,
    step: "03",
    action: "Invierte",
    duration: "2 min",
    title: "Invierte desde S/ 500",
    desc: "Elige el monto a invertir. Procesamos tu pago de forma segura y registramos tu participación en la subasta.",
    image: "/images/how-it-works/step-03.jpg",
    imageAlt: "Pago móvil seguro para invertir en segundos",
  },
  {
    icon: Trophy,
    step: "04",
    action: "Recibe",
    duration: "1 min",
    title: "Recibe tus retornos",
    desc: "Una vez adjudicada la propiedad, recibes tu retorno proporcional directamente en tu cuenta Remata.",
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
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                De cero a tu primera inversión en{" "}
                <span className="text-primary">menos de 10 minutos</span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Cuatro pasos simples. Haz clic en cada uno para ver cómo funciona.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-7 h-12 rounded-full px-7 font-bold shadow-lg shadow-primary/20"
              >
                <Link href="/register">
                  Crear cuenta gratis
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
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
                          : "px-5 py-4 opacity-45 hover:opacity-70 sm:px-6"
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm font-semibold transition-colors duration-300",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        Paso {i + 1}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-lg font-bold tracking-tight transition-colors duration-300 sm:text-xl",
                          isActive ? "text-foreground" : "text-muted-foreground"
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
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                          <Clock3 className="size-3.5" />
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
