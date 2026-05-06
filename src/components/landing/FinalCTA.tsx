"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Sin comisiones de apertura",
  "Inversión desde S/ 500",
  "Propiedades verificadas legalmente",
  "Retornos de hasta 22% anual",
];

export function FinalCTA() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[400px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl section-padding text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5">
            <div className="size-1.5 rounded-full bg-accent-foreground animate-pulse" />
            <span className="text-xs font-semibold text-accent-foreground">
              Nuevas subastas disponibles ahora
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight text-balance">
            Empieza a generar retornos
            <br />
            desde hoy mismo
          </h2>

          <p className="text-lg text-primary-foreground/75 max-w-lg leading-relaxed">
            Únete a más de 3,200 inversores que ya están aprovechando las
            mejores oportunidades en remates judiciales del Perú.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-secondary shrink-0" />
              <span className="text-sm text-primary-foreground/85">{b}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            size="lg"
            asChild
            variant="secondary"
            className="rounded-full h-13 px-10    font-semibold text-base shadow-xl shadow-black/20 group"
          >
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            asChild
            className="rounded-full h-13 px-10 hover:bg-transparent  text-primary-foreground font-semibold text-base  hover:bg-accent  transition duration-300"
          >
            <Link href="/login">Ya tengo cuenta</Link>
          </Button>
        </motion.div>

        <p className="text-xs text-primary-foreground/50 max-w-sm">
          Registro gratuito. Sin tarjeta de crédito requerida.
          Tus datos están protegidos con encriptación bancaria.
        </p>
      </div>
    </section>
  );
}
