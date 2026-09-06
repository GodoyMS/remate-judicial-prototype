"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  FileSearch,
  Gavel,
  KeyRound,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";

/**
 * "Qué gestiona Rematto por ti" — second review, findings 30 and 41.
 *
 * · 30 — the landing explained how to put money in, but barely developed the
 *   work that happens after the auction is won, which is the largest part of
 *   what the platform actually does. Four stages, compact, in order.
 * · 41 — and it closes on the relationship rather than the transaction: one
 *   real capture of the dashboard as evidence that the operation can be
 *   followed from the account.
 */

type Stage = {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
};

const STAGES: Stage[] = [
  {
    icon: FileSearch,
    step: "01",
    title: "Auditoría de la oportunidad",
    desc: "Expediente judicial, cargas y gravámenes en SUNARP, estado de ocupación y valor comercial estimado. Si no supera la revisión, no se publica.",
  },
  {
    icon: Gavel,
    step: "02",
    title: "Participación en el remate",
    desc: "Se presenta la postulación y se puja hasta el techo comprometido con los inversionistas. Ese techo no se sube durante el acto.",
  },
  {
    icon: Landmark,
    step: "03",
    title: "Inscripción, posesión y gestión del inmueble",
    desc: "Inscripción de la adjudicación en SUNARP, saneamiento de pendientes, toma de posesión —con lanzamiento judicial si el inmueble está ocupado— y mantenimiento del activo.",
  },
  {
    icon: KeyRound,
    step: "04",
    title: "Venta y liquidación",
    desc: "Comercialización del inmueble, descuento de gastos, impuestos y comisiones, y reparto del resultado a prorrata entre quienes participaron.",
  },
];

export function WhatWeManage() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="gestion"
      data-nav-tone="light"
      className="relative overflow-hidden bg-muted/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="type-label text-primary">Después de ganar el remate</p>
          <h2 className="type-h2 mt-3 text-balance text-foreground">
            Qué gestiona <span className="text-primary">{BRAND_NAME}</span> por
            ti
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Ganar la subasta es el punto medio, no el final. Estas son las
            cuatro etapas que el equipo lleva por cuenta de la operación.
          </p>
        </motion.div>

        {/* Stages — a numbered sequence, not four unrelated cards. */}
        <ol className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.li
                key={stage.step}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : i * 0.07,
                }}
                className="relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 sm:p-6"
              >
                {/* Connector — the sequence reads as one chain on desktop */}
                {i < STAGES.length - 1 && (
                  <span
                    className="absolute -right-3 top-1/2 hidden h-px w-5 bg-border lg:block"
                    aria-hidden
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" strokeWidth={2.1} />
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground/25">
                    {stage.step}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold tracking-tight text-balance text-foreground">
                  {stage.title}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {stage.desc}
                </p>
              </motion.li>
            );
          })}
        </ol>

        {/* Continuity — one real capture, not a carousel of mockups. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid gap-6 overflow-hidden rounded-3xl border border-border/60 bg-card p-5 sm:mt-12 sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8 lg:p-8"
        >
          <div>
            <h3 className="type-h3 text-balance text-foreground">
              Tú sigues cada etapa desde tu cuenta
            </h3>
            <p className="mt-3 type-body text-pretty text-muted-foreground">
              Estado de cada operación, documentos que respaldan tu
              participación, hitos del proceso judicial y el resultado cuando se
              liquida. Todas tus participaciones en un solo portafolio.
            </p>
            <Link
              href="/proceso-de-inversion"
              className="type-body mt-5 inline-flex w-fit items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              Ver el proceso completo
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <figure className="m-0">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-foreground/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/dashboard/portafolio.png"
                alt="Panel del inversionista mostrando el portafolio, el estado de cada operación y sus documentos"
                className="block w-full"
                loading="lazy"
                decoding="async"
              />
              {/* The capture is a crop of a longer page; the fade tells the
                  reader the list continues instead of ending mid-row. */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent"
                aria-hidden
              />
            </div>
            <figcaption className="type-caption mt-3 text-muted-foreground">
              Panel del inversionista. Los datos mostrados corresponden a una
              cuenta de demostración.
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  );
}
