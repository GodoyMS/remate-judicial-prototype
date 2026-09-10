"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Banknote,
  FolderSearch,
  Layers,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const PROBLEMS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Banknote,
    title: "Capital alto",
    description:
      "Participar por tu cuenta exige el depósito y el saldo en pocos días. El ticket queda fuera del alcance de la mayoría.",
  },
  {
    icon: FolderSearch,
    title: "Expediente complejo",
    description:
      "Hay que leer cargas, gravámenes, ocupación y el estado del proceso. Un error aquí pone en riesgo el capital completo.",
  },
  {
    icon: Layers,
    title: "Concentración de riesgo",
    description:
      "Comprar directo significa poner todo en un solo inmueble, un solo distrito y un solo desenlace posible.",
  },
  {
    icon: Wrench,
    title: "Gestión posterior",
    description:
      "Ganar el remate no cierra nada: inscripción, posesión, saneamiento y venta toman meses de trabajo especializado.",
  },
];

export function ProblemFound() {
  const reduceMotion = useReducedMotion();

  return (
    <section
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
          <p className="type-label text-primary">Nuestro punto de partida</p>
          <h2 className="type-h2 mt-3 text-balance text-foreground">
            El problema que encontramos
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Invertir en remates inmobiliarios tiene un gran potencial, pero
            para la mayoría de personas es un camino lleno de barreras.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <motion.article
                key={problem.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : i * 0.06,
                }}
                className="rounded-3xl border border-border/70 bg-card p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={2.1} />
                </span>
                <h3 className="type-h3 mt-5 text-foreground">{problem.title}</h3>
                <p className="mt-2 type-body text-pretty text-muted-foreground">
                  {problem.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
