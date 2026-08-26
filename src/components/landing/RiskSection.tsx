"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, TrendingDown, Undo2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * "Conoce también los riesgos" — audit finding RM-018 (Crítico), with
 * RM-027 feeding the scenarios.
 *
 * The commercial narrative explained the favourable path in detail while
 * everything adverse lived in secondary or legal content. An investor with
 * real capital evaluates the downside first; when they cannot find a plain
 * answer, the reasonable inference is that the platform is avoiding the
 * subject. So the four questions that decide a large ticket are answered
 * here, on the landing, between the opportunities and the closing CTA.
 */

const RISKS = [
  {
    icon: Undo2,
    question: "¿Y si la subasta no se adjudica?",
    answer:
      "Se devuelve el 100% de tu aporte, sin comisión, en un máximo de 10 días hábiles. Lo mismo si el pool no llega a completarse.",
  },
  {
    icon: Clock,
    question: "¿Y si el proceso se demora?",
    answer:
      "Es lo más frecuente. Los plazos dependen del juzgado y de la entrega de la posesión. Una operación típica cierra entre 12 y 24 meses.",
  },
  {
    icon: TrendingDown,
    question: "¿Puedo perder dinero?",
    answer:
      "Sí. Si el inmueble se vende por debajo del valor estimado, el retorno puede ser menor al proyectado o negativo. La pérdida se reparte a prorrata.",
  },
  {
    icon: Wallet,
    question: "¿Puedo retirar antes de tiempo?",
    answer:
      "Antes de la adjudicación, sí. Después no: es una inversión ilíquida y hoy no existe mercado secundario para tu participación.",
  },
];

export function RiskSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="riesgos"
      data-nav-tone="light"
      className="relative bg-muted/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="type-label text-primary">Conoce también los riesgos</p>
          <h2 className="type-h2 mt-3 text-balance text-foreground">
            ¿Qué pasa si las cosas no salen como esperabas?
          </h2>
          <p className="type-lead mt-4 text-pretty text-muted-foreground">
            Las cuatro preguntas que deberías hacerte antes de invertir,
            respondidas sin rodeos.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {RISKS.map((risk, i) => {
            const Icon = risk.icon;
            return (
              <motion.article
                key={risk.question}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.42,
                  delay: reduceMotion ? 0 : i * 0.06,
                }}
                className="flex gap-4 rounded-2xl border border-border/70 bg-card p-6"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-foreground ring-1 ring-warning/30">
                  <Icon className="size-4.5" strokeWidth={2.1} />
                </span>
                <div>
                  <h3 className="type-h3 text-foreground">{risk.question}</h3>
                  <p className="type-body mt-2 text-pretty text-muted-foreground">
                    {risk.answer}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center"
        >
          <Button asChild variant="outline" className="rounded-full font-semibold">
            <Link href="/politica-de-riesgos">
              Ver los 8 escenarios en detalle
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
          <Link
            href="/contacto"
            className="type-body font-semibold text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            Prefiero preguntarle a alguien
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
