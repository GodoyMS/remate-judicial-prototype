"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlipCardPalette = "default" | "custody" | "auction" | "settled";

type FlipCardProps = {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  answer: string;
  palette?: FlipCardPalette;
  className?: string;
};

const palettes: Record<
  FlipCardPalette,
  {
    overlay: string;
    back: string;
    chip: string;
    hint: string;
  }
> = {
  default: {
    overlay:
      "bg-linear-to-t from-black/80 via-black/35 to-black/10",
    back: "bg-[oklch(from_var(--brand)_0.22_calc(c*0.12)_h)]",
    chip: "bg-white/15 text-white",
    hint: "text-white/80",
  },
  custody: {
    overlay:
      "bg-linear-to-t from-[#0b1b33]/90 via-[#123056]/45 to-[#1a3a5c]/15",
    back: "bg-[#10243f]",
    chip: "bg-sky-300/20 text-sky-100",
    hint: "text-sky-100/80",
  },
  auction: {
    overlay:
      "bg-linear-to-t from-[#2a1608]/90 via-[#6b3a12]/40 to-[#c47a2a]/15",
    back: "bg-[#2c1708]",
    chip: "bg-amber-300/20 text-amber-100",
    hint: "text-amber-100/80",
  },
  settled: {
    overlay:
      "bg-linear-to-t from-[#0c2418]/90 via-[#14532d]/40 to-[#16a34a]/15",
    back: "bg-[#10281c]",
    chip: "bg-emerald-300/20 text-emerald-100",
    hint: "text-emerald-100/80",
  },
};

/**
 * Image-first flip card. Hover on fine pointers, tap on touch, keyboard
 * toggle for everyone. Reduced motion crossfades instead of rotating.
 */
export function FlipCard({
  image,
  imageAlt,
  eyebrow,
  title,
  answer,
  palette = "default",
  className,
}: FlipCardProps) {
  const reduceMotion = useReducedMotion();
  const answerId = useId();
  const [flipped, setFlipped] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const tone = palettes[palette];

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverCapable(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const toggle = () => setFlipped((value) => !value);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("h-full min-h-[280px]", className)}
    >
      <button
        type="button"
        aria-expanded={flipped}
        aria-controls={answerId}
        onClick={() => {
          if (!hoverCapable || reduceMotion) toggle();
        }}
        onMouseEnter={() => {
          if (hoverCapable && !reduceMotion) setFlipped(true);
        }}
        onMouseLeave={() => {
          if (hoverCapable && !reduceMotion) setFlipped(false);
        }}
        onFocus={() => {
          if (!hoverCapable) setFlipped(true);
        }}
        onBlur={() => {
          if (!hoverCapable) setFlipped(false);
        }}
        className={cn(
          "group relative block h-full w-full cursor-pointer rounded-3xl text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        )}
      >
        <span className="sr-only">
          {flipped ? "Ocultar respuesta" : "Mostrar respuesta"}
        </span>

        <div className="h-full [perspective:1400px]">
          <div
            className={cn(
              "flip-card-inner relative h-full min-h-[280px] [transform-style:preserve-3d]",
              !reduceMotion &&
                "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              flipped && !reduceMotion && "[transform:rotateY(180deg)]"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 overflow-hidden rounded-3xl border border-white/10",
                "[backface-visibility:hidden]",
                reduceMotion && flipped && "opacity-0"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={imageAlt}
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className={cn("absolute inset-0", tone.overlay)} aria-hidden />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6">
                {eyebrow ? (
                  <span
                    className={cn(
                      "inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                      tone.chip
                    )}
                  >
                    {eyebrow}
                  </span>
                ) : null}
                <h3 className="max-w-[18ch] text-balance text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
                  {title}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium",
                    tone.hint
                  )}
                >
                  <RotateCw className="size-3.5" aria-hidden />
                  {hoverCapable ? "Pasa el cursor para ver" : "Toca para ver"}
                </span>
              </div>
            </div>

            <div
              id={answerId}
              className={cn(
                "absolute inset-0 overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-7",
                "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                tone.back,
                reduceMotion &&
                  (flipped ? "opacity-100 [transform:none]" : "pointer-events-none opacity-0 [transform:none]")
              )}
            >
              <div className="flex h-full flex-col justify-between">
                {eyebrow ? (
                  <span
                    className={cn(
                      "inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                      tone.chip
                    )}
                  >
                    {eyebrow}
                  </span>
                ) : (
                  <span className="type-label text-white/50">Respuesta</span>
                )}
                <p className="mt-6 text-pretty text-sm leading-relaxed text-white/90 sm:text-[15px]">
                  {answer}
                </p>
                <span
                  className={cn(
                    "mt-6 inline-flex items-center gap-1.5 text-xs font-medium",
                    tone.hint
                  )}
                >
                  <RotateCw className="size-3.5" aria-hidden />
                  {hoverCapable ? "Quita el cursor para volver" : "Toca para volver"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
