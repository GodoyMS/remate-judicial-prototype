"use client";

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
  BadgeCheck,
  FileCheck,
  Fingerprint,
  Gavel,
  Landmark,
  Lock,
  Pause,
  Play,
  Receipt,
  Scale,
  Shield,
  type LucideIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────────────────── */

type TrustCard = {
  id: string;
  title: string;
  description: string;
  meta?: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
};

const trustCards: TrustCard[] = [
  {
    id: "legal",
    title: "Marco legal peruano",
    description:
      "Código Civil, ejecución de garantías y normativa de remates judiciales vigente. Cada operación nace en el Poder Judicial.",
    meta: "Ley · PJ",
    icon: Gavel,
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Documentación legal y martillo de juez",
  },
  {
    id: "tax",
    title: "Tributación en regla",
    description:
      "Retenciones y reportes alineados con SUNAT. Comprobante electrónico en cada operación.",
    meta: "SUNAT",
    icon: Receipt,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Documentos fiscales",
  },
  {
    id: "kyc",
    title: "KYC & PLAFT",
    description:
      "Verificación de identidad y monitoreo antilavado conforme a la UIF-Perú. Tu capital entra limpio y sale trazable.",
    meta: "UIF",
    icon: Fingerprint,
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Verificación de identidad digital",
  },
  {
    id: "sbs",
    title: "Supervisión financiera",
    description:
      "Custodia de fondos bajo estándares SBS y mejores prácticas fintech del sistema peruano.",
    meta: "SBS",
    icon: Landmark,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Edificio financiero",
  },
  {
    id: "encrypt",
    title: "Encriptación bancaria",
    description:
      "AES-256 y comunicaciones TLS en toda tu información. El mismo estándar que usan los bancos.",
    meta: "Seguridad · SBS",
    icon: Lock,
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Seguridad digital",
  },
  {
    id: "audit",
    title: "Expedientes auditados",
    description:
      "Cada propiedad revisada por abogados especializados en remates antes de publicarse.",
    meta: "Legal · SUNARP",
    icon: FileCheck,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Expediente documental",
  },
  {
    id: "contracts",
    title: "Contratos válidos en Perú",
    description:
      "Contratos con validez legal peruana en cada operación de inversión. Firmados, registrados y ejecutables.",
    icon: Scale,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Contrato legal",
  },
  {
    id: "trace",
    title: "Trazabilidad total",
    description:
      "Seguimiento completo de cada sol invertido, del expediente al retorno. Sin cajas negras.",
    icon: Shield,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Dashboard de trazabilidad",
  },
  {
    id: "reports",
    title: "Reportes fiscales",
    description:
      "Reportes fiscales descargables, listos para tu declaración anual ante SUNAT.",
    icon: Receipt,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Reportes financieros",
  },
  {
    id: "live-audit",
    title: "Auditoría en vivo",
    description:
      "Auditoría documental en tiempo real durante todo el proceso. Transparencia que se puede verificar.",
    icon: FileCheck,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Revisión profesional",
  },
];

type Ally = {
  abbr: string;
  name: string;
  role: string;
  logo: string;
};

const allies: Ally[] = [
  {
    abbr: "PJ",
    name: "Poder Judicial",
    role: "Subastas judiciales",
    logo: "/images/institutions/pj.png",
  },
  {
    abbr: "SUNARP",
    name: "SUNARP",
    role: "Registro de propiedades",
    logo: "/images/institutions/sunarp.png",
  },
  {
    abbr: "SBS",
    name: "SBS",
    role: "Supervisión financiera",
    logo: "/images/institutions/sbs.png",
  },
  {
    abbr: "SUNAT",
    name: "SUNAT",
    role: "Cumplimiento tributario",
    logo: "/images/institutions/sunat.png",
  },
  {
    abbr: "INDECOPI",
    name: "INDECOPI",
    role: "Protección al consumidor",
    logo: "/images/institutions/indecopi.png",
  },
  {
    abbr: "CNL",
    name: "Colegio Notarial",
    role: "Escrituras y legalización",
    logo: "/images/institutions/cnl.png",
  },
  {
    abbr: "UIF",
    name: "UIF-Perú",
    role: "Prevención LA/FT",
    logo: "/images/institutions/uif.png",
  },
];

