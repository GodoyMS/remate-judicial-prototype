"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Layers,
  BarChart3,
  Clock,
  Headphones,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Inversión 100% asegurada",
    desc: "Cada inversión está respaldada por garantías legales. Tu capital está protegido durante todo el proceso de subasta.",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Proceso legal transparente",
    desc: "Accede a toda la documentación judicial: expedientes, tasaciones y estado del proceso en tiempo real.",
    highlight: false,
  },
  {
    icon: Layers,
    title: "Inversión fraccionada",
    desc: "No necesitas comprar una propiedad entera. Invierte desde S/ 500 y diversifica en múltiples propiedades.",
    highlight: false,
  },
  {
    icon: BarChart3,
    title: "Retornos competitivos",
    desc: "Retornos promedio de 18–22% anual, muy por encima de los instrumentos financieros tradicionales.",
    highlight: false,
  },
  {
    icon: Clock,
    title: "Ciclos cortos de inversión",
    desc: "La mayoría de procesos se resuelven en 3–8 meses, ideal para quienes buscan liquidez y rotación de capital.",
    highlight: false,
  },
  {
    icon: Headphones,
    title: "Soporte especializado",
    desc: "Nuestro equipo de asesores legales y financieros está disponible para resolver cualquier duda en tiempo real.",
    highlight: false,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const { icon: Icon, title, desc, highlight } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className={cn(
        "group flex h-full min-h-[220px] flex-col gap-5 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 sm:min-h-[200px]",
        highlight
          ? "border-primary/30 bg-gradient-to-br from-accent to-card shadow-lg shadow-primary/5 hover:shadow-xl"
          : "border-foreground/8 bg-card hover:border-primary/40 hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          highlight
            ? "bg-primary/20 ring-1 ring-primary/30"
            : "bg-primary/20 ring-1 ring-primary/25"
        )}
      >
        <Icon className="size-5 text-primary" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3
          className={cn(
            "font-semibold leading-snug",
            highlight ? "text-base text-foreground" : "text-sm text-foreground"
          )}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>

      {highlight && (
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary">
          <ShieldCheck className="size-3.5 shrink-0" />
          Garantía legal en cada operación
        </div>
      )}
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="nosotros" className="relative overflow-hidden bg-card py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 flex max-w-2xl flex-col items-center text-center sm:mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-accent px-4 py-1.5">
            <Sparkles className="size-3.5 text-accent-foreground" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-foreground">
              Por qué Remata
            </span>
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Todo lo que necesitas para invertir de forma{" "}
            <span className="text-primary">inteligente</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Combinamos tecnología financiera con experiencia legal para darte la
            ventaja en cada subasta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
