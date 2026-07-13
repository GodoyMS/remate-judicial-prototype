"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Sin comisiones de apertura",
  "Inversión desde S/ 500",
  "Propiedades verificadas legalmente",
  "Retornos de hasta 22% anual",
];

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-muted/40 py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 12%, transparent) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Rocket className="size-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Nuevas subastas disponibles
            </span>
          </div>

          <h2 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Empieza a generar retornos{" "}
            <span className="text-primary">desde hoy mismo</span>
          </h2>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Únete a más de 3,200 inversores que ya están aprovechando las
            mejores oportunidades en remates judiciales del Perú.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-3"
        >
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground/80">{b}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            asChild
            className="group h-13 rounded-full bg-primary px-10 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90"
          >
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-13 rounded-full border-border bg-card px-10 text-base font-semibold text-foreground hover:bg-muted"
          >
            <Link href="/login">Ya tengo cuenta</Link>
          </Button>
        </motion.div>

        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          Registro gratuito. Sin tarjeta de crédito requerida. Tus datos están
          protegidos con encriptación bancaria.
        </p>
      </div>
    </section>
  );
}
