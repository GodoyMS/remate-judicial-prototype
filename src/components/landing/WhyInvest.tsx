"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  Scale,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatCard = {
  id: string;
  value: string;
  label: string;
  headline: string;
  desc: string;
  accent: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
  tag: string;
};

const STATS: StatCard[] = [
  {
    id: "volume",
    value: "S/ 48M+",
    label: "En propiedades subastadas",
    headline: "Volumen real, no promesas",
    desc: "Millones adjudicados en remates judiciales verificados. Cada sol trazable hasta el expediente.",
    accent: "from-primary/80 via-primary/25 to-transparent",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=1200&fit=crop&auto=format&q=80",
    imageAlt: "Skyline financiero moderno",
    icon: Building2,
    tag: "Mercado",
  },
  {
    id: "investors",
    value: "3,200+",
    label: "Inversores activos",
    headline: "Una comunidad que ya confía",
    desc: "Miles de peruanos diversificando en activos inmobiliarios legales, desde S/ 500.",
    accent: "from-chart-2/80 via-chart-2/25 to-transparent",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&h=1200&fit=crop&auto=format&q=80",
    imageAlt: "Equipo de inversores colaborando",
    icon: UsersRound,
    tag: "Comunidad",
  },
  {
    id: "returns",
    value: "22% anual",
    label: "Retorno promedio",
    headline: "Rendimiento que supera al banco",
    desc: "Retornos promedio competitivos en ciclos cortos, con visibilidad total del proceso.",
    accent: "from-success/80 via-success/25 to-transparent",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&h=1200&fit=crop&auto=format&q=80",
    imageAlt: "Gráficos de rendimiento financiero",
    icon: ChartNoAxesCombined,
    tag: "Rendimiento",
  },
  {
    id: "legal",
    value: "100% legal",
    label: "Verificado judicialmente",
    headline: "Marco legal, no atajos",
    desc: "Cada operación respaldada por expediente judicial, SUNARP y cumplimiento normativo peruano.",
    accent: "from-accent/80 via-accent/30 to-transparent",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&h=1200&fit=crop&auto=format&q=80",
    imageAlt: "Documentación legal y martillo de juez",
    icon: Scale,
    tag: "Confianza",
  },
];

const VH_PER_CARD = 85;
const SNAP_COOLDOWN_MS = 1100;
const WHEEL_THRESHOLD = 12;
const TOUCH_THRESHOLD = 40;
const CARD_TRAVEL = 160;

function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function scrollToY(top: number) {
  const scroller = document.scrollingElement ?? document.documentElement;
  scroller.scrollTo({ top, behavior: "smooth" });
}

function StatCardView({
  stat,
  index,
  total,
}: {
  stat: StatCard;
  index: number;
  total: number;
}) {
  const Icon = stat.icon;

  return (
    <article
      className={cn(
        "relative grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]",
        "border border-border/50 bg-card shadow-[0_30px_80px_-20px] shadow-foreground/25",
        "ring-1 ring-black/5 dark:ring-white/10",
        "lg:grid-cols-[1.2fr_0.8fr] lg:min-h-[min(480px,58svh)]",
        "isolate"
      )}
    >
      <div className="relative min-h-52 overflow-hidden bg-muted sm:min-h-64 lg:min-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stat.image}
          alt={stat.imageAlt}
          className="absolute inset-0 size-full object-cover"
          loading={index === 0 ? "eager" : "lazy"}
          draggable={false}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/15 lg:bg-linear-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent" />
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-70",
            stat.accent
          )}
        />

        <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-7 sm:top-7">
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
            {stat.tag}
          </span>
          <span className="text-[10px] font-semibold tabular-nums text-white/70">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
          <p className="text-4xl font-black tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            {stat.value}
          </p>
          <p className="mt-2 max-w-sm text-sm font-medium text-white/85 sm:text-base">
            {stat.label}
          </p>
        </div>
      </div>

      <div className="relative flex flex-col justify-between gap-6 bg-card p-5 sm:p-7 lg:p-9">
        <div>
          <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon className="size-5" strokeWidth={2.25} />
          </div>
          <h3 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            {stat.headline}
          </h3>
          <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {stat.desc}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-border/60 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Rematto
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Por qué invertir con nosotros
            </p>
          </div>
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden>
            {STATS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-700 ease-out",
                  i === index
                    ? "w-7 bg-primary"
                    : i < index
                      ? "w-1.5 bg-primary/45"
                      : "w-1.5 bg-border"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CardNav({
  active,
  onStep,
  locked,
}: {
  active: number;
  onStep: (dir: 1 | -1) => void;
  locked: boolean;
}) {
  const atStart = active <= 0;
  const atEnd = active >= STATS.length - 1;
  const progress = STATS.length <= 1 ? 1 : active / (STATS.length - 1);

  return (
    <div className="relative z-50 flex shrink-0 flex-col items-center gap-2 pointer-events-auto">
      <button
        type="button"
        aria-label="Tarjeta anterior"
        disabled={atStart || locked}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStep(-1);
        }}
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-md transition-all duration-200",
          "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border/70 disabled:hover:bg-card disabled:hover:text-foreground"
        )}
      >
        <ChevronUp className="size-4" strokeWidth={2.25} />
      </button>

      <div className="relative my-1 flex h-24 w-px flex-col items-center sm:h-32">
        <div className="absolute inset-0 rounded-full bg-border/70" />
        <motion.div
          className="absolute top-0 h-full w-px origin-top rounded-full bg-primary"
          initial={false}
          animate={{ scaleY: Math.max(0.08, progress) }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
        <span className="absolute top-1/2 -right-5 -translate-y-1/2 text-[10px] font-bold tabular-nums text-muted-foreground">
          {String(active + 1).padStart(2, "0")}
        </span>
      </div>

      <button
        type="button"
        aria-label="Siguiente tarjeta"
        disabled={atEnd || locked}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStep(1);
        }}
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-md transition-all duration-200",
          "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border/70 disabled:hover:bg-card disabled:hover:text-foreground"
        )}
      >
        <ChevronDown className="size-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}

