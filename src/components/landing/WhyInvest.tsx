"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BRAND_NAME } from "@/lib/brand";
import { LANDING_PHOTOS } from "@/lib/landing/media";
import { DarkBand } from "@/components/landing/DarkBand";

type Pillar = {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
};

const PILLARS: Pillar[] = [
  {
    id: "access",
    eyebrow: "Acceso",
    title: "Accede sin necesitar el capital completo de una propiedad",
    desc: "Participa desde el monto mínimo definido para cada oportunidad.",
    image: LANDING_PHOTOS.whyAccess,
    imageAlt: "Interior de una vivienda contemporánea iluminada",
  },
  {
    id: "managed",
    eyebrow: "Gestión",
    title: "No enfrentas solo el proceso judicial",
    desc: `${BRAND_NAME} analiza la oportunidad y gestiona las etapas que correspondan hasta la liquidación.`,
    image: LANDING_PHOTOS.whyManaged,
    imageAlt: "Equipo revisando una operación alrededor de una mesa",
  },
  {
    id: "spread",
    eyebrow: "Diversificación",
    title: "Distribuye tu capital entre distintas oportunidades",
    desc: "Puedes participar en más de una operación en lugar de concentrarte necesariamente en un solo inmueble.",
    image: LANDING_PHOTOS.whySpread,
    imageAlt: "Skyline de edificios de oficinas y residencias",
  },
  {
    id: "tracking",
    eyebrow: "Seguimiento",
    title: "Sigue tu inversión de principio a fin",
    desc: "Consulta estados, documentos, hitos y resultados desde tu cuenta.",
    image: LANDING_PHOTOS.whyTracking,
    imageAlt: "Tablero digital con el seguimiento de una inversión",
  },
];

export function WhyInvest() {
  const reduceMotion = useReducedMotion();

  return (
    <DarkBand id="por-que-invertir">
      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="type-h2 text-balance text-inherit">
            Cuatro razones para invertir con{" "}
            <span className="text-primary">{BRAND_NAME}</span>
          </h2>
          <p className="mt-4 type-lead text-pretty dark-band-body">
            Lo que obtienes gracias a la plataforma, y dónde puedes comprobarlo.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {PILLARS.map((pillar, i) => (
            <motion.article
              key={pillar.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: reduceMotion ? 0 : i * 0.07,
              }}
              className="overflow-hidden rounded-3xl border border-white/12 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  className="size-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
                  aria-hidden
                />
                <p className="absolute bottom-4 left-5 type-label uppercase tracking-wide text-primary">
                  {pillar.eyebrow}
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="type-h3 text-balance text-inherit">
                  {pillar.title}
                </h3>
                <p className="type-body mt-2 text-pretty dark-band-body">
                  {pillar.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </DarkBand>
  );
}