const AUTOPLAY_MS = 5500;

/** Matches max-w-[1400px] + section-padding so slide 1 lines up with the header. */
const CAROUSEL_INSET =
  "max(1rem,calc((100vw - min(100vw,1400px)) / 2 + 1rem))";
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
  },
  odd: {
    shell:
      "bg-[oklch(from_var(--brand)_0.2_calc(c*0.1)_h)] text-[oklch(0.97_0_0)] dark:bg-[oklch(from_var(--brand)_0.28_calc(c*0.12)_h)] dark:text-[oklch(0.96_0_0)]",
    title: "text-[oklch(0.97_0_0)] dark:text-[oklch(0.96_0_0)]",
    body: "text-[oklch(from_var(--brand)_0.78_calc(c*0.04)_h)] dark:text-[oklch(from_var(--brand)_0.8_calc(c*0.05)_h)]",
    chip: "bg-white/10 text-[oklch(0.95_0_0)] ring-white/15",
  },
} as const;

/* ─── Trust card — 2 columns ───────────────────────────────────────────── */

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
        "group grid h-[420px] w-full grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] overflow-hidden rounded-3xl sm:h-[500px] sm:rounded-4xl lg:h-[560px]",
        "transition-[transform,opacity,box-shadow] duration-500 ease-out",
        tone.shell,
        active
          ? "scale-100 opacity-100 shadow-lg shadow-foreground/8"
          : "scale-[0.985] opacity-80"
      )}
    >
      {/* Col 1 — copy, vertically centered */}
      <div className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        {card.meta && (
          <span
            className={cn(
              "mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1",
              tone.chip
            )}
          >
            <Icon className="size-3 shrink-0" aria-hidden />
            {card.meta}
          </span>
        )}
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
      </div>

      {/* Col 2 — flush to card edges; left corners rounded against copy */}
      <div className="relative min-h-0 overflow-hidden rounded-l-3xl sm:rounded-l-4xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={card.imageAlt}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
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
              <TrustFeatureCard
                card={card}
                index={i}
                active={i === current}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Controls — centered under the content column */}
      <div
        className="mx-auto mt-8 flex max-w-[1400px] items-center justify-center gap-4 section-padding sm:mt-10 sm:gap-5"
      >
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

/* ─── Allies sponsor marquee ───────────────────────────────────────────── */

function AllyChip({ ally }: { ally: Ally }) {
  return (
    <div
      className={cn(
        "group flex h-[76px] w-[236px] shrink-0 items-center gap-3 rounded-2xl border border-border/70 bg-card px-3.5 py-3",
        "shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
      )}
      title={`${ally.name} — ${ally.role}`}
    >
      <span className="flex h-12 w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card ring-1 ring-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ally.logo}
          alt={`Logo ${ally.name}`}
          width={88}
          height={44}
          className="h-10 w-[76px] object-contain"
          loading="lazy"
          decoding="async"
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">
          {ally.name}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">{ally.role}</p>
      </div>
    </div>
  );
}

function AlliesMarquee() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const track = [...allies, ...allies, ...allies];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-background to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-background to-transparent sm:w-16" />

      <div className="overflow-hidden py-1">
        <motion.div
          className="flex w-max gap-3"
          animate={
            reduceMotion || paused ? undefined : { x: ["0%", "-33.333%"] }
          }
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {track.map((ally, i) => (
            <AllyChip key={`${ally.abbr}-${i}`} ally={ally} />
          ))}
        </motion.div>
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
      className="relative overflow-hidden bg-background py-20 text-foreground sm:py-24"
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5">
            <BadgeCheck className="size-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              100% legal · Perú
            </span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Invierte con la tranquilidad de una{" "}
            <span className="text-primary">plataforma 100% legal</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Cumplimiento, custodia y trazabilidad — desliza para conocer cada
            pilar.
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

      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Aliados regulatorios &amp; institucionales
          </p>
          <AlliesMarquee />
        </motion.div>
      </div>
    </section>
  );
}