function ReducedMotionGrid() {
  return (
    <section
      id="por-que-invertir"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-24"
    >
      <div className="mx-auto max-w-350 section-padding">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            ¿Por qué invertir en <span className="text-primary">Rematto</span>?
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.id}
                className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
              >
                <div className="relative h-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stat.image}
                    alt={stat.imageAlt}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="font-bold text-foreground">{stat.headline}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {stat.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const cardVariants = {
  enter: (dir: number) => ({
    y: dir >= 0 ? CARD_TRAVEL : -CARD_TRAVEL,
    opacity: 0,
    scale: 0.92,
    rotate: dir >= 0 ? 5 : -5,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? -CARD_TRAVEL : CARD_TRAVEL,
    opacity: 0,
    scale: 0.92,
    rotate: dir >= 0 ? -5 : 5,
  }),
};

export function WhyInvest() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <ReducedMotionGrid />;
  return <WhyInvestScroll />;
}

function WhyInvestScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [locked, setLocked] = useState(false);
  const activeRef = useRef(0);
  const lockedRef = useRef(false);
  const programmaticRef = useRef(false);
  const unlockTimerRef = useRef(0);

  activeRef.current = active;
  lockedRef.current = locked;

  const getSnapTop = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return getScrollY();
    const absoluteTop = track.getBoundingClientRect().top + getScrollY();
    const range = Math.max(1, track.offsetHeight - window.innerHeight);
    return absoluteTop + ((index + 0.5) / STATS.length) * range;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(STATS.length - 1, index));
      if (clamped === activeRef.current) return false;
      if (lockedRef.current) return false;

      const dir: 1 | -1 = clamped > activeRef.current ? 1 : -1;
      setDirection(dir);
      setActive(clamped);
      activeRef.current = clamped;

      setLocked(true);
      lockedRef.current = true;
      programmaticRef.current = true;

      scrollToY(getSnapTop(clamped));

      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = window.setTimeout(() => {
        setLocked(false);
        lockedRef.current = false;
        programmaticRef.current = false;
      }, SNAP_COOLDOWN_MS);

      return true;
    },
    [getSnapTop]
  );

  const step = useCallback(
    (dir: 1 | -1) => goTo(activeRef.current + dir),
    [goTo]
  );

  // Keep active in sync when the user scrolls the page normally
  useEffect(() => {
    const onScroll = () => {
      if (programmaticRef.current) return;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const range = track.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const progress = Math.min(1, Math.max(0, -rect.top / range));
      const idx = Math.min(
        STATS.length - 1,
        Math.max(0, Math.floor(progress * STATS.length + 0.0001))
      );

      if (idx !== activeRef.current) {
        setDirection(idx > activeRef.current ? 1 : -1);
        setActive(idx);
        activeRef.current = idx;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Wheel / touch / keyboard → same goTo path as buttons
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let touchStartY = 0;
    let touchArmed = false;

    const isPinned = () => {
      const rect = track.getBoundingClientRect();
      return rect.top <= 8 && rect.bottom >= window.innerHeight - 8;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isPinned()) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const next = activeRef.current + dir;
      if (next < 0 || next >= STATS.length) return;
      e.preventDefault();
      step(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!isPinned()) return;
      touchArmed = true;
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchArmed || !isPinned()) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchStartY - y;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      const next = activeRef.current + dir;
      if (next < 0 || next >= STATS.length) {
        touchArmed = false;
        return;
      }
      e.preventDefault();
      touchArmed = false;
      step(dir);
    };

    const onTouchEnd = () => {
      touchArmed = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isPinned()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (step(1)) e.preventDefault();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (step(-1)) e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(unlockTimerRef.current);
    };
  }, [step]);

  const stat = STATS[active]!;

  return (
    <section
      id="por-que-invertir"
      data-nav-tone="light"
      className="relative bg-background"
    >
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${STATS.length * VH_PER_CARD}svh` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[20%] size-130 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
          aria-hidden
        />

        <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-16">
          <div className="mx-auto w-full max-w-350 shrink-0 section-padding pt-6 pb-3 text-center sm:pt-8 sm:pb-4">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              ¿Por qué invertir en{" "}
              <span className="text-primary">Rematto</span>?
            </h2>
          </div>

          <div className="relative mx-auto flex min-h-0 w-full max-w-350 flex-1 items-center gap-3 section-padding pb-8 sm:gap-5 lg:gap-6">
            <div className="relative min-h-0 min-w-0 flex-1 self-stretch overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={stat.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 flex items-center justify-center will-change-transform"
                >
                  <StatCardView
                    stat={stat}
                    index={active}
                    total={STATS.length}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <CardNav active={active} onStep={step} locked={locked} />
          </div>
        </div>
      </div>
    </section>
  );
}
