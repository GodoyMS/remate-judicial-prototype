"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  FileCheck,
  Fingerprint,
  Gavel,
  Info,
  Lock,
  Receipt,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Trust section — audit findings RM-011, RM-013, RM-019, RM-023 and RM-024.
 *
 * ⚠ RM-024 (Crítica) — the previous copy stated the platform was "registrada y
 * supervisada" by the SBS and displayed the SBS, SUNAT, Poder Judicial,
 * SUNARP, INDECOPI, UIF and the Colegio Notarial under the heading "Aliados
 * regulatorios & institucionales". A state supervisor is not an ally, and
 * presenting one as such implies an endorsement that has not been granted.
 * Claims of that weight cannot ship un-evidenced on a page that asks for
 * money, so this section no longer asserts supervision by any regulator.
 * Institutions are now described for what they factually are — the bodies
 * before which each operation is processed — with an explicit note that they
 * neither sponsor nor endorse the platform. Reinstating any supervision claim
 * requires the corresponding registration document, and the claim should then
 * link to it. See the PR description for the full flag.
 *
 * · RM-023 / RM-013 — every card states what the reader can go and check, and
 *   links to where. Assertions without a destination were removed.
 * · RM-019 — nine cards became six; the rest of the argument lives on the
 *   pages each card points to.
 * · RM-011 — nine unrelated stock photographs replaced by one consistent
 *   iconographic treatment on brand surfaces.
 */

type TrustCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** What the reader can independently verify. */
  verify: string;
  href: string;
  linkLabel: string;
};

const trustCards: TrustCard[] = [
  {
    id: "expediente",
    icon: Gavel,
    title: "Expediente judicial a la vista",
    description:
      "Cada operación se publica con su número de expediente y el juzgado que lleva el proceso, antes de que inviertas.",
    verify:
      "Puedes consultar ese expediente en la Consulta de Expedientes Judiciales del Poder Judicial.",
    href: "/proceso-de-inversion",
    linkLabel: "Ver cómo se selecciona un expediente",
  },
  {
    id: "titulos",
    icon: FileCheck,
    title: "Estudio de títulos antes de publicar",
    description:
      "Revisamos cargas, gravámenes y estado de ocupación en SUNARP. Si el expediente no supera la revisión, no llega a la plataforma.",
    verify:
      "El informe de títulos de cada propiedad está disponible en su ficha, con tu cuenta creada.",
    href: "/proceso-de-inversion",
    linkLabel: "Ver el proceso de auditoría",
  },
  {
    id: "riesgos",
    icon: Scale,
    title: "Los escenarios adversos, por escrito",
    description:
      "Pool incompleto, subasta no adjudicada, proceso suspendido, venta demorada o por debajo de lo estimado: qué pasa con tu capital en cada caso.",
    verify:
      "Ocho escenarios documentados, con plazos de devolución concretos.",
    href: "/politica-de-riesgos",
    linkLabel: "Leer la política de riesgos",
  },
  {
    id: "tarifas",
    icon: Receipt,
    title: "Todas las comisiones, publicadas",
    description:
      "Comisiones de la plataforma y costos de terceros, con el momento exacto en que se aplican y un ejemplo con números.",
    verify:
      "Nada se cobra por registrarte ni por operaciones que no llegaron a ejecutarse.",
    href: "/tarifas",
    linkLabel: "Ver tarifas y comisiones",
  },
  {
    id: "kyc",
    icon: Fingerprint,
    title: "Verificación de identidad y prevención de lavado",
    description:
      "Aplicamos verificación de identidad (KYC) y procedimientos de prevención de lavado de activos conforme a la normativa peruana vigente.",
    verify:
      "El detalle del procedimiento y la normativa aplicable está publicado.",
    href: "/cumplimiento-regulatorio",
    linkLabel: "Ver marco de cumplimiento",
  },
  {
    id: "datos",
    icon: Lock,
    title: "Qué hacemos con tus datos",
    description:
      "Qué información guardamos, quién puede verla, para qué y por cuánto tiempo, explicado sin tecnicismos.",
    verify:
      "Puedes solicitar acceso, rectificación o eliminación de tus datos cuando quieras.",
    href: "/politica-de-privacidad",
    linkLabel: "Ver política de privacidad",
  },
];

/**
 * Institutions involved in the process. Deliberately NOT framed as partners,
 * sponsors or supervisors — see the RM-024 note above.
 */
const institutions = [
  {
    name: "Poder Judicial",
    role: "Conduce el remate y emite la adjudicación",
    logo: "/images/institutions/pj.png",
  },
  {
    name: "SUNARP",
    role: "Registra la propiedad y sus cargas",
    logo: "/images/institutions/sunarp.png",
  },
  {
    name: "SUNAT",
    role: "Administra las obligaciones tributarias",
    logo: "/images/institutions/sunat.png",
  },
  {
    name: "Colegio Notarial",
    role: "Interviene en escrituras y legalizaciones",
    logo: "/images/institutions/cnl.png",
  },
  {
    name: "INDECOPI",
    role: "Recibe reclamos de consumidores",
    logo: "/images/institutions/indecopi.png",
  },
];

function TrustFeatureCard({ card }: { card: TrustCard }) {
  const Icon = card.icon;
  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-sm",
        "transition-shadow duration-300 hover:shadow-md sm:p-8"
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="size-5.5" strokeWidth={2.1} />
      </span>

      <h3 className="type-h3 mt-5 text-balance text-foreground">
        {card.title}
      </h3>
      <p className="type-body mt-3 text-pretty text-muted-foreground">
        {card.description}
      </p>

      <p className="type-caption mt-4 flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <span>{card.verify}</span>
      </p>

      <Link
        href={card.href}
        className="group type-body mt-5 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
      >
        {card.linkLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}

export function TrustSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="confianza"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 12%, transparent) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 right-0 size-[420px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center sm:mb-14"
        >
          <h2 className="type-h2 text-balance">
            No te pedimos que confíes.{" "}
            <span className="text-primary">Te decimos qué verificar.</span>
          </h2>
          <p className="type-lead mt-4 text-pretty text-muted-foreground">
            Seis cosas que puedes comprobar por tu cuenta antes de invertir un
            sol en {BRAND_NAME}.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {trustCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.05 }}
              className="flex"
            >
              <TrustFeatureCard card={card} />
            </motion.div>
          ))}
        </div>

        {/* Institutions — described factually, with the endorsement disclaimer
            stated in the same block rather than in fine print elsewhere. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 rounded-3xl border border-border/60 bg-muted/40 p-6 sm:mt-16 sm:p-8"
        >
          <h3 className="type-label text-muted-foreground">
            Entidades que intervienen en el proceso
          </h3>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((institution) => (
              <li
                key={institution.name}
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3"
              >
                <span className="flex h-11 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card ring-1 ring-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={institution.logo}
                    alt={`Logo ${institution.name}`}
                    width={80}
                    height={40}
                    className="h-9 w-[68px] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <div className="min-w-0">
                  <p className="type-body font-semibold text-foreground">
                    {institution.name}
                  </p>
                  <p className="type-caption text-muted-foreground">
                    {institution.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="type-caption mt-6 border-t border-border/70 pt-5 text-muted-foreground">
            Estas son las instituciones ante las que se tramita cada operación.{" "}
            <strong className="font-semibold text-foreground">
              Ninguna de ellas patrocina, respalda ni supervisa a {BRAND_NAME}
            </strong>
            , y su mención no implica autorización, garantía ni recomendación
            alguna sobre las inversiones ofrecidas.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
