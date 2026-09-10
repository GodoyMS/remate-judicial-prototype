"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
} from "react";
import {
  ArrowRight,
  ExternalLink,
  FileCheck,
  Fingerprint,
  Gavel,
  Lock,
  Pause,
  Play,
  Receipt,
  Scale,
  type LucideIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Trust section — the six things a reader can verify, in the full-bleed peek
 * carousel the section used to have.
 *
 * ⚠ Regulatory note (audit RM-024, Crítica): this section previously stated
 * the platform was "registrada y supervisada" by the SBS and listed the SBS,
 * SUNAT, Poder Judicial, SUNARP, INDECOPI, UIF and Colegio Notarial as
 * "Aliados regulatorios & institucionales". A state supervisor is not an ally,
 * and presenting one as such implies an endorsement that has not been granted.
 * The section therefore asserts no supervision by any regulator; institutions
 * are described as the bodies before which each operation is processed, with
 * an explicit non-endorsement note. Reinstating a supervision claim requires
 * the registration document, and the claim should then link to it.
 *
 * Each slide pairs its copy with an image chosen for that specific claim, and
 * every one ends in the destination where the reader can check it (RM-013,
 * RM-023).
 */

type TrustCard = {
  id: string;
  meta: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** What the reader can independently go and check. */
  verify: string;
  href: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
};

const trustCards: TrustCard[] = [
  {
    id: "expediente",
    meta: "Poder Judicial",
    icon: Gavel,
    title: "Expediente judicial a la vista",
    description:
      "Cada operación se publica con su número de expediente y el juzgado que lleva el proceso, antes de que inviertas.",
    verify:
      "Consúltalo en la Consulta de Expedientes Judiciales del Poder Judicial.",
    href: "/proceso-de-inversion",
    linkLabel: "Cómo se selecciona un expediente",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Mazo de juez sobre documentación judicial",
  },
  {
    id: "titulos",
    meta: "SUNARP",
    icon: FileCheck,
    title: "Estudio de títulos antes de publicar",
    description:
      "Revisamos cargas, gravámenes y estado de ocupación en SUNARP. Si el expediente no supera la revisión, no llega a la plataforma.",
    verify:
      "El informe de títulos de cada propiedad está en su ficha, con tu cuenta creada.",
    href: "/proceso-de-inversion",
    linkLabel: "Ver el proceso de auditoría",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Revisión de expedientes y documentación registral",
  },
  {
    id: "riesgos",
    meta: "Transparencia",
    icon: Scale,
    title: "Los escenarios adversos, por escrito",
    description:
      "Capital colectivo incompleto, subasta no adjudicada, proceso suspendido, venta demorada o por debajo de lo estimado: qué pasa con tu capital en cada caso.",
    verify: "Ocho escenarios documentados, con plazos de devolución concretos.",
    href: "/politica-de-riesgos",
    linkLabel: "Leer la política de riesgos",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Personas revisando las condiciones de un contrato",
  },
  {
    id: "tarifas",
    meta: "Costos",
    icon: Receipt,
    title: "Nuestros intereses también están alineados contigo",
    description:
      "La comisión de éxito solo se cobra cuando la operación genera ganancia. Las demás comisiones y los costos de terceros están publicados, con el momento exacto en que se aplican.",
    verify:
      "Conoce todos los costos antes de invertir: nada se cobra por registrarte ni por operaciones que no llegaron a ejecutarse.",
    href: "/tarifas",
    linkLabel: "Conoce todos los costos antes de invertir",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Cálculo de comisiones y comprobantes",
  },
  {
    id: "kyc",
    meta: "Identidad",
    icon: Fingerprint,
    title: "Verificación de identidad y prevención de lavado",
    description:
      "Aplicamos verificación de identidad (KYC) y procedimientos de prevención de lavado de activos conforme a la normativa peruana vigente.",
    verify:
      "El detalle del procedimiento y la normativa aplicable está publicado.",
    href: "/cumplimiento-regulatorio",
    linkLabel: "Ver marco de cumplimiento",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Verificación de identidad con documento oficial",
  },
  {
    id: "datos",
    meta: "Tus datos",
    icon: Lock,
    title: "Qué hacemos con tus datos",
    description:
      "Qué información guardamos, quién puede verla, para qué y por cuánto tiempo, explicado sin tecnicismos.",
    verify:
      "Puedes solicitar acceso, rectificación o eliminación cuando quieras.",
    href: "/politica-de-privacidad",
    linkLabel: "Ver política de privacidad",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Candado digital sobre información protegida",
  },
];

/**
 * Finding 1 (Crítica) — the section named the Poder Judicial and SUNARP as
 * the places where a reader could check the claims, and then gave them no way
 * to get there. These are the official portals, with what can be validated in
 * each one. They open in a new tab so the reader does not lose the page.
 */
const officialSources = [
  {
    id: "pj",
    name: "Poder Judicial",
    logo: "/images/institutions/pj.png",
    what: "Consulta el estado y las actuaciones de un expediente judicial con su número.",
    href: "https://cej.pj.gob.pe/cej/forms/busquedaform.html",
    linkLabel: "Ir a la consulta oficial",
  },
  {
    id: "sunarp",
    name: "SUNARP",
    logo: "/images/institutions/sunarp.png",
    what: "Consulta la información registral del inmueble: titularidad, cargas y gravámenes.",
    href: "https://enlinea.sunarp.gob.pe/sunarpweb/pages/acceso/frmIndex.faces",
    linkLabel: "Ir al servicio oficial",
  },
  {
    id: "sunat",
    name: "SUNAT",
    logo: "/images/institutions/sunat.png",
    what: `Verifica el RUC y la condición del contribuyente de ${BRAND_NAME}.`,
    href: "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp",
    linkLabel: "Verificar RUC en SUNAT",
  },
];

const AUTOPLAY_MS = 6500;

/** Matches max-w-[1400px] + section-padding so slide 1 lines up with the header. */
const CAROUSEL_INSET = "max(1rem,calc((100vw - min(100vw,1400px)) / 2 + 1rem))";
const CAROUSEL_INSET_SM =
  "max(1.5rem,calc((100vw - min(100vw,1400px)) / 2 + 1.5rem))";
const CAROUSEL_INSET_LG =
  "max(2rem,calc((100vw - min(100vw,1400px)) / 2 + 2rem))";

/**
 * Even → secondary (light grey / dark-mode elevated).
 * Odd  → always-dark brand surface so light text stays readable in both themes.
 */
const cardTone = {
  even: {
    shell: "bg-secondary text-secondary-foreground",
    title: "text-secondary-foreground",
    body: "text-secondary-foreground/75",
    chip: "bg-foreground/8 text-secondary-foreground ring-foreground/10",
    verify: "bg-foreground/5 text-secondary-foreground/80",
    link: "text-primary",
  },
  odd: {
    shell:
      "bg-[oklch(from_var(--brand)_0.2_calc(c*0.1)_h)] text-[oklch(0.97_0_0)] dark:bg-[oklch(from_var(--brand)_0.28_calc(c*0.12)_h)] dark:text-[oklch(0.96_0_0)]",
    title: "text-[oklch(0.97_0_0)] dark:text-[oklch(0.96_0_0)]",
    body: "text-[oklch(from_var(--brand)_0.78_calc(c*0.04)_h)] dark:text-[oklch(from_var(--brand)_0.8_calc(c*0.05)_h)]",
    chip: "bg-white/10 text-[oklch(0.95_0_0)] ring-white/15",
    verify: "bg-white/8 text-[oklch(0.9_0_0)]",
    link: "text-[oklch(0.97_0_0)]",
  },
} as const;

/* ─── Trust card ───────────────────────────────────────────────────────────
   Stacks on phones (image above copy) and splits into two columns from `sm`.
   The original always used two columns, which left roughly 180px for the copy
   on a 390px screen. */

function TrustFeatureCard({
  card,
  index,
  active,
}: {
  card: TrustCard;
  index: number;
  active: boolean;
}) {
  const Icon = card.icon;
  const tone = index % 2 === 0 ? cardTone.even : cardTone.odd;

  return (
    <article
      className={cn(
        "group grid h-[500px] w-full grid-rows-[minmax(0,0.8fr)_minmax(0,1fr)] overflow-hidden rounded-3xl",
        "sm:h-[500px] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:grid-rows-1 sm:rounded-4xl lg:h-[560px]",
        "transition-[transform,opacity,box-shadow] duration-500 ease-out",
        tone.shell,
        active
          ? "scale-100 opacity-100 shadow-lg shadow-foreground/8"
          : "scale-[0.985] opacity-80"
      )}
    >
      {/* Copy — second on mobile, first from sm */}
      <div className="order-2 flex flex-col justify-center px-5 py-6 sm:order-1 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <span
          className={cn(
            "mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1",
            tone.chip
          )}
        >
          <Icon className="size-3 shrink-0" aria-hidden />
          {card.meta}
        </span>

        <h3
          className={cn(
            "text-balance text-xl font-bold leading-[1.15] tracking-tight sm:text-2xl lg:text-3xl",
            tone.title
          )}
        >
          {card.title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-sm text-sm leading-relaxed sm:mt-4 sm:text-[15px]",
            tone.body
          )}
        >
          {card.description}
        </p>

        {/* What you can go and check — the point of the whole section */}
        <p
          className={cn(
            "mt-4 hidden max-w-sm rounded-xl p-3 text-xs leading-relaxed sm:block",
            tone.verify
          )}
        >
          {card.verify}
        </p>

        <Link
          href={card.href}
          className={cn(
            "mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold hover:underline",
            tone.link
          )}
        >
          {card.linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Image — flush to the card edges, corners rounded against the copy */}
      <div className="relative order-1 min-h-0 overflow-hidden rounded-b-3xl sm:order-2 sm:rounded-b-none sm:rounded-l-3xl sm:rounded-l-4xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={card.imageAlt}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
        {/* Single shared grade so six photographs read as one set */}
        <div
          className="absolute inset-0 bg-linear-to-tr from-primary/25 via-transparent to-transparent mix-blend-multiply"
          aria-hidden
        />
      </div>
    </article>
  );
}

