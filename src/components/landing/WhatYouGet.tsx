"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Building2,
  Calculator,
  FileSignature,
  Landmark,
  LifeBuoy,
  Lock,
  ScrollText,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { BRAND_LEGAL_NAME, BRAND_NAME } from "@/lib/brand";
import { formatMoney } from "@/lib/currency";

/**
 * "Qué recibes cuando inviertes" — second review, findings 3, 21 and 22.
 *
 * · 3 — nothing on the landing said what a contribution actually buys, so a
 *   reader could reasonably assume they were buying a share of the property
 *   itself. The block opens by stating plainly what it is and what it is not.
 * · 21 — the legal structure was left implicit ("tu participación queda
 *   registrada sobre el inmueble", which means nothing precise). The seven
 *   questions the review asks for are answered as a spec: who acquires the
 *   property and appears in SUNARP, what document the investor signs, what
 *   right it grants, how the percentage is computed, who may sell, what
 *   happens if the platform stops operating and what document proves it.
 * · 22 — "cuentas de custodia separadas" was asserted without saying who
 *   holds the money. The money block below names the type of entity, the
 *   ownership of the account and where the specific account is disclosed.
 */

type Spec = {
  icon: LucideIcon;
  question: string;
  answer: string;
};

const SPECS: Spec[] = [
  {
    icon: Building2,
    question: "¿Quién adquiere el inmueble y aparece en SUNARP?",
    answer: `El vehículo de la operación —una sociedad constituida para esa operación concreta y administrada por ${BRAND_LEGAL_NAME}— es quien postula en el remate, recibe la adjudicación e inscribe la transferencia en SUNARP. Tu nombre no figura en la partida registral del inmueble.`,
  },
  {
    icon: FileSignature,
    question: "¿Qué documento firmas y recibes?",
    answer:
      "Un contrato de participación en la operación, firmado electrónicamente, que identifica el expediente judicial, el inmueble, tu aporte, tu porcentaje y las condiciones de devolución. Queda disponible para descarga en tu cuenta desde el momento en que aportas.",
  },
  {
    icon: ScrollText,
    question: "¿Qué derecho te corresponde?",
    answer:
      "Un derecho contractual de contenido económico sobre el resultado de esa operación: la parte proporcional de lo que quede después de gastos, impuestos y comisiones. No es una cuota de copropiedad sobre el inmueble ni un valor negociable.",
  },
  {
    icon: Calculator,
    question: "¿Cómo se calcula tu porcentaje?",
    answer:
      "Tu aporte dividido entre el capital colectivo total de la operación. El porcentaje queda fijado cuando el capital se completa y no varía después, salvo devolución.",
  },
  {
    icon: Landmark,
    question: "¿Quién puede disponer del inmueble o venderlo?",
    answer: `El vehículo de la operación, a través de ${BRAND_NAME} como administrador y dentro de los parámetros de precio y plazo pactados en el contrato. Ninguna participación individual puede vender el inmueble por su cuenta.`,
  },
  {
    icon: LifeBuoy,
    question: `¿Qué pasa con ese derecho si ${BRAND_NAME} deja de operar?`,
    answer:
      "El inmueble pertenece al vehículo de la operación y los aportes están en cuentas de custodia, en ambos casos fuera del patrimonio del administrador. El contrato prevé la sustitución del administrador para que la operación continúe hasta su liquidación.",
  },
];

/** Where the money sits at each moment (finding 22). */
const MONEY_STATES = [
  {
    icon: Lock,
    when: "Antes del remate",
    what: "En una cuenta de custodia abierta en una empresa del sistema financiero peruano, identificada como cuenta de terceros y separada de las cuentas operativas del administrador. No se usa para gastos de la empresa.",
  },
  {
    icon: Banknote,
    when: "Durante el remate",
    what: "Comprometido como respaldo de la puja hasta el techo aprobado para la operación. Si otro postor lo supera, el aporte vuelve a custodia y se devuelve.",
  },
  {
    icon: Wallet,
    when: "Después de la adjudicación",
    what: "Aplicado al pago del precio del inmueble, que queda a nombre del vehículo de la operación. Tu derecho pasa a ser sobre el resultado de la venta posterior.",
  },
];

export function WhatYouGet() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="que-recibes"
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
            Qué recibes exactamente{" "}
            <span className="text-primary">cuando inviertes</span>
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Antes de invertir conviene saber qué se firma, qué derecho se
            adquiere y dónde está el dinero mientras tanto.
          </p>
        </motion.div>

        {/* The plain statement, before any detail (finding 3). */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-primary/25 bg-primary/5 p-6 sm:mt-12 sm:p-8"
        >
          <p className="text-balance text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
            Cuando inviertes {formatMoney(500)} no compras directamente un
            porcentaje del inmueble.
          </p>
          <p className="mt-3 type-body text-pretty text-muted-foreground">
            Tu aporte te otorga un{" "}
            <strong className="font-semibold text-foreground">
              derecho contractual de contenido económico
            </strong>{" "}
            sobre esa operación, proporcional a lo que aportaste. Recibes ese
            resultado proporcional cuando la operación se liquida —y asumes en
            la misma proporción un resultado adverso, si lo hay.
          </p>
        </motion.div>

        {/* The seven questions, answered (finding 21). */}
        <div className="mx-auto mt-6 grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-5">
          {SPECS.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <motion.article
                key={spec.question}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : (i % 2) * 0.06,
                }}
                className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                    <Icon className="size-4.5" strokeWidth={2.1} />
                  </span>
                  <h3 className="text-base font-bold leading-snug tracking-tight text-balance text-foreground">
                    {spec.question}
                  </h3>
                </div>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {spec.answer}
                </p>
              </motion.article>
            );
          })}
        </div>

        <p className="mx-auto mt-5 max-w-5xl type-caption text-muted-foreground">
          El contrato de participación de cada operación está disponible para
          lectura antes de aportar, y sus condiciones prevalecen sobre este
          resumen.{" "}
          <Link
            href="/terminos-de-uso"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            Ver términos de uso
          </Link>
          .
        </p>

        {/* Where the money is (finding 22). */}
        <motion.div
          id="tu-dinero"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-5xl scroll-mt-24 rounded-3xl border border-border/60 bg-muted/40 p-6 sm:mt-14 sm:p-8"
        >
          <h3 className="type-h3 text-balance text-foreground">
            Dónde está tu dinero antes del remate
          </h3>
          <p className="mt-2 type-body text-pretty text-muted-foreground">
            El aporte no llega a una cuenta de la empresa: llega a una cuenta de
            custodia, y solo se aplica cuando la operación avanza.
          </p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {MONEY_STATES.map((state) => {
              const Icon = state.icon;
              return (
                <li
                  key={state.when}
                  className="flex flex-col rounded-2xl border border-border/70 bg-card p-5"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4.5" strokeWidth={2.1} />
                  </span>
                  <p className="mt-3.5 text-sm font-bold tracking-tight text-foreground">
                    {state.when}
                  </p>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {state.what}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-caption max-w-xl text-muted-foreground">
              La entidad que mantiene la cuenta de custodia y los datos de
              titularidad se muestran en la ficha de cada operación antes de
              confirmar tu aporte.
            </p>
            <Link
              href="/preguntas-frecuentes#custodia"
              className="type-body inline-flex w-fit shrink-0 items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              Preguntas sobre custodia
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
