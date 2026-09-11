"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FileSearch,
  Gavel,
  Handshake,
  Home,
  Landmark,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: FileSearch,
    title: "Evaluación",
    description: "Analizamos la oportunidad y sus riesgos.",
  },
  {
    icon: Handshake,
    title: "Participación",
    description: "Te asesoramos en la participación en el remate.",
  },
  {
    icon: Gavel,
    title: "Adjudicación",
    description: "Te acompañamos en la adjudicación del inmueble.",
  },
  {
    icon: Landmark,
    title: "Saneamiento",
    description: "Coordinamos los trámites legales y registrales.",
  },
  {
    icon: Home,
    title: "Venta",
    description: "Estrategia comercial para maximizar el valor.",
  },
  {
    icon: Wallet,
    title: "Liquidación",
    description: "Recibes tu retorno. Nuestro éxito también depende del tuyo.",
  },
];

export function WorkTimeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="como-trabajamos"
      data-nav-tone="light"
      className="relative overflow-hidden bg-muted/40 py-16 sm:py-20 lg:py-24 scroll-mt-24"
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
            No te dejamos solo después de invertir
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Te acompañamos en cada etapa del proceso, con un equipo experto y
            comunicación transparente.
          </p>
        </motion.div>

        <ol className="relative mt-14 grid gap-8 lg:grid-cols-6 lg:gap-4">
          <span
            className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-px bg-linear-to-b from-primary via-primary/50 to-primary/15 lg:left-5 lg:right-5 lg:top-5 lg:bottom-auto lg:h-px lg:w-auto lg:bg-linear-to-r"
            aria-hidden
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const last = i === STEPS.length - 1;
            return (
              <motion.li
                key={step.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : i * 0.06,
                }}
                className={cn(
                  "relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 lg:grid-cols-1 lg:gap-5",
                  last && "lg:rounded-2xl lg:bg-primary/8 lg:p-4"
                )}
              >
                <div className="relative z-10 flex lg:justify-start">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2 bg-background text-primary shadow-sm",
                      last
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/40"
                    )}
                  >
                    <Icon className="size-4" strokeWidth={2.2} />
                  </span>
                </div>
                <div className="lg:pr-2">
                  <p className="font-mono text-[11px] font-bold tracking-widest text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
