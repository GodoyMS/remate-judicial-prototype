"use client";

import { motion } from "framer-motion";
import { Shield, Award, CheckCircle2, Lock } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "Regulado por la SBS",
    desc: "Supervisados por la Superintendencia de Banca y Seguros del Perú",
  },
  {
    icon: Lock,
    title: "Datos encriptados",
    desc: "Encriptación de nivel bancario AES-256 para toda tu información",
  },
  {
    icon: CheckCircle2,
    title: "Propiedades verificadas",
    desc: "Cada propiedad es auditada por abogados especializados en remates",
  },
  {
    icon: Award,
    title: "Socio legal certificado",
    desc: "Aliados con los principales estudios jurídicos del país",
  },
];

const partners = [
  { name: "Poder Judicial", abbr: "PJ" },
  { name: "Sunarp", abbr: "SUNARP" },
  { name: "Colegio Notarial", abbr: "CNL" },
  { name: "INDECOPI", abbr: "INDECOPI" },
  { name: "SBS", abbr: "SBS" },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-white border-y border-border/60">
      <div className="mx-auto max-w-7xl section-padding">
        {/* Partners */}
        <div className="flex flex-col items-center gap-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Integrado con entidades oficiales del Estado Peruano
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                <div className="h-8 px-3 rounded-md border border-border/80 flex items-center justify-center">
                  <span className="text-xs font-bold tracking-tight">{p.abbr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-5 hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <b.icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
