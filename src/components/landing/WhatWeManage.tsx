"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { LANDING_PHOTOS } from "@/lib/landing/media";
import { DarkBand } from "@/components/landing/DarkBand";
import { FlipCard } from "@/components/landing/FlipCard";

const STAGES = [
  {
    step: "01",
    title: "¿Cómo se audita la oportunidad?",
    desc: "Expediente judicial, cargas y gravámenes en SUNARP, estado de ocupación y valor comercial estimado. Si no supera la revisión, no se publica.",
    image: LANDING_PHOTOS.manageAudit,
    imageAlt: "Revisión de expedientes y documentación registral",
  },
  {
    step: "02",
    title: "¿Cómo se participa en el remate?",
    desc: "Se presenta la postulación y se puja hasta el techo comprometido con los inversionistas. Ese techo no se sube durante el acto.",
    image: LANDING_PHOTOS.manageAuction,
    imageAlt: "Mazo de juez sobre documentación judicial",
  },
  {
    step: "03",
    title: "¿Qué pasa después de ganar?",
    desc: "Inscripción de la adjudicación en SUNARP, saneamiento de pendientes, toma de posesión —con lanzamiento judicial si el inmueble está ocupado— y mantenimiento del activo.",
    image: LANDING_PHOTOS.manageTitle,
    imageAlt: "Llaves de un inmueble sobre planos de la propiedad",
  },
  {
    step: "04",
    title: "¿Cómo se vende y liquida?",
    desc: "Comercialización del inmueble, descuento de gastos, impuestos y comisiones, y reparto del resultado a prorrata entre quienes participaron.",
    image: LANDING_PHOTOS.manageSale,
    imageAlt: "Sala de una vivienda lista para comercializar",
  },
];

export function WhatWeManage() {
  const reduceMotion = useReducedMotion();

  return (
    <DarkBand id="gestion">
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="type-label text-primary">Después de ganar el remate</p>
          <h2 className="type-h2 mt-3 text-balance text-background">
            Qué gestiona <span className="text-primary">{BRAND_NAME}</span> por
            ti
          </h2>
          <p className="mt-4 type-lead text-pretty text-background/70">
            Ganar la subasta es el punto medio, no el final. Estas son las
            cuatro etapas que el equipo lleva por cuenta de la operación.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
          {STAGES.map((stage) => (
            <FlipCard
              key={stage.step}
              eyebrow={`Etapa ${stage.step}`}
              title={stage.title}
              answer={stage.desc}
              image={stage.image}
              imageAlt={stage.imageAlt}
              className="min-h-[320px] sm:min-h-[360px]"
            />
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid gap-6 overflow-hidden rounded-3xl border border-background/12 bg-background/8 p-5 sm:mt-12 sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8 lg:p-8"
        >
          <div>
            <h3 className="type-h3 text-balance text-background">
              Tú sigues cada etapa desde tu cuenta
            </h3>
            <p className="mt-3 type-body text-pretty text-background/70">
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
            <div className="relative overflow-hidden rounded-2xl border border-background/15 bg-background/10 shadow-lg shadow-foreground/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/dashboard/portafolio.png"
                alt="Panel del inversionista mostrando el portafolio, el estado de cada operación y sus documentos"
                className="block w-full"
                loading="lazy"
                decoding="async"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-foreground/80 to-transparent"
                aria-hidden
              />
            </div>
            <figcaption className="type-caption mt-3 text-background/55">
              Panel del inversionista. Los datos mostrados corresponden a una
              cuenta de demostración.
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </DarkBand>
  );
}