/* ─── Full-bleed peek carousel (content-left / edge-right) ─────────────── */

function TrustCardsCarousel() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35, margin: "0px" });
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    const sync = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    sync();
    api.on("reInit", sync);
    api.on("select", sync);
    return () => {
      api.off("reInit", sync);
      api.off("select", sync);
    };
  }, [api]);

  const playing = Boolean(inView && !isPaused && !reduceMotion);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  const handleProgressComplete = useCallback(
    (event: AnimationEvent<HTMLSpanElement>) => {
      if (event.animationName !== "trust-progress-fill") return;
      if (!playing) return;
      api?.scrollNext();
    },
    [api, playing]
  );

  return (
    <div ref={rootRef} className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          containScroll: false,
        }}
        className={cn(
          "w-full",
          /* Left inset = content column; right stays open to the viewport edge */
          "[&_[data-slot=carousel-content]]:pl-[var(--trust-inset)]",
          "sm:[&_[data-slot=carousel-content]]:pl-[var(--trust-inset-sm)]",
          "lg:[&_[data-slot=carousel-content]]:pl-[var(--trust-inset-lg)]"
        )}
        style={
          {
            "--trust-inset": CAROUSEL_INSET,
            "--trust-inset-sm": CAROUSEL_INSET_SM,
            "--trust-inset-lg": CAROUSEL_INSET_LG,
          } as CSSProperties
        }
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsPaused(false);
          }
        }}
      >
        <CarouselContent className="-ml-3 sm:-ml-4 lg:-ml-5">
          {trustCards.map((card, i) => (
            <CarouselItem
              key={card.id}
              className="basis-[88%] pl-3 sm:basis-[85%] sm:pl-4 md:basis-[78%] lg:basis-[72%] lg:pl-5 xl:basis-[68%]"
            >
              <TrustFeatureCard card={card} index={i} active={i === current} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Controls — centered under the content column */}
      <div className="mx-auto mt-8 flex max-w-[1400px] items-center justify-center gap-4 section-padding sm:mt-10 sm:gap-5">
        <button
          type="button"
          onClick={scrollPrev}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
          aria-label="Anterior"
        >
          <ArrowRight className="size-4 rotate-180" />
        </button>

        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
          aria-label={isPaused ? "Reproducir carrusel" : "Pausar carrusel"}
        >
          {isPaused ? (
            <Play className="ml-0.5 size-4 fill-current" />
          ) : (
            <Pause className="size-4 fill-current" />
          )}
        </button>

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Diapositivas"
        >
          {Array.from({ length: count }).map((_, i) => {
            const isActive = i === current;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-full transition-all duration-300 ease-out",
                  isActive
                    ? "h-2 w-8 bg-foreground/20 sm:w-10"
                    : "size-2 bg-foreground/20 hover:bg-foreground/40"
                )}
                aria-label={`Ir a ${trustCards[i]?.title ?? `tarjeta ${i + 1}`}`}
              >
                {isActive && !reduceMotion && (
                  <span
                    key={current}
                    className={cn(
                      "trust-progress-fill absolute inset-y-0 left-0 w-full rounded-full bg-foreground",
                      !playing && "is-paused"
                    )}
                    style={
                      {
                        "--trust-progress-ms": `${AUTOPLAY_MS}ms`,
                      } as CSSProperties
                    }
                    onAnimationEnd={handleProgressComplete}
                  />
                )}
                {isActive && reduceMotion && (
                  <span className="absolute inset-0 rounded-full bg-foreground" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
          aria-label="Siguiente"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Section ──────────────────────────────────────────────────────────── */

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
          className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center sm:mb-14"
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
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mb-14 w-full sm:mb-16"
      >
        <TrustCardsCarousel />
      </motion.div>

      {/* Compruébalo por tu cuenta — the actual doors to the public sources
          (finding 1). */}
      <div className="relative mx-auto mb-10 max-w-[1400px] section-padding sm:mb-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8"
        >
          <h3 className="type-h3 text-balance text-foreground">
            Compruébalo por tu cuenta, en la fuente oficial
          </h3>
          <p className="mt-2 type-body text-pretty text-muted-foreground">
            No hace falta que nos creas: estos son los portales del Estado
            donde puedes contrastar cada dato que publicamos.
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {officialSources.map((source) => (
              <li key={source.id} className="h-full">
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex h-10 w-20 items-center justify-center overflow-hidden rounded-lg bg-card ring-1 ring-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={source.logo}
                      alt={`Logo ${source.name}`}
                      width={80}
                      height={40}
                      className="h-8 w-[64px] object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <p className="mt-4 type-body font-semibold text-foreground">
                    {source.name}
                  </p>
                  <p className="mt-1.5 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {source.what}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {source.linkLabel}
                    <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="type-caption mt-5 text-muted-foreground">
            Enlaces a portales de terceros. Se abren en una pestaña nueva y su
            disponibilidad depende de cada entidad. Su mención no implica
            patrocinio, respaldo ni supervisión de {BRAND_NAME}.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
