"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FlipCard } from "@/components/landing/FlipCard";
import { LANDING_PHOTOS } from "@/lib/landing/media";
import { formatMoney } from "@/lib/currency";

const MONEY_STATES = [
  {
    when: "Antes del remate",
    title: "¿Dónde está tu dinero antes del remate?",
    what: "En una cuenta de custodia abierta en una empresa del sistema financiero peruano, identificada como cuenta de terceros y separada de las cuentas operativas del administrador. No se usa para gastos de la empresa.",
    image: LANDING_PHOTOS.moneyBefore,
    imageAlt: "Interior de una entidad financiera con resguardo de fondos",
    palette: "custody" as const,
  },
  {
    when: "Durante el remate",
    title: "¿Qué pasa con tu aporte durante el remate?",
    what: "Comprometido como respaldo de la puja hasta el techo aprobado para la operación. Si otro postor lo supera, el aporte vuelve a custodia y se devuelve.",
    image: LANDING_PHOTOS.moneyDuring,
    imageAlt: "Edificio institucional donde se conduce el remate",
    palette: "auction" as const,
  },
  {
    when: "Después de la adjudicación",
    title: "¿Qué ocurre después de adjudicar?",
    what: "Aplicado al pago del precio del inmueble, que queda a nombre del vehículo de la operación. Tu derecho pasa a ser sobre el resultado de la venta posterior.",
    image: LANDING_PHOTOS.moneyAfter,
    imageAlt: "Fachada de una vivienda adjudicada lista para gestionarse",
    palette: "settled" as const,
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

        <p className="mx-auto mt-5 max-w-3xl type-caption text-muted-foreground">
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

        <motion.div
          id="tu-dinero"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-5xl scroll-mt-24 sm:mt-14"
        >
          <div className="text-center">
            <h3 className="type-h3 text-balance text-foreground">
              Dónde está tu dinero antes del remate
            </h3>
            <p className="mx-auto mt-2 max-w-2xl type-body text-pretty text-muted-foreground">
              El aporte no llega a una cuenta de la empresa: llega a una cuenta
              de custodia, y solo se aplica cuando la operación avanza.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {MONEY_STATES.map((state) => (
              <FlipCard
                key={state.when}
                eyebrow={state.when}
                title={state.title}
                answer={state.what}
                image={state.image}
                imageAlt={state.imageAlt}
                palette={state.palette}
                className="min-h-[300px] sm:min-h-[340px]"
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
