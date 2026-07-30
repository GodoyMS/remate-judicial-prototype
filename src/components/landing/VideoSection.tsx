"use client";

import { motion } from "framer-motion";
import { PlatformVideoPlayer } from "@/components/landing/PlatformVideoPlayer";

export function VideoSection() {
  return (
    <section
      id="demo"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-20 sm:py-28"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center sm:mb-14"
        >
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Descubre cómo invertir en
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">remates en minutos</span>
              <span className="absolute -bottom-1 left-0 h-3 w-full bg-primary/40 -skew-x-3" />
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Mira el recorrido completo: desde explorar propiedades verificadas
            hasta recibir tus retornos. Sin complicaciones, sin sorpresas.
          </p>
        </motion.div>

        {/* Video player with decorative frame */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Glow behind player */}
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-2xl" />

          {/* Corner accents */}
          <div className="absolute -top-3 -left-3 size-16 rounded-tl-3xl border-t-2 border-l-2 border-primary/40" />
          <div className="absolute -right-3 -bottom-3 size-16 rounded-br-3xl border-r-2 border-b-2 border-primary/40" />

          <PlatformVideoPlayer />
        </motion.div>
      </div>
    </section>
  );
}
