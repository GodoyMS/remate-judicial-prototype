"use client";

import { motion } from "framer-motion";
import { PlayCircle, Sparkles } from "lucide-react";
import { PlatformVideoPlayer } from "@/components/landing/PlatformVideoPlayer";

const highlights = [
  { value: "4 pasos", label: "Del registro al retorno" },
  { value: "S/ 500", label: "Inversión mínima" },
  { value: "100%", label: "Propiedades verificadas" },
];

export function VideoSection() {
  return (
    <section
      id="demo"
      className="relative overflow-hidden bg-background py-20 sm:py-28"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[#9FE870]/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(22,51,0,0.05) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center sm:mb-14"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#9FE870]/30 bg-[#9FE870]/10 px-4 py-1.5">
            <PlayCircle className="size-3.5 text-[#163300]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#163300]">
              Demo en vivo
            </span>
          </div>

          <h2 className="text-balance text-4xl font-bold tracking-tight text-[#163300] sm:text-5xl">
            Descubre cómo{" "}
            <span className="relative inline-block">
              <span className="relative z-10">invertir en remates</span>
              <span className="absolute -bottom-1 left-0 h-3 w-full bg-[#9FE870]/40 -skew-x-3" />
            </span>{" "}
            en minutos
          </h2>

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
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
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-b from-[#9FE870]/20 via-[#9FE870]/5 to-transparent blur-2xl" />

          {/* Corner accents */}
          <div className="absolute -top-3 -left-3 size-16 rounded-tl-3xl border-t-2 border-l-2 border-[#9FE870]/40" />
          <div className="absolute -right-3 -bottom-3 size-16 rounded-br-3xl border-r-2 border-b-2 border-[#9FE870]/40" />

          <PlatformVideoPlayer />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 sm:mt-12 sm:gap-6"
        >
          {highlights.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-[#163300]/8 bg-white/60 px-3 py-4 text-center backdrop-blur-sm sm:px-5"
            >
              <span className="text-lg font-extrabold text-[#163300] sm:text-xl">
                {item.value}
              </span>
              <span className="text-[10px] leading-tight text-muted-foreground sm:text-xs">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-[#9FE870]" />
          <span>Presiona play o usa la barra de capítulos para saltar entre secciones</span>
        </motion.p>
      </div>
    </section>
  );
}
