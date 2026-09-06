"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";
import { Testimonials } from "@/components/landing/Testimonials";
import { LANDING_TESTIMONIALS_BG_SRC } from "@/lib/landing/media";

export function SocialProof() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      data-nav-tone="dark"
      className="relative isolate w-full overflow-hidden bg-[#0a0c12] py-24 sm:py-28"
    >
      {/* Full-bleed luxury residence background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LANDING_TESTIMONIALS_BG_SRC}
          alt=""
          className="size-full object-cover object-[center_40%]"
        />
        {/* Readability veil — keeps the photo present while protecting UI contrast */}
        <div className="absolute inset-0 bg-[#0a0c12]/55" />
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0c12]/75 via-[#0a0c12]/45 to-[#0a0c12]/80" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 0%, rgba(10,12,18,0.55) 100%)",
          }}
        />
        {/* Soft brand wash */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 70% 30%, color-mix(in oklch, var(--brand) 22%, transparent) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] section-padding">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 flex max-w-xl flex-col items-center text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <Users className="size-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Testimonios
            </span>
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Lo que dicen nuestros{" "}
            <span className="text-primary">inversores</span>
          </h2>
          <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
            Cuatro perfiles distintos: una primera inversión, una cartera con
            varias operaciones, provincia y jubilación.
          </p>
        </motion.div>

        <Testimonials tone="onMedia" />
      </div>
    </section>
  );
}
